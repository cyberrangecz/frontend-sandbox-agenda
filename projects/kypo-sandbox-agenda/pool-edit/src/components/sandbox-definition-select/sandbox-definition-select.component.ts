import { ChangeDetectionStrategy, Component, DestroyRef, inject, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaginatedResource, OffsetPaginationEvent } from '@sentinel/common/pagination';
import { SandboxDefinition } from '@muni-kypo-crp/sandbox-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PaginationService,
  SandboxDefinitionOverviewService,
  SandboxDefinitionOverviewConcreteService,
} from '@muni-kypo-crp/sandbox-agenda/internal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'kypo-sandbox-definition-select',
  templateUrl: './sandbox-definition-select.component.html',
  styleUrls: ['./sandbox-definition-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SandboxDefinitionOverviewService, useClass: SandboxDefinitionOverviewConcreteService }],
})
export class SandboxDefinitionSelectComponent implements OnInit {
  readonly PAGE_SIZE: number;

  definitions$: Observable<PaginatedResource<SandboxDefinition>>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;

  selected: SandboxDefinition[];
  destroyRef = inject(DestroyRef);

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public preselected: SandboxDefinition,
    public dialogRef: MatDialogRef<SandboxDefinitionSelectComponent>,
    private paginationService: PaginationService,
    private definitionService: SandboxDefinitionOverviewService
  ) {
    this.selected = [preselected];
    this.PAGE_SIZE = this.paginationService.getPagination();
  }

  ngOnInit(): void {
    this.definitions$ = this.definitionService.resource$;
    this.isLoading$ = this.definitionService.isLoading$;
    this.hasError$ = this.definitionService.hasError$;
    this.definitionService
      .getAll(new OffsetPaginationEvent(0, Number.MAX_SAFE_INTEGER, '', 'asc'))
      .pipe(
        map((resources) => {
          resources.elements.map(
            (definition) => (definition.title = `${definition.title} (ID: ${definition.id}, rev: ${definition.rev})`)
          );
          return resources;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  fetch(pagination: OffsetPaginationEvent): void {
    this.paginationService.setPagination(pagination.size);
    this.definitionService
      .getAll(new OffsetPaginationEvent(0, Number.MAX_SAFE_INTEGER, '', 'asc'))
      .pipe(
        map((resources) => {
          resources.elements.map(
            (definition) => (definition.title = `${definition.title} (ID: ${definition.id}, rev: ${definition.rev})`)
          );
          return resources;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  confirm(): void {
    this.dialogRef.close(this.selected[0]);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  /**
   * Updated selected sandbox definition
   * @param selected selected sandbox definition
   */
  onSelectionChange(selected: SandboxDefinition[]): void {
    this.selected = selected;
  }
}
