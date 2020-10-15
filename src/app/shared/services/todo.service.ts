import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'app/core/services/crud.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService extends CrudService {
  endpoint = 'todos';

  constructor(http: HttpClient) {
    super(http);
  }

  async getTodo(todoId) {
    return this.getById(todoId);
  }

  getByReporter(userId) {
    return this.getById('reporter/' + userId);
  }

  async getAll() {
    return this.get();
  }

  async update(body, todoId) {
    return this.putById(body, todoId);
  }

  async changeStatus(body) {
    return this.patchById(body, 'change-status');
  }
  async updateFavorites(body) {
    return this.patchById(body, 'update-favorites');
  }

  async create(body) {
    return this.post(body);
  }

  async delete(todoId) {
    return this.deleteById(todoId);
  }
}
