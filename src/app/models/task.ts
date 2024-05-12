export class Task {
  id: number;
  title: string;
  description: string;
  status: Status;

  constructor(id: number, title: string, des: string, status: Status) {
    this.id = id;
    this.title = title;
    this.description = des;
    this.status = status;
  }
}

export enum Status {
  AWAITED,
  TO_DO,
  DONE,
  DENIED,
}
