import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<any> {
    return this.http
      .get<any>('/task', { observe: 'response' })
      .pipe(retry(3), catchError(this.handleError));
  }

  addTask(task: any): Observable<any> {
    return this.http
      .post<any>('/task', task, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  updateTask(taskId: number, task: any): Observable<any> {
    return this.http
      .put<any>('/task/' + taskId, task, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }
  deleteTask(taskId: number): Observable<any> {
    return this.http
      .delete<any>('/task/' + taskId, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
