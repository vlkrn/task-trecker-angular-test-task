import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {fromEvent, map, merge, Observable, of, startWith, switchMap, tap} from "rxjs";
import {Priority, Status, Task, TaskService, User} from "../services/task.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {AsyncPipe, NgIf} from "@angular/common";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {UserService} from "../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-task-info',
    standalone: true,
    imports: [
        FormsModule, MatFormFieldModule, MatInputModule,
        MatDatepickerModule, MatRadioModule, MatChipsModule, MatIconModule,
        ReactiveFormsModule, MatAutocomplete, MatOption, MatAutocompleteTrigger, AsyncPipe, MatButton, MatDivider, NgIf, MatProgressSpinner
    ],
    providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }],
    templateUrl: './task-info.component.html',
    styleUrl: './task-info.component.scss'
})
export class TaskInfoComponent implements OnInit {

    formGroup: FormGroup;
    taskId = 0;
    minDate: Date = new Date(Date.now());
    allUsers: User[] = [];

    separatorKeysCodes: number[] = [ENTER, COMMA];
    performersControl = new FormControl();
    filteredUsers$: Observable<User[]>;
    loadFormData$: Observable<FormGroup>;
    loadUsersList$: Observable<User[]>;

    private performerInput: ElementRef<HTMLInputElement>;
    @ViewChild('performerInput') set content(content: ElementRef) {
        if (content) {
            this.performerInput = content;
            this.addFilterOnAutoComplete();
        }
    }

    constructor(private route: ActivatedRoute, public router: Router, private taskService: TaskService, private userService: UserService, private _snackBar: MatSnackBar) {
    }
    ngOnInit(): void {
        this.loadFormData$ = this.route.params.pipe(
            switchMap((params: Params) => {
                this.taskId = +params['id'];

                if (this.taskId === 0) {
                    this.formGroup = this.initFormGroup(null);
                    return of(this.formGroup);
                } else {
                    return this.taskService.getTask(this.taskId).pipe(
                        map((task: Task | undefined) => {
                            if (task === undefined) {
                                this.router.navigate(['task-info', 0]);
                            }

                            this.formGroup = this.initFormGroup(task)
                            return this.formGroup;
                        })
                    );
                }
            }),
        );

        this.loadUsersList$ = this.userService.getUsers().pipe(
            tap(users => {
                this.allUsers = users;
            })
        );
    }

    /**
     * Инициализация formGroup
     * @param task
     */
    initFormGroup(task: Task | undefined | null) {
        const newGroup =  new FormGroup({
            title: new FormControl<string>(task ? task.title : '', [Validators.minLength(3), Validators.maxLength(255), Validators.required]),
            deadline: new FormControl<Date | string>(task ? task.deadline : new Date(Date.now()), [Validators.required]),
            priority: new FormControl<Priority>(task ? task.priority : 0, []),
            status: new FormControl<Status>(task ? task.status : 0, []),
            performers: new FormControl<User[]>(task ? task.performers : [], []),
            description: new FormControl<string>(task ? task.description : '', [Validators.minLength(3), Validators.maxLength(1000), Validators.required]),
        });

        if (this.taskId && task != null) {
            newGroup.controls['title'].disable();
            newGroup.controls['deadline'].disable();
            newGroup.controls['priority'].disable();
        }

        return newGroup;
    }

    /**
     * Удаление пользователя из исполнителей
     * @param performer
     */
    removePerformer(performer: string): void {
        const index = this.formGroup.controls['performers'].value.indexOf(performer);

        if (index >= 0) {
            this.formGroup.controls['performers'].setValue([...this.formGroup.controls['performers'].value.slice(0, index),
                ...this.formGroup.controls['performers'].value.slice(index + 1)]);
        }
    }

    /**
     * Событие выбора пользователя из селекта
     * @param event
     */
    selectedPerformer(event: MatAutocompleteSelectedEvent): void {
        this.formGroup.controls['performers'].value.push(this.allUsers.find(user => user.id === +event.option.value));
        this.performerInput.nativeElement.value = '';
        this.performersControl.setValue(null);
    }

    /**
     * Фильтрация предлагаемых пользователей
     *
     * @param value
     * @private
     */
    private _filter(value: string): User[] {
        let chosenUser: User[] = [];
        chosenUser = this.formGroup?.controls['performers'].value;

        return this.allUsers.filter(user => {
            return user.name.toLowerCase().includes(value.toLowerCase()) &&
                chosenUser.findIndex(val => user.id === val.id) === -1;
        });
    }

    /**
     * Сохранение задачи
     */
    saveTask() {
        if (this.formGroup.valid) {
            let savingTask;
            if (this.taskId) {
                savingTask = this.taskService.editTask({...this.formGroup.value, id: this.taskId});
            } else {
                savingTask = this.taskService.createTask(this.formGroup.value);
            }
            savingTask.then(result => {
                if (result) {
                    this._snackBar.open('Задача сохранена', '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        duration: 1500
                    });
                    setTimeout(() => {
                        this.router.navigate(['']);
                    }, 1500)
                } else {
                    this._snackBar.open('Произошла ошибка', '', {
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                        duration: 2000
                    });
                }
            });
        }
    }

    /**
     * Добавление слушателя на события ввода пользователей
     */
    addFilterOnAutoComplete() {
        this.filteredUsers$ = merge(this.performersControl.valueChanges,
            fromEvent<FocusEvent>(this.performerInput?.nativeElement, 'focus').pipe(
                map((event: FocusEvent) => (<HTMLInputElement>event.target).value)
            )).pipe(
            startWith(null),
            map((inputData: string | number | null) => typeof inputData === 'number' ? inputData + '' : inputData),
            map((inputData: string | null) => (inputData !== null ? this._filter(inputData) : this.allUsers.slice())),
        )
    }
}
