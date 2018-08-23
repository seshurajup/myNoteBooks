import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-behavior-subject',
  templateUrl: './behavior-subject.component.html',
  styleUrls: ['./behavior-subject.component.scss']
})
export class BehaviorSubjectComponent implements OnInit {

  behaviorSubject$;
  constructor() { }

  ngOnInit() {
    this.behaviorSubject$ = new BehaviorSubject(100);
    this.behaviorSubject$.subscribe(
      value => console.log("First subscriber ",value)
    );
    this.behaviorSubject$.next(1);
    this.behaviorSubject$.next(2);
    this.behaviorSubject$.next(3);
    this.behaviorSubject$.subscribe(
      value => console.log("Second subscriber ",value)
    );
    this.behaviorSubject$.next(4);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.behaviorSubject$.unsubscribe();
  }
}
