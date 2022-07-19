import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopmanyProjectComponent } from './copmany-project.component';

describe('CopmanyProjectComponent', () => {
  let component: CopmanyProjectComponent;
  let fixture: ComponentFixture<CopmanyProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopmanyProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopmanyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
