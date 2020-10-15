import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';

import { NotificationService } from './../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  isValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    if (this.authService.isLogged()) {
      this.router.navigate(['/reporter'], {
        queryParams: { reporter: 'all' },
      });
    }
  }

  public async login(form) {
    this.isLoading = true;
    try {
      await this.authService.login(form.value);

      if (!this.authService.isLogged()) {
        this.router.navigate(['/login']);
      }

      const returnUrl = this.activatedRoute.snapshot.queryParamMap.get(
        'returnUrl'
      );

      if (returnUrl) {
        this.router.navigate([returnUrl]);
      } else {
        this.router.navigate(['/reporter'], {
          queryParams: { reporter: 'all' },
        });
      }
    } catch (err) {
      this.isValid = false;
      this.notification.showError(err.error, 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
