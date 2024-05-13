import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTaskModalComponent } from './update-task-modal.component';
import { Task } from '../../models/task';

@Injectable({
  providedIn: 'root',
})
export class UpdateTaskModalService {
  constructor(private ngbModal: NgbModal) {}

  public openUpdateTasksModal(task: Task, currentUserRole: string): void {
    const modalRef = this.ngbModal.open(UpdateTaskModalComponent);
    modalRef.componentInstance.task = task;
    modalRef.componentInstance.currentUserRole = currentUserRole;
  }
}
