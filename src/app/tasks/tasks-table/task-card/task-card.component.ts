import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../models/task';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;

  ngOnInit(): void {}

  
}
