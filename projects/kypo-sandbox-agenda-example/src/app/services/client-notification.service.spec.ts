import { async, TestBed } from '@angular/core/testing';
import { SandboxNotificationService } from '../../../../kypo-sandbox-agenda/src/sandbox-notification.service';
import { ClientNotificationService } from './client-notification.service';

describe('ClientNotificationService', () => {
  let service: ClientNotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SandboxNotificationService, useClass: ClientNotificationService }],
    }).compileComponents();
    service = TestBed.inject(SandboxNotificationService);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
