import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { SignUpPayload, LoginResponse } from '../models/user.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [MessageService],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(500, style({ opacity: 0, transform: 'translateX(-250px)' })),
      ]),
    ]),
  ],
})
export class SignInComponent {
  constructor(
    private appService: AppService,
    private router: Router,
    private messageService: MessageService
  ) {}

  showEvents: boolean = true;
  email: string = '';
  password: string = '';
  displaySignUp = false;
  newDisplayName: string = '';
  isEmailInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isDisplayNameInvalid: boolean = false;

  register() {
    this.displaySignUp = true;
    this.email = '';
    this.password = '';
    this.newDisplayName = '';
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    this.isDisplayNameInvalid = false;
  }

  displaySignInForm() {
    this.displaySignUp = false;
    this.email = '';
    this.password = '';
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    this.isDisplayNameInvalid = false;
  }

  signUp() {
    this.isEmailInvalid = this.email.trim() === '';
    this.isPasswordInvalid = this.password.trim() === '';
    this.isDisplayNameInvalid = this.newDisplayName.trim() === '';
    if (
      !this.isEmailInvalid &&
      !this.isPasswordInvalid &&
      !this.isDisplayNameInvalid
    ) {
      const payload: SignUpPayload = {
        email: this.email,
        displayName: this.newDisplayName,
        password: this.password,
      };

      this.appService.signUp(payload).subscribe({
        next: (data: LoginResponse) => {
          localStorage.setItem('token', data?.accessToken);
          localStorage.setItem('avatarUrl', data.avatarUrl);
          localStorage.setItem('id', data.userId);
          this.router.navigateByUrl('/home/dashboard');
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warn',
            detail: 'Unable to add user',
          });
        },
      });
    }
  }

  signIn() {
    this.isEmailInvalid = this.email.trim() === '';
    this.isPasswordInvalid = this.password.trim() === '';

    if (!this.isEmailInvalid && !this.isPasswordInvalid) {
      const payload = {
        email: this.email,
        password: this.password,
      };

      this.appService.signIn(payload).subscribe({
        next: (data: LoginResponse) => {
          localStorage.setItem('token', data?.accessToken);
          localStorage.setItem('avatarUrl', data.avatarUrl);
          localStorage.setItem('id', data.userId);
          this.router.navigateByUrl('/home/dashboard');
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login Unsuccessful',
            life: 1000,
          });
        },
      });
    }
  }
}
