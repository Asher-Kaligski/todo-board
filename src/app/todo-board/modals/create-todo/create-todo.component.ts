import 'quill-emoji/dist/quill-emoji.js';

import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { quillToolbar } from 'shared/models/quill-toolbar';
import { AuthService } from 'shared/services/auth.service';
import { NotificationService } from 'shared/services/notification.service';
import { TodoService } from 'shared/services/todo.service';

import { Todo } from './../../models/todo';
import {
  todoIssueTypes,
  todoPriorities,
  todoSeverities,
  todoStatuses,
} from './../../models/todo-properties';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
  isLoading = false;

  modules = {};
  todoIssueTypes: string[] = [];
  todoStatuses: string[] = [];
  todoSeverities: string[] = [];
  todoPriorities: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateTodoComponent>,
    private notification: NotificationService,
    private todoService: TodoService,
    public authService: AuthService,
    private media: MediaObserver,
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

  async createTask(form: NgForm) {
    if (!form.valid) {
      return;
    }

    try {
      this.isLoading = true;

      const result = await this.todoService.create(form.value);

      this.notification.showSuccess(
        'The task has been created successfully',
        'success'
      );

      this.dialogRef.close(result);
    } catch (err) {
      this.notification.showError(err.error, 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
