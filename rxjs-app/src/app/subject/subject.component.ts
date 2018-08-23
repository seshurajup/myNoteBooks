import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  subject$;
  constructor() { }

  ngOnInit() {
    this.subject$ = new Subject();
    this.subject$.subscribe(
      value => console.log("First Subscribe ",value)
    );
    this.subject$.next(1);
    this.subject$.next(2);
    this.subject$.subscribe(
      value => console.log("Second Subscribe ",value)
    );
    this.subject$.next(3);
  }
  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subject$.unsubscribe();
  }

}
