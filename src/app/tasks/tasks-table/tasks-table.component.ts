import { Component } from '@angular/core';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'tasks-table',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss'
})
export class TasksTableComponent {

  public savedTasks!: any[];

  constructor(private taskService:TaskService){

  }

  private getAllTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.taskService.getAllTasks().subscribe(
        (res) => {
          if (res.status == 200) {
            this.savedTasks = res.body;
            console.dir(this.savedTasks);
            resolve();
          }
          reject(undefined);
        },
        (err) => {
          console.error('Error Occurred When Get All Tasks ' + err);
          reject(undefined);
        }
      );
    });
  }

}
