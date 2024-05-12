import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgIf } from '@angular/common';

import { AlertService, AuthenticationService } from '../../services';

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

  public showUserRegisteredAlert!: boolean;
  private returnUrl!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms;

    // reset login status
    this.authenticationService.logout();

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

  onSubmitLogin() {
    // todo: link login flow
    if (!this.loginForm.valid) {
      return;
    }

    console.dir(this.loginForm);

    // this.authenticationService
    //   .login(this.loginForm.value.username, this.loginForm.value.password)
    //   .pipe(first())
    //   .subscribe(
    //     (data) => {
    //       this.router.navigate([this.returnUrl]);
    //     },
    //     (error) => {
    //       this.alertService.error(error);
    //     }
    //   );
  }

  onSubmitRegisterUser() {
    this.showUserRegisteredAlert = false;
    if (this.registerForm.status !== 'INVALID') {
      // todo: create "save user" database call

      console.log(this.registerForm);
      // this.showUserRegisteredAlert = true;
      this.closeModal();
      this.showUserCreatedAlert();
    }

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
}
