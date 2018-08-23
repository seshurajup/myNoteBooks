import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorTakeComponent } from './operator-take.component';

describe('OperatorTakeComponent', () => {
  let component: OperatorTakeComponent;
  let fixture: ComponentFixture<OperatorTakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorTakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
