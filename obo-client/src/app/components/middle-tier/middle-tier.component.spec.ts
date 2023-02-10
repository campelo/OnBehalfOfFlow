import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleTierComponent } from './middle-tier.component';

describe('MiddleTierComponent', () => {
  let component: MiddleTierComponent;
  let fixture: ComponentFixture<MiddleTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiddleTierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiddleTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
