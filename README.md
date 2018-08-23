##[Learning RxJS](https://www.lynda.com/Angular-tutorials/Learning-RxJS/630623-2.html)

### Subjects
* **Asyncronous** : Javascript execute before functions finish
* With **Callback**, We made function wait for this call to finish before we got the data
    * Nested callbacks is too bad and error handling is difficult
* with **Promises** :
    * Build in Error handling
    * We can modify the Promises
    * Each promise can be used for once
    ```js
        /* Promise Part 1, Getting promise */
        var promise = new Promise((resolve, reject) => { 
            if(/* if success */){ 
                resolve("it worked!");
            }
            else{
                reject(Error("Failed"));
            }
        });
        /* Promise Part 2, After we got data from server */
        promise.then((result) => { 
            /* We got results */
        }, (error) => {
            /* We got Error */ 
        })
    ```
* with **Observable** :
    * Re-usable Promise, keep listening after then method
    * Event-Driven pattern
    ```js
        var observable$ = Rx.Observable.create((observer) => {
            observer.next(1);
            observer.next(2);
            observer.complete();
        });

        /* observer(3):  - we can't handle outside of it */

        obserable$.subscribe(
            results => { /* handle results */ };
            error => { /* handle error */ };
            () => { /* end of call */ };
        );
        obserable$.subscribe(
            results => { /* handle results */ };
            error => { /* handle error */ };
            () => { /* end of call */ };
        );
    ```
    * Observable: it is function which takes in an observer and actions like create, subscribe
    * observer: is an object have 3 methods next, error and complete.. is something like a trigger
* **Subject**: 
    * To handle observer as outside observable which can be used as Observable or Observer
    * Subjects are sharable but not re-usable because after we send complete or error.. they end here
    * Subscribers get events which happen after but not earlier events
    * Use un-subscribe instead complete
* **Behavior Subject**:
    * Subscribers get events from starting time X i.e new BehaviorSubject(x milli secs)
    * Holds most recent value to next subscribers
* **Replay Subject**:
    * Store all events happen and send them all to new subscribers too.

### Operators
* Modify events

### AsyncPipe in Angular 
* | async
* will subscribe and un-subscribe automatically from template when user left i.e accessing observables directly on template 