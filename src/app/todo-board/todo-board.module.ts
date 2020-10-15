import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';

import { SharedModule } from './../shared/shared.module';
import { BoardComponent } from './components/board/board.component';
import { ViewBoardComponent } from './components/board/view-board/view-board.component';
import { CreateTodoComponent } from './modals/create-todo/create-todo.component';
import { EditTodoComponent } from './modals/edit-todo/edit-todo.component';

@NgModule({
  declarations: [
    CreateTodoComponent,
    EditTodoComponent,
    BoardComponent,
    ViewBoardComponent,
  ],
  entryComponents: [EditTodoComponent, CreateTodoComponent],
  imports: [CommonModule, RouterModule, SharedModule, QuillModule.forRoot()],
})
export class TodoBoardModule {}
