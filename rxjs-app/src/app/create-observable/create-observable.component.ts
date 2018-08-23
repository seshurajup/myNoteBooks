import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs' 

@Component({
  selector: 'app-create-observable',
  templateUrl: './create-observable.component.html',
  styleUrls: ['./create-observable.component.scss']
})
export class CreateObservableComponent implements OnInit {

  observable$ = null;
  constructor() {
    
   }

  ngOnInit() {
    this.observable$ = Observable.create(
      (observer) => {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
      }
    );
    this.observable$.subscribe(
      value => console.log("Create Observer: first subscribe "+value),
      err => console.log("error"),
      () => console.log("Create Observer: first subscribe completed")
    );
    this.observable$.subscribe(
      value => console.log("Create Observer: second subscribe "+value),
      err => console.log("error"),
      () => console.log("Create Observer: first subscribe completed")
    );
  }

  ngOnDestroy(): void {
    this.observable$.unsubscribe();
  }
}
