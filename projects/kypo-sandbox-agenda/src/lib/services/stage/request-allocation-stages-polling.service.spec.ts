import {RequestAllocationStagesPollingService} from './request-allocation-stages-polling.service';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {asyncData, KypoPaginatedResource, KypoPagination} from 'kypo-common';
import {skip} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AllocationRequest, AllocationRequestStage} from 'kypo-sandbox-model';
import {AnsibleAllocationStage} from 'kypo-sandbox-model';
import {OpenStackAllocationStage} from 'kypo-sandbox-model';
import {StagesApi} from 'kypo-sandbox-api';
import {SandboxErrorHandlerService} from 'kypo-sandbox-agenda';
import {SandboxAgendaContext} from '../internal/sandox-agenda-context.service';
import {SandboxAgendaConfig} from '../../model/client/sandbox-agenda-config';

describe('RequestStagesPollingService', () => {

  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandlerService>;
  let apiSpy: jasmine.SpyObj<StagesApi>;
  let service: RequestAllocationStagesPollingService;
  const context = new SandboxAgendaContext(new SandboxAgendaConfig());
  context.config.pollingPeriod = 5000;
  context.config.defaultPaginationSize = 10;

  beforeEach(async(() => {
    errorHandlerSpy = jasmine.createSpyObj('SandboxErrorHandlerService', ['emit']);
    apiSpy = jasmine.createSpyObj('StagesApi', ['getAllocationStages']);
    TestBed.configureTestingModule({
      providers: [
        RequestAllocationStagesPollingService,
        {provide: StagesApi, useValue: apiSpy},
        {provide: SandboxErrorHandlerService, useValue: errorHandlerSpy},
        {provide: SandboxAgendaContext, useValue: context}
      ]
    });
    service = TestBed.inject(RequestAllocationStagesPollingService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load data from api (called once)', done => {
    apiSpy.getAllocationStages.and.returnValue(asyncData(createStages()));
    const request = new AllocationRequest();
    request.id = 1;

    service.getAll(request).subscribe(_ => done(),
      _ => fail);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(1);
  });


  it('should call error handler on err', done => {
    apiSpy.getAllocationStages.and.returnValue(throwError(null));
    const request = new AllocationRequest();
    request.id = 1;

    service.getAll(request)
      .subscribe(_ => fail,
        _ => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should emit hasError observable on err', done => {
    apiSpy.getAllocationStages.and.returnValue(throwError(null));
    const request = new AllocationRequest();
    request.id = 1;

    service.hasError$
      .pipe(
        skip(2) // we ignore initial value and value emitted before the call is made
      ).subscribe(hasError => {
        expect(hasError).toBeTruthy();
        done();
      },
      _ => fail);
    service.getAll(request).subscribe(
      _ => fail,
      _ => done()
    );
  });

  it('should not start polling without calling startPolling', fakeAsync(() => {
    tick(5 * context.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(0);
  }));

  it('should start polling after calling startPolling', fakeAsync(() => {
    const stages = createStages();
    apiSpy.getAllocationStages.and.returnValue(asyncData(stages));
    const request = new AllocationRequest();
    request.id = 1;

    service.startPolling(request);
    const subscription = service.resource$.subscribe();
    assertPoll(5);
    subscription.unsubscribe();
  }));

  it('should stop polling on error', fakeAsync(() => {
    const stages = createStages();
    apiSpy.getAllocationStages.and.returnValues(
      asyncData(stages),
      asyncData(stages),
      asyncData(stages),
      throwError(null)); // throw error on fourth period call

    const request = new AllocationRequest();
    request.id = 1;

    service.startPolling(request);
    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(5 *  context.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(4);
    subscription.unsubscribe();
  }));

  it('should start polling again after request is successful', fakeAsync(() => {
    const stages = createStages();
    apiSpy.getAllocationStages.and.returnValues(
      asyncData(stages),
      asyncData(stages),
      asyncData(stages),
      throwError(null),
      asyncData(stages),
      asyncData(stages),
      asyncData(stages),
      asyncData(stages),
      asyncData(stages)
    );

    const request = new AllocationRequest();
    request.id = 1;

    service.startPolling(request);
    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(context.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(4);
    tick( 5 * context.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(4);
    service.getAll(request).subscribe();
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(5);
    assertPoll(3, 6);
    subscription.unsubscribe();
  }));

  function createStages(): KypoPaginatedResource<AllocationRequestStage> {
    return new KypoPaginatedResource(
      [new AnsibleAllocationStage(), new OpenStackAllocationStage()],
      new KypoPagination(0, 2, 2, 2, 1)
    );
  }

  function assertPoll(times: number, initialHaveBeenCalledTimes: number = 1) {
    let calledTimes = initialHaveBeenCalledTimes;
    for (let i = 0; i < times; i++) {
      tick(context.config.pollingPeriod);
      calledTimes = calledTimes + 1;
      expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
