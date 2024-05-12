import { Component } from '@angular/core';
import { TaskCardComponent } from './task-card/task-card.component';

@Component({
  selector: 'tasks-table',
  standalone: true,
  imports: [TaskCardComponent],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss'
})
export class TasksTableComponent {

}
