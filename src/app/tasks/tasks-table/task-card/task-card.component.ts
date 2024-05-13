import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../models/task';
import { NgFor , NgIf} from '@angular/common';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() allowEdit!: boolean;

  ngOnInit(): void {}
}
