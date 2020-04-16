import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { asyncData } from 'kypo-common';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoPagination } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { PoolRequestApi } from 'kypo-sandbox-api';
import { throwError } from 'rxjs';
import { skip } from 'rxjs/operators';
import { SandboxAgendaConfig } from '../../../model/client/sandbox-agenda-config';
import { SandboxErrorHandler } from '../../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../../internal/sandox-agenda-context.service';
import { PoolCleanupRequestsConcreteService } from './pool-cleanup-requests-concrete.service';

describe('PoolCleanupRequestsPollingService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let api: jasmine.SpyObj<PoolRequestApi>;
  let service: PoolCleanupRequestsConcreteService;

  const context = new SandboxAgendaContext(new SandboxAgendaConfig());
  context.config.pollingPeriod = 5000;
  context.config.defaultPaginationSize = 10;

  beforeEach(async(() => {
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['emit']);
    api = jasmine.createSpyObj('PoolRequestApi', ['getCleanupRequests']);
    TestBed.configureTestingModule({
      providers: [
        PoolCleanupRequestsConcreteService,
        { provide: PoolRequestApi, useValue: api },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
        { provide: SandboxAgendaContext, useValue: context },
      ],
    });
    service = TestBed.inject(PoolCleanupRequestsConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load data from facade (called once)', (done) => {
    const pagination = createPagination();
    api.getCleanupRequests.and.returnValue(asyncData(null));

    service.getAll(0, pagination).subscribe((_) => done(), fail);
    expect(api.getCleanupRequests).toHaveBeenCalledTimes(1);
  });

  it('should emit next value on update (request)', (done) => {
    const pagination = createPagination();
    const mockData = createMock();
    api.getCleanupRequests.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1)).subscribe((emitted) => {
      expect(emitted).toEqual(mockData);
      done();
    }, fail);
    service.getAll(0, pagination).subscribe((_) => _, fail);
  });

  it('should call error handler on err', (done) => {
    const pagination = createPagination();
    api.getCleanupRequests.and.returnValue(throwError(null));

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
    api.getCleanupRequests.and.returnValue(throwError(null));
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
    api.getCleanupRequests.and.returnValue(asyncData(mockData));

    const subscription = service.resource$.subscribe();
    assertPoll(1);
    subscription.unsubscribe();
  }));

  it('should stop polling on error', fakeAsync(() => {
    const mockData = createMock();
    api.getCleanupRequests.and.returnValues(asyncData(mockData), asyncData(mockData), throwError(null)); // throw error on third call

    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(5 * context.config.pollingPeriod);
    expect(api.getCleanupRequests).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should start polling again after request is successful', fakeAsync(() => {
    const pagination = createPagination();
    const mockData = createMock();
    api.getCleanupRequests.and.returnValues(
      asyncData(mockData),
      asyncData(mockData),
      throwError(null),
      asyncData(mockData),
      asyncData(mockData),
      asyncData(mockData)
    );

    const subscription = service.resource$.subscribe();
    expect(api.getCleanupRequests).toHaveBeenCalledTimes(0);
    assertPoll(3);
    tick(context.config.pollingPeriod);
    expect(api.getCleanupRequests).toHaveBeenCalledTimes(3);
    tick(5 * context.config.pollingPeriod);
    expect(api.getCleanupRequests).toHaveBeenCalledTimes(3);
    service.getAll(0, pagination).subscribe();
    expect(api.getCleanupRequests).toHaveBeenCalledTimes(4);
    assertPoll(3, 4);
    subscription.unsubscribe();
  }));

  function createPagination() {
    return new KypoRequestedPagination(1, 5, '', '');
  }

  function createMock() {
    return new KypoPaginatedResource([], new KypoPagination(1, 0, 5, 5, 1));
  }

  function assertPoll(times: number, initialHaveBeenCalledTimes: number = 0) {
    let calledTimes = initialHaveBeenCalledTimes;
    for (let i = 0; i < times; i++) {
      tick(context.config.pollingPeriod);
      calledTimes = calledTimes + 1;
      expect(api.getCleanupRequests).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
