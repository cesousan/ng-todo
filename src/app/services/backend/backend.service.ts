import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo, User } from '../../models/model';
import { Observable } from 'rxjs';

const url = 'https://jsonplaceholder.typicode.com';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  fetchTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${url}/todos`);
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${url}/users`)
  }
}
