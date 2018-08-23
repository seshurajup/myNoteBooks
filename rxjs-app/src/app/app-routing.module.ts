import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateObservableComponent } from './create-observable/create-observable.component';
import { SubjectComponent } from './subject/subject.component';
import { BehaviorSubjectComponent } from './behavior-subject/behavior-subject.component';
import { ReplaySubjectComponent } from './replay-subject/replay-subject.component';
import { OperatorTakeComponent } from './operator-take/operator-take.component';

const routes: Routes = [
  {
    path: 'observable',
    component: CreateObservableComponent
  },
  {
    path: 'subject',
    component: SubjectComponent
  },
  {
    path: 'behavior-subject',
    component: BehaviorSubjectComponent
  },
  {
    path: 'replay-subject',
    component: ReplaySubjectComponent
  },
  {
    path: 'operator-take',
    component: OperatorTakeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
