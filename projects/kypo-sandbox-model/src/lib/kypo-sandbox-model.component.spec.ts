import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KypoSandboxModelComponent } from './kypo-sandbox-model.component';

describe('KypoSandboxModelComponent', () => {
  let component: KypoSandboxModelComponent;
  let fixture: ComponentFixture<KypoSandboxModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KypoSandboxModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KypoSandboxModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
