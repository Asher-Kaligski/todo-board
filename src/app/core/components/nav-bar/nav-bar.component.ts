import { Component } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { NotificationService } from 'shared/services/notification.service';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  constructor(
    public media: MediaObserver,
    public authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private userService: UserService
  ) {}

  async search(input: HTMLInputElement) {
    try {
      if (!this.authService.isLogged()) {
        return this.notification.showInfo(
          'You must be logged in order to perform search',
          'info'
        );
      }

      if (!input.value || input.value.length < 2) {
        return;
      }

      const searchedReporter = input.value.trim();

      const reporter = await this.userService.findReporter(searchedReporter);

      this.router.navigate(['/reporter'], {
        queryParams: {
          reporter: reporter.firstName + '-' + reporter.lastName,
          userId: reporter._id,
        },
      });
    } catch (err) {
      this.notification.showInfo(err.error, 'info');
    }
  }
}
