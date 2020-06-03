import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { asyncData, KypoPaginatedResource, KypoPagination } from 'kypo-common';
import { StagesApi } from 'kypo-sandbox-api';
import { AnsibleAllocationStage } from 'kypo-sandbox-model';
import { AllocationRequest, AllocationRequestStage } from 'kypo-sandbox-model';
import { OpenStackAllocationStage } from 'kypo-sandbox-model';
import { throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { createContextSpy, createErrorHandlerSpy, createStagesApiSpy } from '../../testing/testing-commons';
import { SandboxErrorHandler } from '../client/sandbox-error.handler';
import { SandboxAgendaContext } from '../internal/sandox-agenda-context.service';
import { RequestAllocationStagesConcreteService } from './request-allocation-stages-concrete.service';

describe('RequestAllocationStagesPollingService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let apiSpy: jasmine.SpyObj<StagesApi>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;
  let service: RequestAllocationStagesConcreteService;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    apiSpy = createStagesApiSpy();
    contextSpy = createContextSpy();
    TestBed.configureTestingModule({
      providers: [
        RequestAllocationStagesConcreteService,
        { provide: StagesApi, useValue: apiSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
      ],
    });
    service = TestBed.inject(RequestAllocationStagesConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load data from api (called once)', (done) => {
    apiSpy.getAllocationStages.and.returnValue(asyncData(createStages()));
    const request = new AllocationRequest();
    request.id = 1;

    service.getAll(request).subscribe(
      (_) => done(),
      (_) => fail
    );
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(1);
  });

  it('should call error handler on err', (done) => {
    apiSpy.getAllocationStages.and.returnValue(throwError(null));
    const request = new AllocationRequest();
    request.id = 1;

    service.getAll(request).subscribe(
      (_) => fail,
      (_) => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should emit hasError observable on err', (done) => {
    apiSpy.getAllocationStages.and.returnValue(throwError(null));
    const request = new AllocationRequest();
    request.id = 1;

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
    service.getAll(request).subscribe(
      (_) => fail,
      (_) => done()
    );
  });

  it('should stop polling on error', fakeAsync(() => {
    const stages = createStages();
    apiSpy.getAllocationStages.and.returnValues(
      asyncData(stages),
      asyncData(stages),
      asyncData(stages),
      throwError(null)
    ); // throw error on fourth period call

    const request = new AllocationRequest();
    request.id = 1;

    service.getAll(request);
    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(5 * contextSpy.config.pollingPeriod);
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

    service.getAll(request);
    const subscription = service.resource$.subscribe();
    assertPoll(3);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(4);
    tick(5 * contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(4);
    service.getAll(request).subscribe();
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(5);
    assertPoll(3, 5);
    subscription.unsubscribe();
  }));

  it('should stop polling when all stages are finished', fakeAsync(() => {
    const finishedStage1 = new AnsibleAllocationStage();
    const finishedStage2 = new AnsibleAllocationStage();
    spyOn(finishedStage1, 'hasFinished').and.returnValue(true);
    spyOn(finishedStage2, 'hasFinished').and.returnValue(true);
    const regularStages = [new AnsibleAllocationStage(), new AnsibleAllocationStage(), new AnsibleAllocationStage()];
    const finishedStages = [finishedStage1, finishedStage2];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    apiSpy.getAllocationStages.and.returnValues(
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(finishedStages, pagination))
    );

    const req = new AllocationRequest();

    service.getAll(req).pipe(take(1)).subscribe();
    const subscription = service.resource$.subscribe();

    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(1);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(2);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(3);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(3);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should stop polling when some stages fails', fakeAsync(() => {
    const failedStage = new AnsibleAllocationStage();
    const runningStage = new AnsibleAllocationStage();
    spyOn(failedStage, 'hasFailed').and.returnValue(true);
    spyOn(runningStage, 'hasFinished').and.returnValue(false);
    const regularStages = [new AnsibleAllocationStage(), new AnsibleAllocationStage(), new AnsibleAllocationStage()];
    const failedStages = [failedStage, runningStage];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    apiSpy.getAllocationStages.and.returnValues(
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(regularStages, pagination)),
      asyncData(new KypoPaginatedResource(failedStages, pagination))
    );
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(0);

    const req = new AllocationRequest();

    const subscription = service.resource$.subscribe();
    service.getAll(req).pipe(take(1)).subscribe();
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(2);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(3);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(3);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  }));

  it('should return value once even when all stages are finished', fakeAsync(() => {
    const finishedStage1 = new AnsibleAllocationStage();
    const finishedStage2 = new AnsibleAllocationStage();
    spyOn(finishedStage1, 'hasFinished').and.returnValue(true);
    spyOn(finishedStage2, 'hasFinished').and.returnValue(true);
    const finishedStages = [finishedStage1, finishedStage2];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    apiSpy.getAllocationStages.and.returnValue(asyncData(new KypoPaginatedResource(finishedStages, pagination)));

    const req = new AllocationRequest();

    service.getAll(req).pipe(take(1));
    const subscription = service.resource$.subscribe();
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(1);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(2);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(2);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(2);
    tick(contextSpy.config.pollingPeriod);
    expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(2);
    subscription.unsubscribe();
  }));

  it('should emit value at least once even when all stages are finished', fakeAsync(() => {
    const finishedStage1 = new AnsibleAllocationStage();
    const finishedStage2 = new AnsibleAllocationStage();
    spyOn(finishedStage1, 'hasFinished').and.returnValue(true);
    spyOn(finishedStage2, 'hasFinished').and.returnValue(true);
    const finishedStages = [finishedStage1, finishedStage2];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    const expectedResource = new KypoPaginatedResource(finishedStages, pagination);
    apiSpy.getAllocationStages.and.returnValue(asyncData(expectedResource));

    const req = new AllocationRequest();

    service.getAll(req).pipe(take(1)).subscribe();
    let pollResult;
    const subscription = service.resource$.pipe(skip(1)).subscribe((res) => (pollResult = res));
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    subscription.unsubscribe();
  }));

  it('should emit value at least once even when some stage failed', fakeAsync(() => {
    const failedStage = new AnsibleAllocationStage();
    const inQueueStage = new AnsibleAllocationStage();
    spyOn(failedStage, 'hasFailed').and.returnValue(true);
    spyOn(inQueueStage, 'isInQueue').and.returnValue(true);
    const stages = [failedStage, inQueueStage];
    const pagination = new KypoPagination(0, 10, 10, 3, 1);
    const expectedResource = new KypoPaginatedResource(stages, pagination);
    apiSpy.getAllocationStages.and.returnValue(asyncData(expectedResource));

    const req = new AllocationRequest();

    service.getAll(req).pipe(take(1)).subscribe();
    let pollResult;
    const subscription = service.resource$.pipe(skip(1)).subscribe((res) => (pollResult = res));
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
    tick(contextSpy.config.pollingPeriod);
    expect(pollResult).toEqual(expectedResource);
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
      tick(contextSpy.config.pollingPeriod);
      calledTimes = calledTimes + 1;
      expect(apiSpy.getAllocationStages).toHaveBeenCalledTimes(calledTimes);
    }
  }
});
