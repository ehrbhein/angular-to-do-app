import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * Get All user request.
   */
  getAllUsers(): Observable<any> {
    console.dir("from user service");
    return this.http
      .get<any>('http://localhost:4200/users', { observe: 'response' })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  /**
   * Add a new user post requts.
   * @param user a new user to add.
   */
  addUser(user: any): Observable<any> {
    return this.http
      .post<any>('http://localhost:4200/user', user, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete an user request method.
   * @param userId user unique id
   */
  deleteUser(userId: any) {
    return this.http
      .delete<any>('http://localhost:4200/user/' + userId, {
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
