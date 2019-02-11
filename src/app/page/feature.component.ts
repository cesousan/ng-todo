import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { BackendService } from '../services/backend/backend.service';
import { map, tap, debounceTime, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { Todo, TodoFilters, User } from '../models/model';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent implements OnInit {

  public TodoFiltersRef: typeof TodoFilters = TodoFilters;

  public todos$: Observable<Todo[]>;
  public usernames$: Observable<string>;

  private showFilter: BehaviorSubject<Filter> = new BehaviorSubject(visibilityFilter(TodoFilters.SHOW_ALL));
  private todoFilter$ = this.showFilter.asObservable();
  
  private inputNames: BehaviorSubject<string> = new BehaviorSubject('');
  private inputNames$ = this.inputNames.asObservable();
  
  constructor(private backend: BackendService) { }

  ngOnInit() {
    
    const users$ = this.backend.fetchUsers();

    const searchedUsers$: Observable<User[]> = this.inputNames$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      withLatestFrom(users$),
      map(([input, users]) => input !== ''
      ? users.filter(user =>
        user.username.toLowerCase().includes(input.toLowerCase()) ||
        user.name.toLowerCase().includes(input.toLowerCase()))
      : users
      ),
    );
    
    this.usernames$ = searchedUsers$.pipe(map(getFullName));
    

    this.todos$ = combineLatest(this.backend.fetchTodos(), this.todoFilter$, searchedUsers$).pipe(
      map(([todos, filter, searched]) => searched
        .map(getUsersTodo(todos))
        .reduce((acc, curr) => ([...acc, ...curr]), [])  
        .filter(filter))
    );

  };

  filterTodos(filter: TodoFilters) {
    this.showFilter.next(visibilityFilter(filter));
  };

  searchUser(name: string) {
    this.inputNames.next(name);
  }

}

const getUsersTodo = (todos: Todo[]) => (user: User): Todo[] => {
  return todos.filter(t => t.userId === user.id)
};

const getFullName = ({name, username}: User): string => name && username ? `${name.split(' ')[0]} "${username}" ${name.split(' ')[1]}` : ''; 

const visibilityFilter = (todoFilter: TodoFilters): Filter => {
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

interface Filter {
  (todo:Todo): boolean
}