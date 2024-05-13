import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskUpdateService {
  private tasksUpdatedSource = new Subject<any>();

  public taskUpdatedAnnounced = this.tasksUpdatedSource.asObservable();

  constructor() {}

  public broadCastUpdate(context: any) {
    this.tasksUpdatedSource.next(context);
  }
}
