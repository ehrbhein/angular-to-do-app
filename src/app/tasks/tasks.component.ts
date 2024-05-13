import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'tasks',
  standalone: true,
  imports: [NgIf, TasksTableComponent, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;

  public showInvalidCreateTaskForm: boolean = false;

  public showInvalidCreateTaskFormAlert: boolean = false;
  public showNewTaskCreatedAlert: boolean = false;

  private savedTasks!: any[];

  constructor(private taskService: TaskService) {}

  public createTasksForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  ngOnInit(): void {}

  async onCreateTaskSubmit(): Promise<void> {
    let newTaskId;
    await this.getAllTasks();
    this.showInvalidCreateTaskForm = false;

    if (this.createTasksForm.status === 'INVALID') {
      this.showInvalidCreateTaskForm = true;
      return;
    }

    console.dir(this.savedTasks.length);

    if (this.savedTasks.length === 0) {
      newTaskId = 0;
    } else {
      this.savedTasks.sort((a, b) => b.id - a.id);
      newTaskId = this.savedTasks[0].id + 1;
      console.dir(this.savedTasks[0]);
      console.dir(this.savedTasks);
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
