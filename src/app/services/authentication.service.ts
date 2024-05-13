import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AuthorizedUser } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private route: Router, private userService: UserService) {}

  public authenticate(userId: String): void {
    const loggedInUser: AuthorizedUser | null =
      this.userService.getLoggedInUser();

    if (loggedInUser === null || loggedInUser.user.id !== userId) {
      this.route.navigateByUrl('/401');
    }
  }

  public removeAuthenticatedUser():void{
    this.userService.deleteLoggedInUser();
  }
}
