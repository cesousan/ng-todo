import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Todo, User } from 'src/app/models/model';
@Component({
  selector: 'app-sub-feature',
  templateUrl: './sub-feature.component.html',
  styleUrls: ['./sub-feature.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubFeatureComponent {
  @Input() users: User[];
  @Input() todos: Todo[];

  @Output() todoToggled = new EventEmitter<Todo>()

  trackByFn(index: number, todo: Todo) {
    return todo.id || null;
  }

  getUser(todo: Todo) {
    return todo && this.users ? this.users.filter(u => todo.userId === u.id)[0] : null;
  }

  toggleTodo(todo: Todo) {
    console.log('clicked and about to emit');
    this.todoToggled.emit(todo);
  }
}
