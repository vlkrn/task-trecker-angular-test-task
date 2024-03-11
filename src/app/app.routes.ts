import {Routes} from '@angular/router';
import {TaskListComponent} from "./task-list/task-list.component";

export const routes: Routes = [
    {path: '', component: TaskListComponent},
    {path: 'task-info/:id', loadComponent: () => import('./task-info/task-info.component').then(mod => mod.TaskInfoComponent)},
    {path: '**', redirectTo: ''}
];
