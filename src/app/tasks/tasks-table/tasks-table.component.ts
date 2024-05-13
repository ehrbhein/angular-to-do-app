import { Component, Input, OnInit } from '@angular/core';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import { Status, Task } from '../../models/task';
import { TaskUpdateService } from '../task-update.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthorizedUser, Roles, User } from '../../models';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'tasks-table',
  standalone: true,
  imports: [NgFor, TaskCardComponent, NgIf],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
})
export class TasksTableComponent implements OnInit {
  public savedTasks!: Task[];
  public currentUser!: User;

  public awaitedTasks!: Task[];
  public toDoTasks!: Task[];
  public doneTasks!: Task[];
  public showAwaitedTasks: boolean = false;
  public isLoading: boolean = true;

  public allowEditToCards: boolean = false;
  private readonly allowedRolesForEdit: string[] = [
    Roles.DEVELOPER.toString(),
    Roles.ADMIN.toString(),
  ];
  private readonly allowedRolesToViewAwaitedSection: string[] = [
    Roles.MANAGER.toString(),
    Roles.ADMIN.toString(),
  ];

  constructor(
    private taskService: TaskService,
    private taskUpdateService: TaskUpdateService,
    private userService: UserService
  ) {
    taskUpdateService.taskUpdatedAnnounced.subscribe((context) => {
      this.initializeAndSortTasks();
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initializeAndSortTasks();
    await this.getCurrentLoggedInUser();
    this.initializePermissions();

    this.isLoading = false;
  }

  private initializePermissions(): void {
    this.allowEditToCards = this.allowedRolesForEdit.includes(
      this.currentUser.role
    );

    this.showAwaitedTasks = this.allowedRolesToViewAwaitedSection.includes(
      this.currentUser.role
    );
  }

  private getCurrentLoggedInUser(): void {
    let userResponse: AuthorizedUser | null =
      this.userService.getLoggedInUser();

    if (userResponse !== null) {
      this.currentUser = userResponse.user;
    }
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
