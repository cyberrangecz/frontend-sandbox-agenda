import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PaginatedResource, SentinelPagination, RequestedPagination, asyncData } from '@sentinel/common';
import { CleanupRequestsApi, PoolApi, SandboxAllocationUnitsApi } from 'kypo-sandbox-api';
import { throwError } from 'rxjs';
import { skip } from 'rxjs/operators';
import {
  createCleanupRequestApiSpy,
  createContextSpy,
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNotificationSpy,
  createPoolApiSpy,
  createSauApiSpy,
} from '../../../testing/testing-commons';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { CleanupRequestsConcreteService } from './cleanup-requests-concrete.service';
import { MatDialog } from '@angular/material/dialog';
import { SandboxNotificationService } from '../../client/sandbox-notification.service';

describe('PoolCleanupRequestsConcreteService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let notificationSpy: jasmine.SpyObj<SandboxNotificationService>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;
  let poolApiSpy: jasmine.SpyObj<PoolApi>;
  let sauApiSpy: jasmine.SpyObj<SandboxAllocationUnitsApi>;
  let cleanupRequestsApiSpy: jasmine.SpyObj<CleanupRequestsApi>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let service: CleanupRequestsConcreteService;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    notificationSpy = createNotificationSpy();
    poolApiSpy = createPoolApiSpy();
    sauApiSpy = createSauApiSpy();
    cleanupRequestsApiSpy = createCleanupRequestApiSpy();
    contextSpy = createContextSpy();
    dialogSpy = createMatDialogSpy();

    TestBed.configureTestingModule({
      providers: [
        CleanupRequestsConcreteService,
        { provide: PoolApi, useValue: poolApiSpy },
        { provide: CleanupRequestsApi, cleanupRequestsApiSpy },
        { provide: SandboxAllocationUnitsApi, useValue: sauApiSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
        { provide: SandboxNotificationService, useValue: notificationSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
      ],
    });
    service = TestBed.inject(CleanupRequestsConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load data from facade (called once)', (done) => {
    const pagination = createPagination();
    poolApiSpy.getCleanupRequests.and.returnValue(asyncData(null));

    service.getAll(0, pagination).subscribe((_) => done(), fail);
    expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(1);
  });

  it('should emit next value on update (request)', (done) => {
    const pagination = createPagination();
    const mockData = createMock();
    poolApiSpy.getCleanupRequests.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1)).subscribe((emitted) => {
      expect(emitted).toEqual(mockData);
      done();
    }, fail);
    service.getAll(0, pagination).subscribe((_) => _, fail);
  });

  it('should call error handler on err', (done) => {
    const pagination = createPagination();
    poolApiSpy.getCleanupRequests.and.returnValue(throwError(null));

    service.getAll(0, pagination).subscribe(
      (_) => fail,
      (_) => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should emit hasError observable on err', (done) => {
    const pagination = createPagination();
    poolApiSpy.getCleanupRequests.and.returnValue(throwError(null));
    service.hasError$
      .pipe(
        skip(2) // we ignore initial value and value emitted before the call is made
      )
      .subscribe(
        (hasError) => {
          expect(hasError).toBeTruthy();
          done();
        },
        (_) => fail
      );
    service.getAll(0, pagination).subscribe(
      (_) => fail,
      (_) => _
    );
  });

  it('should start polling', fakeAsync(() => {
    const mockData = createMock();
    poolApiSpy.getCleanupRequests.and.returnValue(asyncData(mockData));

    const subscription = service.resource$.subscribe();
    assertPoll(1);
    subscription.unsubscribe();
  }));

  it('should stop polling on error', fakeAsync(() => {
    const mockData = createMock();
    poolApiSpy.getCleanupRequests.and.returnValues(asyncData(mockData), asyncData(mockData), throwError(null)); // throw error on third call

    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should start polling again after request is successful', fakeAsync(() => {
    const pagination = createPagination();
    const mockData = createMock();
    poolApiSpy.getCleanupRequests.and.returnValues(
      asyncData(mockData),
      asyncData(mockData),
      throwError(null),
      asyncData(mockData),
      asyncData(mockData),
      asyncData(mockData)
    );

    const subscription = service.resource$.subscribe();
    expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(0);
    assertPoll(3);
    tick(contextSpy.config.pollingPeriod);
    expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(3);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(3);
    service.getAll(0, pagination).subscribe();
    expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(4);
    assertPoll(3, 4);
    subscription.unsubscribe();
  }));

  function createPagination() {
    return new RequestedPagination(1, 5, '', '');
  }

  function createMock() {
    return new PaginatedResource([], new SentinelPagination(1, 0, 5, 5, 1));
  }

  function assertPoll(times: number, initialHaveBeenCalledTimes: number = 0) {
    let calledTimes = initialHaveBeenCalledTimes;
    for (let i = 0; i < times; i++) {
      tick(contextSpy.config.pollingPeriod);
      calledTimes = calledTimes + 1;
      expect(poolApiSpy.getCleanupRequests).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
