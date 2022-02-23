import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginatedResource, OffsetPagination, asyncData, OffsetPaginationEvent } from '@sentinel/common';
import { SandboxDefinitionApi } from '@muni-kypo-crp/sandbox-api';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { throwError } from 'rxjs';
import { skip } from 'rxjs/operators';
import {
  createContextSpy,
  createDefinitionApiSpy,
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNavigatorSpy,
  createNotificationSpy,
  createRouterSpy,
} from '../../testing/testing-commons.spec';
import { SandboxErrorHandler } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxNavigator } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxNotificationService } from '@muni-kypo-crp/sandbox-agenda';
import { SandboxAgendaContext } from '../sandox-agenda-context.service';
import { SandboxDefinitionOverviewConcreteService } from './sandbox-definition-overview-concrete.service';

describe('SandboxDefinitionOverviewConcreteService', () => {
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let apiSpy: jasmine.SpyObj<SandboxDefinitionApi>;
  let notificationSpy: jasmine.SpyObj<SandboxNotificationService>;
  let navigatorSpy: jasmine.SpyObj<SandboxNavigator>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let service: SandboxDefinitionOverviewConcreteService;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    notificationSpy = createNotificationSpy();
    navigatorSpy = createNavigatorSpy();
    contextSpy = createContextSpy();
    dialogSpy = createMatDialogSpy();
    apiSpy = createDefinitionApiSpy();
    routerSpy = createRouterSpy();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        SandboxDefinitionOverviewConcreteService,
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SandboxDefinitionApi, useValue: apiSpy },
        { provide: SandboxNotificationService, useValue: notificationSpy },
        { provide: SandboxNavigator, useValue: navigatorSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(SandboxDefinitionOverviewConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call error handler on err', (done) => {
    const pagination = createPagination();
    apiSpy.getAll.and.returnValue(throwError(null));

    service.getAll(pagination).subscribe(
      () => fail,
      () => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      }
    );
    expect(apiSpy.getAll).toHaveBeenCalledTimes(1);
  });

  it('should emit next value on update (sandboxDefinitions)', (done) => {
    const pagination = createPagination();
    const mockData = createMockData();
    apiSpy.getAll.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1)).subscribe((emitted) => {
      expect(emitted).toBe(mockData);
      done();
    }, fail);
    service.getAll(pagination).subscribe(() => done(), fail);
  });

  function createPagination(): OffsetPaginationEvent {
    return new OffsetPaginationEvent(1, 5, '', '');
  }

  function createMockData() {
    const sandbox1 = new SandboxDefinition();
    sandbox1.id = 1;
    const sandbox2 = new SandboxDefinition();
    sandbox2.id = 2;
    return new PaginatedResource<SandboxDefinition>([sandbox1, sandbox2], new OffsetPagination(1, 2, 5, 2, 1));
  }
});
