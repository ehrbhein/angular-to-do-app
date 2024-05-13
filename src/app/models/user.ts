export class User {
  id: string;
  username: string;
  role: string;
  password: string;

  constructor(id: string, username: string, role: string, password: string) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.password = password;
  }
}

export class AuthorizedUser {
  user: User;

  constructor(user: User) {
    this.user = user;
  }
}

export enum Roles {
  DEVELOPER ="DEVELOPER",
  MANAGER ="MANAGER",
  ADMIN ="ADMIN",
}
