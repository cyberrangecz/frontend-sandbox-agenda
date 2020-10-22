import { async, TestBed } from '@angular/core/testing';
import { asyncData, PaginatedResource, SentinelPagination } from '@sentinel/common';
import { skip, take } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SandboxErrorHandler } from 'kypo-sandbox-agenda';
import { VMImagesApi } from 'kypo-sandbox-api';
import { VMImagesConcreteService } from './vm-images-concrete.service';
import {
  createContextSpy,
  createErrorHandlerSpy,
  createPagination,
  createVMImagesApiSpy,
} from '../../../internal/src/testing/testing-commons.spec';
import { SandboxAgendaContext } from '../../../internal/src/services/sandox-agenda-context.service';

describe('VMImagesConcreteService', () => {
  let service: VMImagesConcreteService;
  let VMImagesApiSpy: jasmine.SpyObj<VMImagesApi>;
  let errorHandlerSpy: jasmine.SpyObj<SandboxErrorHandler>;
  let contextSpy: jasmine.SpyObj<SandboxAgendaContext>;

  beforeEach(async(() => {
    errorHandlerSpy = createErrorHandlerSpy();
    VMImagesApiSpy = createVMImagesApiSpy();
    contextSpy = createContextSpy();

    TestBed.configureTestingModule({
      providers: [
        VMImagesConcreteService,
        { provide: SandboxErrorHandler, useValue: errorHandlerSpy },
        { provide: VMImagesApi, useValue: VMImagesApiSpy },
        { provide: SandboxAgendaContext, useValue: contextSpy },
      ],
    });
    service = TestBed.inject(VMImagesConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api to get available images', (done) => {
    const pagination = createPagination();
    VMImagesApiSpy.getAvailableImages.and.returnValue(asyncData(null));

    service.getAvailableImages(pagination).subscribe(
      (_) => {
        expect(VMImagesApiSpy.getAvailableImages).toHaveBeenCalledTimes(1);
        done();
      },
      (_) => fail
    );
  });

  it('should emit next value when data received from api', (done) => {
    const pagination = createPagination();
    const mockData = createMock();
    VMImagesApiSpy.getAvailableImages.and.returnValue(asyncData(mockData));

    service.resource$.pipe(skip(1), take(1)).subscribe(
      (emitted) => {
        expect(emitted).toBe(mockData);
        done();
      },
      (_) => fail
    );
    service.getAvailableImages(pagination).subscribe();
  });

  it('should emit error on error state', (done) => {
    const pagination = createPagination();
    VMImagesApiSpy.getAvailableImages.and.returnValue(throwError(null));

    service.getAvailableImages(pagination).subscribe(
      (_) => fail,
      (_) => {
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  function createMock() {
    return new PaginatedResource([], new SentinelPagination(1, 0, 5, 5, 1));
  }
});
