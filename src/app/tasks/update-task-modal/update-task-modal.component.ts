import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Status, Task } from '../../models/task';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Roles } from '../../models';
import { EventType, TaskUpdateService } from '../task-update.service';

@Component({
  selector: 'update-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './update-task-modal.component.html',
  styleUrl: './update-task-modal.component.scss',
})
export class UpdateTaskModalComponent implements OnInit {
  @Input() task!: Task;
  @Input() currentUserRole!: string;

  public updateTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });
  public showEditOptions!: string[];

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

  constructor(
    private activeModal: NgbActiveModal,
    private taskService: TaskService,
    private taskUpdateService: TaskUpdateService
  ) {}

  ngOnInit(): void {
    console.dir(this.task);
    console.dir(this.currentUserRole);
    this.initializeFormData();
    this.initializeEditOptions();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public onUpdateTask(): void {
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

    if (response === undefined) {
      return;
    }

    this.closeModal();

    this.taskUpdateService.broadCastUpdate({
      context: updatedTask,
      eventType: EventType.UPDATE,
    });
  }

  public initializeEditOptions(): void {
    this.showEditOptions = this.editOptionsMap.get(this.currentUserRole) ?? [];
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
        if (res.status == 200) {
          response = res.body;
        }
      },
      (err) => console.error('Error Occurred When Adding New User ' + err)
    );

    return response === null ? undefined : response;
  }
}
