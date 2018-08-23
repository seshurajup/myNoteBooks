import { Component, OnInit } from '@angular/core';
import { Subject, interval, of, Observable } from 'rxjs';
import { take ,map, filter, mergeMap, switchMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-operator-take',
  templateUrl: './operator-take.component.html',
  styleUrls: ['./operator-take.component.scss']
})

export class OperatorTakeComponent implements OnInit {

  interval$;
  interval2$;
  interval3$;
  latters$;
  searchString: string;
  searchSubject$; 
  constructor() { }

  ngOnInit() {
    
    this.interval$ = interval(1000).pipe(take(3),filter(x => x%2 === 0),map(x => x*10));
    
    this.interval$.subscribe(
      value => console.log(value)
    )
    this.latters$ = of('a','b');

    this.interval2$ = interval(1000)
    this.latters$.pipe( mergeMap(
      x => this.interval2$.pipe(take(3),map(n => x+n))
    )).subscribe(x => console.log("Merge Map ",x));

   this.interval3$ = interval(1000)
    this.latters$.pipe( switchMap(
      x => this.interval3$.pipe(take(5),map(n => x+n))
    )).subscribe(x => console.log("Switch Map ",x));


    this.searchSubject$ = new Subject<string>();
    this.searchSubject$.pipe(debounceTime(200)).subscribe(
      x => console.log("Sending value to server ", x)
    );
  }

  inputChanged($value){
    console.log("Entered value ", $value);
    this.searchSubject$.next($value)
  }
}
