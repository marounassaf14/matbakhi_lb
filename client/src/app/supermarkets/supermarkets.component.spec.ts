import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketsComponent } from './supermarkets.component';

describe('SupermarketsComponent', () => {
  let component: SupermarketsComponent;
  let fixture: ComponentFixture<SupermarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupermarketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupermarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
