import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SentinelBaseDirective } from '@sentinel/common';
import { SandboxDefinition, SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { KypoTopologyErrorService, TopologyApi } from '@muni-kypo-crp/topology-graph';
import { Observable } from 'rxjs';
import { map, take, takeWhile, tap } from 'rxjs/operators';
import {
  SandboxErrorHandler,
  SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME,
  SANDBOX_DEFINITION_DATA_ATTRIBUTE_NAME,
} from '@muni-kypo-crp/sandbox-agenda';

/**
 * Smart component of sandbox instance topology page
 */
@Component({
  selector: 'kypo-sandbox-instance-topology',
  templateUrl: './sandbox-topology.component.html',
  styleUrls: ['./sandbox-topology.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxTopologyComponent extends SentinelBaseDirective implements OnInit, AfterViewInit {
  sandboxInstance$: Observable<SandboxInstance>;
  sandboxDefinition$: Observable<SandboxDefinition>;
  topologyWidth: number;
  topologyHeight: number;
  sandboxId: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private topologyErrorService: KypoTopologyErrorService,
    private errorHandler: SandboxErrorHandler,
    private topologyService: TopologyApi
  ) {
    super();
  }

  ngOnInit(): void {
    this.sandboxInstance$ = this.activeRoute.data.pipe(
      takeWhile(() => this.isAlive),
      map((data) => data[SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME]),
      tap((data) => (this.sandboxId = data?.id))
    );
    this.sandboxDefinition$ = this.activeRoute.data.pipe(
      takeWhile(() => this.isAlive),
      map((data) => data[SANDBOX_DEFINITION_DATA_ATTRIBUTE_NAME])
    );
    this.calculateTopologySize();
    this.subscribeToTopologyErrorHandler();
  }

  ngAfterViewInit(): void {
    if (this.sandboxId) {
      this.loadConsoles(this.sandboxId).pipe(take(1)).subscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
  onResize(event): void {
    this.calculateTopologySize();
  }

  private calculateTopologySize() {
    this.topologyWidth = window.innerWidth - 325;
    this.topologyHeight = window.innerHeight - 260;
  }

  private subscribeToTopologyErrorHandler() {
    this.topologyErrorService.error$.pipe(takeWhile(() => this.isAlive)).subscribe({
      next: (event) => this.errorHandler.emit(event.err, event.action),
      error: (err) => this.errorHandler.emit(err, 'There is a problem with topology error handler.'),
    });
  }

  private loadConsoles(sandboxId: number) {
    /**
     * Preloads VM console for user and stores it into browser storage for further use in topology.
     * @param sandboxId id of sandbox in which the vm exists
     */
    const storage = window.localStorage;
    return this.topologyService.getVMConsolesUrl(sandboxId).pipe(
      tap(
        (consoles) => storage.setItem('vm-consoles', JSON.stringify(consoles)),
        (err) => this.errorHandler.emit(err, 'Obtaining console URL')
      )
    );
  }
}
