import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TasksTableComponent } from './tasks-table/tasks-table.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Status, Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { EventType, TaskUpdateService } from './task-update.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { Roles } from '../models';

@Component({
  selector: 'tasks',
  standalone: true,
  imports: [NgIf, TasksTableComponent, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;
  @ViewChild('closeAlertButton') closeAlertButton!: ElementRef;

  public showInvalidCreateTaskForm: boolean = false;

  public showInvalidCreateTaskFormAlert: boolean = false;
  public showNewTaskCreatedAlert: boolean = false;
  public userName!: string;
  public successAlertMessage!: string;
  public showSuccessAlert: boolean = false;
  public showCreateTaskButton: boolean = false;

  private readonly successMessageMap: Map<string, string> = new Map<
    string,
    string
  >([
    [EventType.CREATE.toString(), 'New task created successfully.'],
    [EventType.UPDATE.toString(), 'Task updated successfully!'],
    [EventType.DELETE.toString(), 'Task has been removed from project successfully.'],
  ]);

  private savedTasks!: any[];
  private userId!: String;

  constructor(
    private taskService: TaskService,
    private taskUpdateService: TaskUpdateService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private userService: UserService
  ) {
    activatedRoute.queryParams.subscribe((param) => {
      this.userId = param['userId'];
      this.userName = param['userName'];
    });

    taskUpdateService.taskUpdatedAnnounced.subscribe(async (context) => {
      this.initializeSuccessMessage(context.eventType);

      this.closeSuccessAlert();

    });
  }

  closeSuccessAlert():void{
    setTimeout(()=>{
      this.closeAlertButton.nativeElement.click();
      this.showSuccessAlert = false;
    }, 5000);
  }

  public createTasksForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.authService.authenticate(this.userId);
    this.initializeCreateTaskButton();
  }

  public logOut(): void {
    this.authService.removeAuthenticatedUser();
    this.router.navigateByUrl('/');
  }

  async onCreateTaskSubmit(): Promise<void> {
    let newTaskId;
    await this.getAllTasks();
    this.showInvalidCreateTaskForm = false;

    if (this.createTasksForm.status === 'INVALID') {
      this.showInvalidCreateTaskForm = true;
      return;
    }

    if (this.savedTasks.length === 0) {
      newTaskId = 0;
    } else {
      this.savedTasks.sort((a, b) => b.id - a.id);
      newTaskId = this.savedTasks[0].id + 1;
    }

    const newTask = new Task(
      newTaskId,
      this.createTasksForm.value.title,
      this.createTasksForm.value.description,
      Status.AWAITED.toString()
    );

    try {
      this.addTask(newTask);
    } catch (exception) {
      console.log(exception);
      return;
    }

    this.showNewTaskCreatedAlert = true;
    setTimeout(() => {
      this.showNewTaskCreatedAlert = false;
    }, 6000);

    this.closeModal();
    this.showInvalidCreateTaskForm = false;
    this.taskUpdateService.broadCastUpdate({
      context: newTask,
      eventType: EventType.CREATE,
    });
  }

  // private hideSuccessAlert(): void {
  //   this.showSuccessAlert = false;
  // }

  private initializeCreateTaskButton(): void {
    this.showCreateTaskButton =
      this.userService.getLoggedInUserRole() === Roles.MANAGER.toString();
  }

  private initializeSuccessMessage(eventType: string): void {
    this.successAlertMessage = this.successMessageMap.get(eventType) ?? '';

    if (this.successAlertMessage !== '') {
      // alert(this.successAlertMessage);
      this.showSuccessAlert = true;
    }
  }

  private closeModal(): void {
    this.closeModalButton.nativeElement.click();
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

  private addTask(task: Task): any {
    let response = null;

    this.taskService.addTask(task).subscribe(
      (resolve) => {
        if (resolve.status == 200) {
          response = resolve.body;
        }
      },
      (err) => console.error('Error Occurred When Adding New Task ' + err)
    );

    return response === null ? undefined : response;
  }
}
