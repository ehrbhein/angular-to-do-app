import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthorizedUser, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private LOGGED_IN_USER_KEY = 'logged_in_user';

  constructor(private http: HttpClient) {}

  /**
   * Get All user request.
   */
  getAllUsers(): Observable<any> {
    return this.http.get<any>('/user', { observe: 'response' }).pipe(
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
      .post<any>('/user', user, {
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
      .delete<any>('/user/' + userId, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  public saveLoginUser(user: User): void {
    const hasLoggedInUser = this.getLoggedInUser !== null;

    if (hasLoggedInUser) {
      this.deleteLoggedInUser();
    }

    const authorizedUser = new AuthorizedUser(user);

    localStorage.setItem(
      this.LOGGED_IN_USER_KEY,
      JSON.stringify(authorizedUser)
    );
  }

  public getLoggedInUserRole(): string {
    const loggedInUser = this.getLoggedInUser();
    return loggedInUser?.user.role ?? '';
  }

  public getLoggedInUser(): AuthorizedUser | null {
    const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);

    if (user === undefined) {
      return null;
    }
    const userObj = JSON.parse(user as string);

    return { user: userObj.user };
  }

  public deleteLoggedInUser(): void {
    localStorage.removeItem(this.LOGGED_IN_USER_KEY);
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
