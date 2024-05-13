import { Component, OnInit } from '@angular/core';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import { Status, Task } from '../../models/task';
import { TaskUpdateService } from '../task-update.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'tasks-table',
  standalone: true,
  imports: [NgFor,TaskCardComponent],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
})
export class TasksTableComponent implements OnInit {
  public savedTasks!: Task[];

  public awaitedTasks!: Task[];
  public toDoTasks!: Task[];
  public doneTasks!: Task[];

  constructor(
    private taskService: TaskService,
    private taskUpdateService: TaskUpdateService
  ) {
    taskUpdateService.taskUpdatedAnnounced.subscribe((context) => {
      this.initializeAndSortTasks();
    });
  }

  ngOnInit(): void {
    this.initializeAndSortTasks();
  }

  private getAllTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.taskService.getAllTasks().subscribe(
        (res) => {
          if (res.status == 200) {
            this.savedTasks = res.body;
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

  private async initializeAndSortTasks(): Promise<void> {
    await this.getAllTasks();

    this.awaitedTasks = this.filterTaskByStatus(
      Status.AWAITED.toString(),
      this.savedTasks
    );
    console.dir(this.awaitedTasks);

    this.toDoTasks = this.filterTaskByStatus(
      Status.TO_DO.toString(),
      this.savedTasks
    );

    this.doneTasks = this.filterTaskByStatus(
      Status.DONE.toString(),
      this.savedTasks
    );
  }

  private filterTaskByStatus(status: string, target: any): Task[] {
    return target.filter(function (it: Task) {
      return it.status === status;
    });
  }
}
