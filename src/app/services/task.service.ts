import {Injectable} from '@angular/core';
import {delay, Observable, of} from "rxjs";

export interface User {
    id: number,
    name: string;
}

export enum Status {
    CREATED,
    IN_PROCESS,
    FINISHED
}

export enum Priority {
    LOW,
    MEDIUM,
    HIGH
}

export interface Task {
    id?: number;
    title: string;
    deadline: Date | string;
    priority: Priority;
    status: Status;
    performers: User[];
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor() {
    }

    /**
     * Получение списка задач
     */
    getTasks(): Observable<Task[] | undefined> {
        return of(this.getTasksFromLocalStore()).pipe(
            delay(1500)
        );
    }

    /**
     * Получение задачи по id
     * @param id
     */
    getTask(id: number): Observable<Task | undefined> {
        const tasks = this.getTasksFromLocalStore();
        return of(tasks?.find(task => task.id === id)).pipe(
            delay(1500)
        );
    }

    /**
     * Создание новой задачи
     * @param task
     */
    createTask(task: Task): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const tasks = this.getTasksFromLocalStore();
            if (tasks) {
                tasks.push({...task, id: Date.now()});
                localStorage.setItem('db_tasks', JSON.stringify(tasks));
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Редактирование задачи
     * @param task
     */
    editTask(task: Task): Promise<boolean> {
        return new Promise((resolve) => {
            const tasks = this.getTasksFromLocalStore();
            if (tasks) {
                const index = tasks.findIndex(t => t.id === task.id);
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...task};
                    localStorage.setItem('db_tasks', JSON.stringify(tasks));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    }

    /**
     * Получение задач из localStorage
     * @private
     */
    private getTasksFromLocalStore(): Task[] | undefined {
        if (!localStorage.getItem('db_tasks')) {
            localStorage.setItem('db_tasks', JSON.stringify(this.tasks));
        }

        const tasksString = localStorage.getItem('db_tasks');
        if (!tasksString) {
            return undefined;
        }
        return JSON.parse(tasksString);
    }

    // Стартовые задачи
    private tasks: Task[] = [
        {
            id: 1,
            title: 'Разработка нового модуля авторизации',
            deadline: new Date('2024-03-15'),
            priority: Priority.HIGH,
            status: Status.CREATED,
            performers: [
                { id: 1, name: 'Иван' },
                { id: 2, name: 'Анна' }
            ],
            description: 'Разработать и интегрировать новый модуль авторизации в систему.',
        },
        {
            id: 2,
            title: 'Обновление дизайна интерфейса администратора',
            deadline: new Date('2024-03-20'),
            priority: Priority.MEDIUM,
            status: Status.IN_PROCESS,
            performers: [
                { id: 3, name: 'Петр' },
                { id: 4, name: 'Мария' }
            ],
            description: 'Обновить дизайн интерфейса администратора для улучшения удобства использования.',
        },
        {
            id: 3,
            title: 'Улучшение производительности сервера',
            deadline: new Date('2024-03-10'),
            priority: Priority.LOW,
            status: Status.FINISHED,
            performers: [
                { id: 5, name: 'Алексей' },
                { id: 6, name: 'Елена' }
            ],
            description: 'Оптимизировать настройки и программное обеспечение сервера для повышения его производительности.',
        },
        {
            id: 4,
            title: 'Тестирование новой версии приложения',
            deadline: new Date('2024-03-18'),
            priority: Priority.MEDIUM,
            status: Status.CREATED,
            performers: [
                { id: 7, name: 'Антон' },
                { id: 8, name: 'Светлана' }
            ],
            description: 'Провести полное тестирование новой версии приложения перед выпуском.',
        },
        {
            id: 5,
            title: 'Добавление мультиязычной поддержки',
            deadline: new Date('2024-03-25'),
            priority: Priority.HIGH,
            status: Status.IN_PROCESS,
            performers: [
                { id: 9, name: 'Дмитрий' },
                { id: 10, name: 'Ольга' }
            ],
            description: 'Интегрировать поддержку нескольких языков в систему для расширения аудитории.',
        },
        {
            id: 6,
            title: 'Оптимизация пользовательского интерфейса',
            deadline: new Date('2024-03-22'),
            priority: Priority.MEDIUM,
            status: Status.FINISHED,
            performers: [
                { id: 11, name: 'Артем' },
                { id: 12, name: 'Татьяна' }
            ],
            description: 'Провести анализ и оптимизацию пользовательского интерфейса для повышения его эффективности.',
        },
        {
            id: 7,
            title: 'Разработка системы уведомлений',
            deadline: new Date('2024-03-14'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 13, name: 'Григорий' },
                { id: 14, name: 'Наталья' }
            ],
            description: 'Создать и интегрировать систему уведомлений для информирования пользователей о важных событиях.',
        },
        {
            id: 8,
            title: 'Обновление базы данных',
            deadline: new Date('2024-03-17'),
            priority: Priority.HIGH,
            status: Status.IN_PROCESS,
            performers: [
                { id: 15, name: 'Владимир' },
                { id: 16, name: 'Екатерина' }
            ],
            description: 'Произвести обновление базы данных для улучшения ее производительности и надежности.',
        },
        {
            id: 9,
            title: 'Интеграция платежной системы',
            deadline: new Date('2024-03-19'),
            priority: Priority.MEDIUM,
            status: Status.FINISHED,
            performers: [
                { id: 17, name: 'Станислав' },
                { id: 18, name: 'Валентина' }
            ],
            description: 'Интегрировать платежную систему для обеспечения возможности оплаты услуг в системе.',
        },
        {
            id: 10,
            title: 'Разработка мобильного приложения',
            deadline: new Date('2024-03-23'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 19, name: 'Михаил' },
                { id: 20, name: 'Анастасия' }
            ],
            description: 'Разработать мобильное приложение для расширения доступа к системе с мобильных устройств.',
        },
        {
            id: 11,
            title: 'Оптимизация алгоритма поиска',
            deadline: new Date('2024-03-13'),
            priority: Priority.HIGH,
            status: Status.IN_PROCESS,
            performers: [
                { id: 21, name: 'Олег' },
                { id: 22, name: 'Людмила' }
            ],
            description: 'Провести оптимизацию алгоритма поиска для повышения скорости и точности поисковых запросов.',
        },
        {
            id: 12,
            title: 'Тестирование безопасности системы',
            deadline: new Date('2024-03-16'),
            priority: Priority.MEDIUM,
            status: Status.FINISHED,
            performers: [
                { id: 23, name: 'Игорь' },
                { id: 24, name: 'Юлия' }
            ],
            description: 'Провести тестирование безопасности системы для выявления и устранения уязвимостей.',
        },
        {
            id: 13,
            title: 'Обучение персонала новым функциям',
            deadline: new Date('2024-03-21'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 25, name: 'Аркадий' },
                { id: 26, name: 'Евгения' }
            ],
            description: 'Провести обучение персонала новым функциям системы для улучшения их работы с ней.',
        },
        {
            id: 14,
            title: 'Интеграция аналитической системы',
            deadline: new Date('2024-03-12'),
            priority: Priority.HIGH,
            status: Status.IN_PROCESS,
            performers: [
                { id: 27, name: 'Василий' },
                { id: 28, name: 'Маргарита' }
            ],
            description: 'Интегрировать аналитическую систему для сбора и анализа данных о работе системы.',
        },
        {
            id: 15,
            title: 'Разработка системы управления контентом',
            deadline: new Date('2024-03-24'),
            priority: Priority.MEDIUM,
            status: Status.FINISHED,
            performers: [
                { id: 29, name: 'Павел' },
                { id: 30, name: 'София' }
            ],
            description: 'Разработать систему управления контентом для удобного добавления и редактирования контента на сайте.',
        },
        {
            id: 16,
            title: 'Оптимизация процесса загрузки данных',
            deadline: new Date('2024-03-11'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 1, name: 'Иван' },
                { id: 2, name: 'Анна' }
            ],
            description: 'Провести оптимизацию процесса загрузки данных для ускорения работы системы.',
        },
        {
            id: 17,
            title: 'Обновление интерфейса чата',
            deadline: new Date('2024-03-14'),
            priority: Priority.MEDIUM,
            status: Status.IN_PROCESS,
            performers: [
                { id: 3, name: 'Петр' },
                { id: 4, name: 'Мария' }
            ],
            description: 'Обновить интерфейс чата для улучшения пользовательского опыта общения.',
        },
        {
            id: 18,
            title: 'Разработка API для внешних сервисов',
            deadline: new Date('2024-03-17'),
            priority: Priority.HIGH,
            status: Status.FINISHED,
            performers: [
                { id: 5, name: 'Алексей' },
                { id: 6, name: 'Елена' }
            ],
            description: 'Разработать и документировать API для взаимодействия с внешними сервисами системы.',
        },
        {
            id: 19,
            title: 'Интеграция системы аутентификации через соцсети',
            deadline: new Date('2024-03-22'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 7, name: 'Антон' },
                { id: 8, name: 'Светлана' }
            ],
            description: 'Интегрировать систему аутентификации через социальные сети для упрощения процесса входа в систему.',
        },
        {
            id: 20,
            title: 'Разработка модуля отчетности',
            deadline: new Date('2024-03-25'),
            priority: Priority.MEDIUM,
            status: Status.IN_PROCESS,
            performers: [
                { id: 9, name: 'Дмитрий' },
                { id: 10, name: 'Ольга' }
            ],
            description: 'Разработать модуль отчетности для анализа и отображения статистических данных о работе системы.',
        },
        {
            id: 21,
            title: 'Обновление системы рейтингования',
            deadline: new Date('2024-03-18'),
            priority: Priority.HIGH,
            status: Status.FINISHED,
            performers: [
                { id: 11, name: 'Артем' },
                { id: 12, name: 'Татьяна' }
            ],
            description: 'Обновить систему рейтингования для улучшения ее точности и надежности.',
        },
        {
            id: 22,
            title: 'Разработка системы управления задачами',
            deadline: new Date('2024-03-20'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 13, name: 'Григорий' },
                { id: 14, name: 'Наталья' }
            ],
            description: 'Разработать систему управления задачами для организации работы и контроля над проектами.',
        },
        {
            id: 23,
            title: 'Оптимизация интерфейса панели управления',
            deadline: new Date('2024-03-23'),
            priority: Priority.MEDIUM,
            status: Status.IN_PROCESS,
            performers: [
                { id: 15, name: 'Владимир' },
                { id: 16, name: 'Екатерина' }
            ],
            description: 'Провести оптимизацию интерфейса панели управления для улучшения навигации и доступности функций.',
        },
        {
            id: 24,
            title: 'Разработка системы учета заказов',
            deadline: new Date('2024-03-16'),
            priority: Priority.HIGH,
            status: Status.FINISHED,
            performers: [
                { id: 17, name: 'Станислав' },
                { id: 18, name: 'Валентина' }
            ],
            description: 'Разработать систему учета заказов для автоматизации процесса обработки заказов в системе.',
        },
        {
            id: 25,
            title: 'Обновление механизма аутентификации',
            deadline: new Date('2024-03-19'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 19, name: 'Михаил' },
                { id: 20, name: 'Анастасия' }
            ],
            description: 'Обновить механизм аутентификации для повышения безопасности и удобства использования системы.',
        },
        {
            id: 26,
            title: 'Интеграция системы управления контентом',
            deadline: new Date('2024-03-24'),
            priority: Priority.MEDIUM,
            status: Status.IN_PROCESS,
            performers: [
                { id: 21, name: 'Олег' },
                { id: 22, name: 'Людмила' }
            ],
            description: 'Интегрировать систему управления контентом для удобного добавления и редактирования контента на сайте.',
        },
        {
            id: 27,
            title: 'Оптимизация процесса резервного копирования данных',
            deadline: new Date('2024-03-13'),
            priority: Priority.HIGH,
            status: Status.FINISHED,
            performers: [
                { id: 23, name: 'Игорь' },
                { id: 24, name: 'Юлия' }
            ],
            description: 'Провести оптимизацию процесса резервного копирования данных для обеспечения их сохранности и доступности.',
        },
        {
            id: 28,
            title: 'Разработка модуля онлайн-оплаты',
            deadline: new Date('2024-03-21'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 25, name: 'Аркадий' },
                { id: 26, name: 'Евгения' }
            ],
            description: 'Разработать модуль онлайн-оплаты для возможности оплаты услуг непосредственно на сайте.',
        },
        {
            id: 29,
            title: 'Обновление интерфейса панели администратора',
            deadline: new Date('2024-03-18'),
            priority: Priority.MEDIUM,
            status: Status.IN_PROCESS,
            performers: [
                { id: 27, name: 'Василий' },
                { id: 28, name: 'Маргарита' }
            ],
            description: 'Обновить интерфейс панели администратора для улучшения удобства управления системой.',
        },
        {
            id: 30,
            title: 'Разработка модуля онлайн-чата',
            deadline: new Date('2024-03-22'),
            priority: Priority.LOW,
            status: Status.CREATED,
            performers: [
                { id: 29, name: 'Павел' },
                { id: 30, name: 'София' }
            ],
            description: 'Разработать модуль онлайн-чата для обеспечения коммуникации между пользователями системы.',
        },
    ];
}
