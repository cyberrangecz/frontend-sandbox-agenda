import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KypoSandboxApiComponent } from './kypo-sandbox-api.component';

describe('KypoSandboxApiComponent', () => {
  let component: KypoSandboxApiComponent;
  let fixture: ComponentFixture<KypoSandboxApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KypoSandboxApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KypoSandboxApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
