import { TestBed } from '@angular/core/testing';

import { KypoSandboxAgendaService } from './kypo-sandbox-agenda.service';

describe('KypoSandboxAgendaService', () => {
  let service: KypoSandboxAgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KypoSandboxAgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
