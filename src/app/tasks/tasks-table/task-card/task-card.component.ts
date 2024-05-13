import { Component, Input, OnInit } from '@angular/core';
import { Status, Task } from '../../../models/task';
import { NgFor, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Roles } from '../../../models';
import { UpdateTaskModalService } from '../../update-task-modal/update-task-modal.service';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() allowEdit!: boolean;
  @Input() currentUserRole!: string;

  // private readonly editOptionsMap: Map<string, string[]> = new Map<
  //   string,
  //   string[]
  // >([
  //   [
  //     Roles.DEVELOPER.toString(),
  //     [Status.TO_DO.toString(), Status.DONE.toString()],
  //   ],
  //   [
  //     Roles.ADMIN.toString(),
  //     [
  //       Status.TO_DO.toString(),
  //       Status.DENIED.toString(),
  //       Status.DONE.toString(),
  //     ],
  //   ],
  // ]);

  public showEditOptions!: string[];

  public updateTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  private modalService!: UpdateTaskModalService;

  constructor(
    private taskService: TaskService,
    updateTaskModalService: UpdateTaskModalService
  ) {
    this.modalService = updateTaskModalService;
  }

  ngOnInit(): void {}

  public openUpdateModal(): void {
    this.modalService.openUpdateTasksModal(this.task, this.currentUserRole);
  }
}
