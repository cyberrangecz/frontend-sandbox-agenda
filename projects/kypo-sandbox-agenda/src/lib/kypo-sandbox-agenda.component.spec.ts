import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KypoSandboxAgendaComponent } from './kypo-sandbox-agenda.component';

describe('KypoSandboxAgendaComponent', () => {
  let component: KypoSandboxAgendaComponent;
  let fixture: ComponentFixture<KypoSandboxAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KypoSandboxAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KypoSandboxAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
