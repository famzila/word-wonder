import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditText } from './edit-text';

describe('EditText', () => {
  let component: EditText;
  let fixture: ComponentFixture<EditText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
