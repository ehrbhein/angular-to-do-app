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

  private readonly editOptionsMap: Map<string, string[]> = new Map<
    string,
    string[]
  >([
    [
      Roles.DEVELOPER.toString(),
      [Status.TO_DO.toString(), Status.DONE.toString()],
    ],
    [
      Roles.ADMIN.toString(),
      [
        Status.TO_DO.toString(),
        Status.DENIED.toString(),
        Status.DONE.toString(),
      ],
    ],
  ]);

  public showEditOptions!: string[];

  public updateTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.initializeEditOptions();
    this.initializeFormData();
  }

  public initializeEditOptions(): void {
    this.showEditOptions = this.editOptionsMap.get(this.currentUserRole) ?? [];
  }

  onSubmitUpdateForm(): void {
    if (this.updateTaskForm.status === 'INVALID') {
      return;
    }

    const updatedTask: Task = {
      id: this.task.id,
      title: this.updateTaskForm.value.title,
      description: this.updateTaskForm.value.description,
      status: this.updateTaskForm.value.status,
    };


    const response = this.updateTask(updatedTask);

    console.dir(response);

    if (response === undefined) {
      return;
    }

    alert('task updated');
  }

  private initializeFormData(): void {
    this.updateTaskForm.controls['title'].setValue(this.task.title);
    this.updateTaskForm.controls['status'].setValue(this.task.status);
    this.updateTaskForm.controls['description'].setValue(this.task.description);
  }

  private updateTask(updatedTask: Task): any {
    let response = null;
    this.taskService.updateTask(this.task.id, updatedTask).subscribe(
      (res) => {
        console.dir(res);
        if (res.status == 200) {
          response = res.body;
        }
      },
      (err) => console.error('Error Occurred When Adding New User ' + err)
    );

    return response === null ? undefined : response;
  }
}
