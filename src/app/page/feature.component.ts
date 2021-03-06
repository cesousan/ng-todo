import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { BackendService } from '../services/backend/backend.service';
import { map, tap, debounceTime, distinctUntilChanged, withLatestFrom, startWith, scan, concatAll, toArray, filter, switchMap } from 'rxjs/operators';
import { Todo, TodoFilters, User } from '../models/model';
import { FormControl } from '@angular/forms';
import { all } from 'q';


@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FeatureComponent implements OnInit {

  public userSearchCtrl: FormControl = new FormControl();

  public TodoFiltersRef: typeof TodoFilters = TodoFilters;

  public todos$: Observable<Todo[]>;
  public usernames$: Observable<string[]>;
  public users$: Observable<User[]>;

  private showFilter: BehaviorSubject<FilterFn> = new BehaviorSubject(visibilityFilter(TodoFilters.SHOW_ALL));
  private todoFilter$ = this.showFilter.asObservable();
  
  private changedTodo: BehaviorSubject<Observable<Todo>> = new BehaviorSubject(of(null));

  constructor(private backend: BackendService) {}

  ngOnInit() {
    
    this.users$ = this.backend.fetchUsers();

    const searchedUsers$ = this.userSearchCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      withLatestFrom(this.users$),
      map(([input, users]) => input !== ''
      ? users.filter(user =>
        user.username.toLowerCase().includes(input.toLowerCase()) ||
        user.name.toLowerCase().includes(input.toLowerCase()))
      : users
      )
    );

    this.usernames$ = searchedUsers$.pipe(map(u => getFullNames(u)));
    
    const changedTodos$: Observable<Todo[]> = this.changedTodo.asObservable().pipe(
      switchMap(x => x),
      scan((acc:Todo[], curr:Todo)=> {
        const indexOfCurr = (): number => acc.map(x => x.id).indexOf(curr.id);
        if(curr === null)
          return acc;

        return indexOfCurr() === -1
          ? [...acc, curr]
          : [
            ...acc.slice(0, indexOfCurr()),
            curr,
            ...acc.slice(indexOfCurr() + 1)
          ]
        }, [])
      );

    const allTodos$: Observable<Todo[]> = combineLatest(
      this.backend.fetchTodos(),
      changedTodos$
    ).pipe(
      map(([all, changed]) => {
        if(changed === null)
          return all;

        const swap = (arr: Todo[], index: number, value: Todo) => [
          ...arr.slice(0, index),
          value,
          ...arr.slice(index + 1)
        ];
        return all.reduce((acc, curr, index) => {
          const toSwap = () => changed.filter(x => x.id === curr.id)[0];
          return changed.map(x => x.id).includes(curr.id)
            ? swap(acc, index, toSwap())
            : [...acc, curr] 
        }, []);
      })
    );

    this.todos$ = combineLatest(
      allTodos$,
      this.todoFilter$,
      searchedUsers$
    ).pipe(
      map(([todos, filter, searched]) => searched
        .map(getUsersTodo(todos))
        .reduce((acc, curr) => ([...acc, ...curr]), [])  
        .filter(filter)
      )
    );

  };

  filterTodos(filter: TodoFilters) {
    this.showFilter.next(visibilityFilter(filter));
  };

  toggleTodo(todo: Todo) {
    this.changedTodo.next(this.backend.toggleTodo(todo));
  }

}

const getUsersTodo = (todos: Todo[]) => (user: User): Todo[] => {
  return todos.filter(t => t.userId === user.id)
};

const getFullNames = (users: User[]): string[] =>
  users.map((user: User) => {
    const {name} = user;
    return name ? name : '';
  }
)
  
const visibilityFilter = (todoFilter: TodoFilters): FilterFn => {
  switch (todoFilter) {
    case TodoFilters.SHOW_COMPLETED:
      return todo => todo.completed;
    case TodoFilters.SHOW_TODO:
      return todo => !todo.completed;
    case TodoFilters.SHOW_ALL :
    default :
      return () => true
  }
};


interface FilterFn {
  (todo:Todo): boolean
}