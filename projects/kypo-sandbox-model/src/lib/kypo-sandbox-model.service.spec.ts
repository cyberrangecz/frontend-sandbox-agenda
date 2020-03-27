import { TestBed } from '@angular/core/testing';

import { KypoSandboxModelService } from './kypo-sandbox-model.service';

describe('KypoSandboxModelService', () => {
  let service: KypoSandboxModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KypoSandboxModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
