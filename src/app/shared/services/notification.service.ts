import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  public showInfo(message, title) {
    this.toastr.info(message, title);
  }

  public showInfoWithTimeout(message, title, timespan) {
    this.toastr.info(message, title, {
      timeOut: timespan,
    });
  }

  public showInfoHTMLMessage(message, title) {
    this.toastr.info(message, title, {
      enableHtml: true,
    });
  }

  public showError(message, title) {
    this.toastr.error(message, title);
  }

  public showErrorWithTimeout(message, title, timespan) {
    this.toastr.error(message, title, {
      timeOut: timespan,
    });
  }

  public showErrorHTMLMessage(message, title) {
    this.toastr.error(message, title, {
      enableHtml: true,
    });
  }

  public showSuccess(message, title) {
    this.toastr.success(message, title);
  }

  public showSuccessWithTimeout(message, title, timespan) {
    this.toastr.success(message, title, {
      timeOut: timespan,
    });
  }

  public showSuccessHTMLMessage(message, title) {
    this.toastr.success(message, title, {
      enableHtml: true,
    });
  }
}
