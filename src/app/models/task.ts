export class Task {
  id: number;
  title: string;
  description: string;
  status: string;

  constructor(id: number, title: string, des: string, status: string) {
    this.id = id;
    this.title = title;
    this.description = des;
    this.status = status;
  }
}

export enum Status {
  AWAITED = 'AWAITED',
  TO_DO = 'TO_DO',
  DONE = 'DONE',
  DENIED = 'DENIED',
}
