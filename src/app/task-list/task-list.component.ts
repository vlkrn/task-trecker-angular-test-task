import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Task, TaskService} from '../services/task.service';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {MatOption, MatSelect, MatSelectChange} from "@angular/material/select";
import {Observable, Subscription} from "rxjs";
import {MatInput} from "@angular/material/input";
import {UserService} from "../services/user.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

enum SortDirection {
    NONE = '',
    ASC = 'asc',
    DESC = 'desc'
}

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [MatTableModule, DatePipe, NgClass, MatSortModule, MatButton, MatIcon, NgForOf, MatSelect, MatOption, AsyncPipe, NgIf, MatInput, MatProgressSpinner],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['title', 'priority', 'deadline', 'status', 'performers'];
    dataSource: MatTableDataSource<Task>;

    dateFilter: string;
    statusFilter: number;
    userFilter: number;

    sortColumn: string;
    sortDirection: SortDirection;

    isLoading$: Observable<boolean>;
    users$ = this.userService.getUsers();
    subscriptions: Subscription[] = [];

    @ViewChild('tableSort') sort: MatSort = new MatSort();

    constructor(public router: Router, private tasksService: TaskService, private userService: UserService, private cdr: ChangeDetectorRef) {
    }
    ngOnInit() {
        this.isLoading$ = new Observable<boolean>(observer => {
            observer.next(true);
            this.subscriptions.push(this.tasksService.getTasks().subscribe(tasks => {
                this.dataSource = new MatTableDataSource(tasks ? tasks : []);

                observer.next(false);
                this.cdr.detectChanges();
                this.dataSource.sort = this.sort;
            }));
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    /**
     * Условия фильтра по статусу
     *
     * @param status
     * @param task
     */
    filterByStatus(status: number, task: Task): boolean {
        return status === -1 || task.status === status - 1;
    }

    /**
     * Условия фильтра по дедлайну
     *
     * @param date
     * @param task
     */
    filterByDate(date: string, task: Task): boolean {
        const dateFromStr = new Date(date);
        const taskDate = new Date(task.deadline);

        return taskDate.getFullYear() === dateFromStr.getFullYear()
            && taskDate.getMonth() === dateFromStr.getMonth()
            && taskDate.getDate() === dateFromStr.getDate();
    }

    /**
     * Условия фильтра по исполнителям
     *
     * @param userId
     * @param task
     */
    filterByUser(userId: number, task: Task) {
        if (userId === -1) {
            return true;
        }

        for (let i = 0; i < task.performers.length; i++) {
            if (task.performers[i].id === userId) {
                return true;
            }
        }

        return false;
    }

    /**
     * Совокупные условия фильтрации
     *
     * @param task
     */
    customFilterPredicate(task: Task): boolean {
        let statusFilterPass = true;
        let dateFilterPass = true;
        let userFilterPass = true;

        if (this.statusFilter) {
            statusFilterPass = this.filterByStatus(+this.statusFilter, task);
        }

        if (this.dateFilter) {
            dateFilterPass = this.filterByDate(this.dateFilter, task);
        }

        if (this.userFilter) {
            userFilterPass = this.filterByUser(this.userFilter, task);
        }

        return statusFilterPass && dateFilterPass && userFilterPass;
    }

    /**
     * Запуск фильтра
     *
     * @param column
     * @param event
     */
    applyFilters(column: string, event : Event | MatSelectChange) {
        if (event instanceof MatSelectChange) {
            if (column === 'status') {
                this.statusFilter = +event.value;
            } else if (column === 'performers') {
                this.userFilter = +event.value
            }
        } else {
            this.dateFilter = (event.target as HTMLInputElement).value;
        }
        this.dataSource.filterPredicate = (data: Task) => this.customFilterPredicate(data);
        this.dataSource.filter = 'update';
    }

    /**
     * Сортировка таблицы
     *
     * @param columnName
     * @param direction
     */
    sortTable(columnName: string, direction: SortDirection) {
        this.sortDirection = direction;
        this.sortColumn = columnName;

        this.sort.sort({
            id: this.sortColumn,
            start: this.sortDirection,
            disableClear: true
        });
    }

    protected readonly SortDirection = SortDirection;
}
