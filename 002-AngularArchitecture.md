# Angular Architecture
### Lifecycle
* **OnInit**: Component is initilized one time
* **OnChanges**: Change value of any data in component
* **DoCheck**: Angular detect the changes happen
* **AfterContentInit**: 
* **AfterContentChecked**:
* **AfterViewInit**:
* **AfterViewChecked**:
* **OnDestroy**: Before component is destroyed


### component
```bash
ng generate component ComponentName --module=app
```
```ts
import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',

})
```

### Basics
* **Interpolation**: {{ data }}
* **Expressions**: {{ 2 + 4 }}
* **databinding []**: @Input data for the Component
* **databinding ()**: @Output events from the Component
* **databinding ngModel**: 2-way data binding with ngModel directive
```ts
import { FormsModel } from '@angular/forms'; 
```
* ***ngFor**: 
```ts
    *ngFor="let record of records; let recordIndex = index; let evenRecord=even; let oldRecord=old; let firstRecord: first; let lastRecord: last" [ngClass]="{oddClass: oldRecord, evenClass: evenRecord, firstClass: firstRecord, lastClass: lastRecord}"
```
* ***ngIf**:

* **services**:
    *   **injecting dependencies**:
        *  https://www.youtube.com/watch?v=IKD2-MAkXyQ
```bash
ng generate service serviceName
```

* **Route Guards**: 
    * CanActivate
    * CanActivateChild
    * CanDeactive
    * Resolve
    * CanLoad
    ```bash
    ng generate guard auth
    ```
    * localStorage.setItem('key','value')
    * JSON.parse(localStorage.getItem('key) || false );
    * localStorage.removeItem('key');

### **Lazy Loading**
* make page views as modules, to load modules with respective routing
```ts
ng generate module modulename --routing
```