import { User } from 'shared/models/user';

export interface Todo {
  _id?: string;
  todoId: number;
  summary: string;
  description: string;
  createAt?: Date;
  issueType: string;
  priority: string;
  severity: string;
  status: string;
  reporter: User;
  updateAt: Date;
  favorites: [];
}
