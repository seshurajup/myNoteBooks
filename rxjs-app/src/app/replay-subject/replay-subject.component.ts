import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-replay-subject',
  templateUrl: './replay-subject.component.html',
  styleUrls: ['./replay-subject.component.scss']
})
export class ReplaySubjectComponent implements OnInit {

  replaySubject$;
  constructor() { }

  ngOnInit() {
    this.replaySubject$ = new ReplaySubject();
    this.replaySubject$.subscribe(
      value => console.log("First subscriber ",value)
    );
    this.replaySubject$.next(1);
    this.replaySubject$.next(2);
    this.replaySubject$.next(3);
    this.replaySubject$.subscribe(
      value => console.log("Second subscriber ",value)
    );
    this.replaySubject$.next(4);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.replaySubject$.unsubscribe();
  }

}
