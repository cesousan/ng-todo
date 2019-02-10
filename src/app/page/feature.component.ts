import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { BackendService } from '../services/backend/backend.service';
import { map } from 'rxjs/operators';
import { Todo, TodoFilters } from '../models/model';

const url = 'https://jsonplaceholder.typicode.com/todos';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent implements OnInit {

  public TodoFiltersRef: typeof TodoFilters = TodoFilters;

  public todos$: Observable<Todo[]>;

  private showFilter: BehaviorSubject<Filter> = new BehaviorSubject(visibilityFilter(TodoFilters.SHOW_ALL));
  private todoFilter$ = this.showFilter.asObservable();

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.todos$ = combineLatest(this.backend.fetchData(url), this.todoFilter$).pipe(
      map(([content, filter]) => content.filter(filter))
    );
  };

  filterTodos(filter: TodoFilters) {
    this.showFilter.next(visibilityFilter(filter));
  };
}



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