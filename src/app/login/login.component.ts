import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { NgIf } from '@angular/common';

import { User } from '../models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @ViewChild('closeModalButton') closeModalButton!: ElementRef;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public registeredUsers!: any;
  public showUserRegisteredAlert!: boolean;
  public showFailedLoginAlert: boolean = false;
  public showFailedRegistrationAlert: boolean = false;
  private returnUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForms;

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initializeForms() {
    this.registerForm.setValue({
      username: '',
      role: '',
      password: '',
    });

    this.loginForm.setValue({
      username: '',
      password: '',
    });
  }

  get loginFormFields() {
    return this.loginForm.controls;
  }

  async onSubmitLogin() {
    this.showFailedLoginAlert = false;
    await this.getUsers();

    if (this.loginForm.status === 'INVALID') {
      return;
    }

    const existingUser = this.registeredUsers.filter(
      (it: { username: any }) => it.username === this.loginForm.value.username
    )[0];

    if (existingUser.password !== this.loginForm.value.password) {
      this.showFailedLoginAlert = true;
      return;
    }

    console.dir(this.loginForm);
    this.router.navigateByUrl('/tasks');
  }

  onSubmitRegisterUser() {
    this.showUserRegisteredAlert = false;
    this.showFailedRegistrationAlert = false;
    if (this.registerForm.status === 'INVALID') {
      return;
    }

    const newUser: User = new User(
      uuid(),
      this.registerForm.value.username,
      this.registerForm.value.role,
      this.registerForm.value.password
    );


    const response = this.addUser(newUser);

    if (response === undefined) {
      console.error(response);
      this.initializeForms();
      this.showFailedRegistrationAlert = true;
      return;
    }

    this.closeModal();
    this.showUserCreatedAlert();
    this.initializeForms();
  }

  showUserCreatedAlert() {
    const alertPlaceholder: any = document.getElementById(
      'liveAlertPlaceholder'
    );
    const appendAlert: any = (message: string, type: string) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>',
      ].join('');

      alertPlaceholder.append(wrapper);
    };

    appendAlert('Successfully registered new user!', 'success');
  }

  private closeModal(): void {
    this.closeModalButton.nativeElement.click();
  }

  // private getUsers(): User[] {
  private getUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getAllUsers().subscribe(
        (res) => {
          if (res.status == 200) {
            this.registeredUsers = JSON.parse(res.body);
            console.dir(this.registeredUsers);
            resolve();
          }
          reject();
        },
        (err) => {
          console.error('Error Occurred When Get All Users ' + err);
          reject();
        }
      );
    });
  }

  private addUser(newUser: User): any {
    let response = null;
    this.userService.addUser(newUser).subscribe(
      (resolve) => {
        console.dir(resolve);
        if (resolve.status == 200) {
          response = resolve.body;
          console.dir(resolve.body);
        }
      },
      (err) => console.error('Error Occurred When Adding New User ' + err)
    );

    return response === null ? undefined : response;
  }
}
