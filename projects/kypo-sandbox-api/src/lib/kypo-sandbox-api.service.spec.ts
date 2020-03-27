import { TestBed } from '@angular/core/testing';

import { KypoSandboxApiService } from './kypo-sandbox-api.service';

describe('KypoSandboxApiService', () => {
  let service: KypoSandboxApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KypoSandboxApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
