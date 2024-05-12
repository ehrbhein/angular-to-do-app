import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  RegisterForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.initializeForm;
  }

  initializeForm() {
    this.RegisterForm.setValue({
      username: 'yourUserName',
      role: 'Developer',
      password: '',
    });
  }

  onSubmit() {
    console.log(this.RegisterForm);
  }
}
