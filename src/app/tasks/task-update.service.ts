import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskUpdateService {
  private tasksUpdatedSource = new Subject<any>();

  public taskUpdatedAnnounced = this.tasksUpdatedSource.asObservable();

  constructor() {}

  public broadCastUpdate(context: TaskBroadcastContext) {
    this.tasksUpdatedSource.next(context);
  }
}

export interface TaskBroadcastContext {
  context: any;
  eventType: EventType;
}

export enum EventType {
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}
