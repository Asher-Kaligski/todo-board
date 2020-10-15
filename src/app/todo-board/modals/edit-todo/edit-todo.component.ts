import 'quill-emoji/dist/quill-emoji.js';

import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { quillToolbar } from 'shared/models/quill-toolbar';
import { AuthService } from 'shared/services/auth.service';
import { NotificationService } from 'shared/services/notification.service';
import { TodoService } from 'shared/services/todo.service';

import { ConfirmationDialogComponent } from './../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Todo } from './../../models/todo';
import { todoIssueTypes, todoPriorities, todoSeverities, todoStatuses } from './../../models/todo-properties';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.scss'],
})
export class EditTodoComponent implements OnInit {
  isLoading = false;

  modules = {};
  todoIssueTypes: string[] = [];
  todoStatuses: string[] = [];
  todoSeverities: string[] = [];
  todoPriorities: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditTodoComponent>,
    private notification: NotificationService,
    private todoService: TodoService,
    public authService: AuthService,
    private media: MediaObserver,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Todo
  ) {
    this.modules = quillToolbar;
  }

  ngOnInit() {
    this.todoIssueTypes = todoIssueTypes;
    this.todoStatuses = todoStatuses;
    this.todoSeverities = todoSeverities;
    this.todoPriorities = todoPriorities;
  }

  closeModal() {
    this.dialogRef.close();
  }

  isMobile() {
    return this.media.isActive('sm') || this.media.isActive('xs');
  }

  isAllowedToEdit() {
    return this.data.reporter._id === this.authService.currentUser._id;
  }

  isFavorite() {
    if (!this.data.favorites.length) {
      return false;
    }

    const index = this.data.favorites.findIndex(
      (item) => item === this.authService.currentUser._id
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  async updateTask(form: NgForm) {
    if (!form.valid) {
      return;
    }

    try {
      this.isLoading = true;

      const result = await this.todoService.update(form.value, this.data._id);

      this.notification.showSuccess(
        'The task has been updated successfully',
        'success'
      );

      this.dialogRef.close(result);
    } catch (err) {
      this.notification.showError(err.error, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteTask() {
    try {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you confirm the deletion of the task?',
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (!result) {
          return;
        }

        this.isLoading = true;

        await this.todoService.delete(this.data._id);

        this.notification.showSuccess(
          'The task has been deleted successfully',
          'success'
        );

        this.dialogRef.close(1);
      });
    } catch (err) {
      this.notification.showError(err.error, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async updateFavorites() {
    try {
      const result = await this.todoService.updateFavorites({
        taskId: this.data._id,
        userId: this.authService.currentUser._id,
        isFavorite: !this.isFavorite(),
      });

      this.data = result;


      this.notification.showSuccess(
        'Task\'s favorite has been updated successfully',
        'success'
      );

      this.dialogRef.close(result);
    } catch (err) {
      this.notification.showError(err.error, 'error');
    }
  }
}
