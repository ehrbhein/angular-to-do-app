import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { User } from '../../models';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  private readonly USERS_KEY: string = 'users';
  private readonly TASKS_KEY: string = 'tasks';

  constructor(private http: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }

  /**
   * Handle request's and support with mock data.
   * @param req
   * @param next
   */
  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    const { url, method } = req;

    const usersString = this.getUsers();
    const registeredUsers: any[] =
      usersString === '' ? [] : JSON.parse(usersString);

    const tasksString = this.getTasks();
    const savedTasks: any[] = tasksString === '' ? [] : JSON.parse(tasksString);

    // user
    if (url.endsWith('/user') && method === 'GET') {
      const responseBody = registeredUsers;

      return of(new HttpResponse({ status: 200, body: responseBody })).pipe(
        delay(500)
      );
    }
    if (url.endsWith('/user') && method === 'POST') {
      let newUser = req.body;
      let duplicateUser = registeredUsers.filter(
        (user) => user.username === newUser.username
      ).length;

      if (duplicateUser) {
        return throwError({
          error: {
            message: 'Username "' + newUser.username + '" is already taken',
          },
        });
      }

      registeredUsers.push(newUser);
      this.saveUsers(JSON.stringify(registeredUsers));

      return of(new HttpResponse({ status: 200, body: newUser })).pipe();
    }
    if (url.match(/\/user\/.*/) && method === 'DELETE') {
      const empId = this.getEmployeeId(url);
      return of(new HttpResponse({ status: 200, body: empId })).pipe(
        delay(500)
      );
    }
    // task
    if (url.endsWith('/task') && method === 'GET') {
      const responseBody = savedTasks;

      return of(new HttpResponse({ status: 200, body: responseBody })).pipe(
        delay(500)
      );
    }

    if (url.endsWith('/task') && method === 'POST') {
      let newTask = req.body;

      savedTasks.push(newTask);
      this.saveTasks(JSON.stringify(savedTasks));

      return of(new HttpResponse({ status: 200, body: newTask })).pipe();
    }

    if (url.match(/\/task\/.*/) && method === 'PUT') {
      const taskToUpdateId = this.getTaskId(url);
      const updateRequest = req.body;

      const updateTasks = savedTasks.map((task) => {
        if (task.id == taskToUpdateId) {
          return {
            ...task,
            title: updateRequest.title,
            description: updateRequest.description,
            status: updateRequest.status,
          };
        } else {
          return task;
        }
      });

      this.saveTasks(JSON.stringify(updateTasks));

      return of(new HttpResponse({ status: 200, body: updateRequest })).pipe();
    }
    if (url.match(/\/task\/.*/) && method === 'DELETE') {
      const taskToRemoveId = this.getTaskId(url);

      const updatedTasks = savedTasks.filter(
        (task) => task.id != taskToRemoveId
      );

      this.saveTasks(JSON.stringify(updatedTasks));

      return of(new HttpResponse({ status: 200, body: taskToRemoveId })).pipe();
    }
    // if there is not any matches return default request.
    return next.handle(req);
  }

  /**
   * Get Employee unique uuid from url.
   * @param url
   */
  getEmployeeId(url: any) {
    const urlValues = url.split('/');
    return urlValues[urlValues.length - 1];
  }

  getTaskId(url: any) {
    const urlValues = url.split('/');
    return urlValues[urlValues.length - 1];
  }

  private saveUsers(usersObject: string): void {
    localStorage.setItem(this.USERS_KEY, usersObject);
  }
  private getUsers(): string {
    const usersObject = localStorage.getItem(this.USERS_KEY);
    return usersObject === null ? '' : usersObject;
  }

  private saveTasks(tasksObject: string): void {
    localStorage.setItem(this.TASKS_KEY, tasksObject);
  }
  private getTasks(): string {
    const tasksObject = localStorage.getItem(this.TASKS_KEY);
    return tasksObject === null ? '' : tasksObject;
  }
}

/**
 * Mock backend provider definition for app.module.ts provider.
 */
export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendHttpInterceptor,
  multi: true,
};
