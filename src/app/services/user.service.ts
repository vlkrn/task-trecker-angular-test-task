import { Injectable } from '@angular/core';
import {User} from "./task.service";
import {delay, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [
    { id: 1, name: 'Иван' },
    { id: 2, name: 'Анна' },
    { id: 3, name: 'Петр' },
    { id: 4, name: 'Мария' },
    { id: 5, name: 'Алексей' },
    { id: 6, name: 'Елена' },
    { id: 7, name: 'Антон' },
    { id: 8, name: 'Светлана' },
    { id: 9, name: 'Дмитрий' },
    { id: 10, name: 'Ольга' },
    { id: 11, name: 'Артем' },
    { id: 12, name: 'Татьяна' },
    { id: 13, name: 'Григорий' },
    { id: 14, name: 'Наталья' },
    { id: 15, name: 'Владимир' },
    { id: 16, name: 'Екатерина' },
    { id: 17, name: 'Станислав' },
    { id: 18, name: 'Валентина' },
    { id: 19, name: 'Михаил' },
    { id: 20, name: 'Анастасия' },
    { id: 21, name: 'Олег' },
    { id: 22, name: 'Людмила' },
    { id: 23, name: 'Игорь' },
    { id: 24, name: 'Юлия' },
    { id: 25, name: 'Аркадий' },
    { id: 26, name: 'Евгения' },
    { id: 27, name: 'Василий' },
    { id: 28, name: 'Маргарита' },
    { id: 29, name: 'Павел' },
    { id: 30, name: 'София' }
  ];
  constructor() { }

  /**
   * Получение списка пользователей
   */
  public getUsers(): Observable<User[]> {
    return of(this.users).pipe(
        delay(1500)
    );
  }
}
