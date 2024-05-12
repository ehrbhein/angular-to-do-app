import { Component, OnInit } from '@angular/core';
import { TasksTableComponent } from './tasks-table/tasks-table.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { Status } from '../models/task';

@Component({
  selector: 'tasks',
  standalone: true,
  imports: [NgIf, TasksTableComponent, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  public showInvalidCreateTaskForm: boolean = false;
  public readonly statuses: any = Status;

  constructor() {}

  public createTasksForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  ngOnInit(): void {}

  onCreateTaskSubmit(): void {




    this.showInvalidCreateTaskForm = false;
  }
}
