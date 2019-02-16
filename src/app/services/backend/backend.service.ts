import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo, User } from '../../models/model';
import { Observable } from 'rxjs';
import { switchMap, concatAll } from 'rxjs/operators';

const url = 'https://jsonplaceholder.typicode.com';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  fetchTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${url}/todos`);
  }

  toggleTodo(todo: Todo): Observable<Todo> {
    return this.http.patch<Todo>(`${url}/todos/${todo.id}`, {
      completed: !todo.completed
    });
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${url}/users`)
  }

  fetchAvatars(todo: Todo): Observable<any> {
    return this.http.get<any>(`https://api.adorable.io/avatars/${todo.userId}`)
  }
}
