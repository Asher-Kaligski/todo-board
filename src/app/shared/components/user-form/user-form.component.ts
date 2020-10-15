import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../../services/notification.service';
import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  user: User;
  userId: string;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private notification: NotificationService,
    private router: Router,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.user = await this.userService.getUserById(this.userId);
  }

  async submit(form) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    try {
      await this.userService.updateUser(form.value, this.userId);

      this.notification.showSuccess('User details have been updated successfully', 'success');

      const email = form.value.email;
      const password = form.value.password;
      await this.authService.login({ email, password });
      this.router.navigate(['/']);
    } catch (err) {
      this.notification.showError(err.error, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
