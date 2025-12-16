import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Learn } from './learn';

describe('Learn', () => {
  let component: Learn;
  let fixture: ComponentFixture<Learn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Learn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Learn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
