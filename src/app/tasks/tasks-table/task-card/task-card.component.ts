import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../models/task';
import { NgFor } from '@angular/common';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [NgFor],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;

  ngOnInit(): void {}


}
