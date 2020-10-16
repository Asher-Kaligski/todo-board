import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'shared/services/auth.service';
import { NotificationService } from 'shared/services/notification.service';
import { TodoService } from 'shared/services/todo.service';

import { CreateTodoComponent } from './../../../modals/create-todo/create-todo.component';
import { EditTodoComponent } from './../../../modals/edit-todo/edit-todo.component';
import { Todo } from './../../../models/todo';
import { todoStatuses } from './../../../models/todo-properties';

@Component({
  selector: 'view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.scss'],
})
export class ViewBoardComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  todosMap = new Map();
  todoKeys: any;

  subscription: Subscription;

  term: string;

  constructor(
    private todoService: TodoService,
    private notification: NotificationService,
    public media: MediaObserver,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      this.subscription = this.route.queryParams.subscribe(async (param) => {
        if (!param.userId) {
          this.todos = await this.todoService.getAll();
        } else {
          this.todos = await this.todoService.getByReporter(param.userId);
        }

        if (!this.todos.length) {
          this.notification.showInfo('Tasks have not been found', 'info');
        }

        if (this.todos) {
          this.initTodosMap();
        }

        this.todoKeys = Array.from(this.todosMap.keys());
      });
    } catch (err) {
      this.notification.showError(err.error, 'error');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showFavoriteTasks() {
    for (const [key, value] of this.todosMap) {
      if (value) {
        const sorterArr = this.todosMap
          .get(key)
          .filter((t) => this.isFavorite(t));
        this.todosMap.set(key, sorterArr);
      }
    }
  }

  showAllTasks() {
    const currentRouteArr = this.router.url.split('/');

    if (currentRouteArr[1] !== 'reporter?reporter=all') {
      this.router.navigate(['/reporter'], {
        queryParams: { reporter: 'all' },
      });
    } else {
      this.todosMap.clear();
      this.initTodosMap();
    }
  }

  isFavorite(item: Todo) {
    if (!item.favorites.length) {
      return false;
    }

    const index = item.favorites.findIndex(
      (item) => item === this.authService.currentUser._id
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  private initTodosMap() {
    todoStatuses.forEach((columnName) => {
      this.todosMap.set(columnName, []);
    });
    this.todos.forEach((todo) => {
      this.todosMap.get(todo.status).push(todo);
    });
  }

  isMobile() {
    return this.media.isActive('sm') || this.media.isActive('xs');
  }
  isMobileFilters() {
    return (
      this.media.isActive('md') ||
      this.media.isActive('sm') ||
      this.media.isActive('xs')
    );
  }

  editTodo(todo: Todo) {
    const tempTodo: Todo = JSON.parse(JSON.stringify(todo));

    const dialogRef = this.dialog.open(EditTodoComponent, {
      data: tempTodo,
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const mapIndex = this.todosMap
        .get(todo.status)
        .findIndex((t) => t._id === todo._id);

      const todoArrIndex = this.todos.findIndex((t) => t._id === todo._id);

      if (result === 1) {
        this.todosMap.get(todo.status).splice(mapIndex, 1);

        this.todos.splice(todoArrIndex, 1);
      } else {
        if (todo.status === result.status) {
          this.todosMap.get(todo.status).splice(mapIndex, 1, result);

          this.todos.splice(todoArrIndex, 1, result);
        } else {
          this.todosMap.get(todo.status).splice(mapIndex, 1);
          this.todosMap.get(result.status).push(result);

          this.todos.splice(todoArrIndex, 1, result);
        }
      }
    });
  }

  createTodo() {
    const dialogRef = this.dialog.open(CreateTodoComponent, {
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.todosMap.get(result.status).push(result);
      this.todos.push(result);
    });
  }

  async drop(event: CdkDragDrop<string[]>) {
    const todo: any = event.item.data;

    if (todo.reporter._id !== this.authService.currentUser._id) {
      this.notification.showInfo(`You can't move not your task`, 'info');
      return;
    }

    const newStatus = event.container.connectedTo;

    this.dragTask(event);

    if (todo.status === newStatus) {
      return;
    }

    try {
      const result = await this.todoService.changeStatus({
        taskId: todo._id,
        status: newStatus,
      });

      const todoMapIndex = this.todosMap
        .get(newStatus)
        .findIndex((t) => t._id === todo._id);
      const todoArrIndex = this.todos.findIndex((t) => t._id === todo._id);

      if (todoMapIndex !== -1) {
        this.todosMap.get(newStatus)[
          todoMapIndex
        ].status = newStatus.toString();
      }

      this.todos[todoArrIndex].status = newStatus.toString();

      this.notification.showSuccess(
        'The status has been updated successfully',
        'success'
      );
    } catch (err) {
      const index = this.todosMap
        .get(newStatus)
        .findIndex((t) => t._id === todo._id);
      if (index !== -1) {
        this.todosMap.get(newStatus).splice(index, 1);
        this.todosMap.get(todo.status).push(todo);
      }
      this.notification.showError(err.error, 'error');
    }
  }

  private dragTask(event: CdkDragDrop<string[], string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getColumnName(name: string) {
    if (name.length < 14) {
      return name;
    }

    return name.substring(0, 10) + '...';
  }

  getShortTaskSummary(text: string) {
    if (text.length < 100) {
      return text;
    }

    return text.substring(0, 97) + '...';
  }

  getIconNameByIssueType(issueType: string) {
    if (issueType === 'Bug') {
      return 'bug_report';
    }
    if (issueType === 'Integration') {
      return 'cast_connected';
    }
    if (issueType === 'New Development') {
      return 'engineering';
    }
    if (issueType === 'Business Request') {
      return 'add_business';
    }

    return 'engineering';
  }

  getClassBySeverity(severity: string) {
    if (severity === 'Very Low') {
      return 'severity-very-low';
    }
    if (severity === 'Low') {
      return 'severity-low';
    }
    if (severity === 'Medium') {
      return 'severity-medium';
    }
    if (severity === 'High') {
      return 'severity-high';
    }
    if (severity === 'Very High') {
      return 'severity-very-high';
    }

    return 'severity-medium';
  }

  getClassByPriority(priority: string) {
    if (priority === 'Very Low') {
      return 'priority-very-low';
    }
    if (priority === 'Low') {
      return 'priority-low';
    }
    if (priority === 'Medium') {
      return 'priority-medium';
    }
    if (priority === 'Major') {
      return 'priority-high';
    }
    if (priority === 'Critical') {
      return 'priority-very-high';
    }

    return 'priority-medium';
  }
}
