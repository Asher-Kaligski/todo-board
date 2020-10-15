import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { UserService } from 'shared/services/user.service';

import { NotificationService } from './../../../shared/services/notification.service';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  isLoading = false;
  constructor(
    public authService: AuthService,
    private userService: UserService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {}

  async submit(form) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    this.userService
      .create(form.value)
      .then(async (result) => {
        const email = form.value.email;
        const password = form.value.password;
        try {
          await this.authService.login({ email, password });
          this.notification.showSuccess(
            'The account has been created successfully',
            'success'
          );

          this.router.navigate(['/']);
        } catch (err) {
          this.notification.showError(err.error, 'error');
        } finally {
          this.isLoading = false;
        }
      })
      .catch((err) => {
        this.notification.showError(err.error, 'error');
        this.isLoading = false;
      });
  }
}
