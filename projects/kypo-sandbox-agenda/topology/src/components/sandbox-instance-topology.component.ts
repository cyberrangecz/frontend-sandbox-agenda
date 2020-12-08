import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SentinelBaseDirective } from '@sentinel/common';
import { SandboxInstance } from '@muni-kypo-crp/sandbox-model';
import { Kypo2TopologyErrorService } from '@muni-kypo-crp/topology-graph';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { SandboxErrorHandler, SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME } from '@muni-kypo-crp/sandbox-agenda';

/**
 * Smart component of sandbox instance topology page
 */
@Component({
  selector: 'kypo-sandbox-instance-topology',
  templateUrl: './sandbox-instance-topology.component.html',
  styleUrls: ['./sandbox-instance-topology.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxInstanceTopologyComponent extends SentinelBaseDirective implements OnInit {
  sandboxInstance$: Observable<SandboxInstance>;
  topologyWidth: number;
  topologyHeight: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private topologyErrorService: Kypo2TopologyErrorService,
    private errorHandler: SandboxErrorHandler
  ) {
    super();
  }

  ngOnInit(): void {
    this.sandboxInstance$ = this.activeRoute.data.pipe(
      takeWhile(() => this.isAlive),
      map((data) => data[SANDBOX_INSTANCE_DATA_ATTRIBUTE_NAME])
    );
    this.calculateTopologySize();
    this.subscribeToTopologyErrorHandler();
  }

  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
  onResize(event): void {
    this.calculateTopologySize();
  }

  private calculateTopologySize() {
    this.topologyWidth = window.innerWidth - 300;
    this.topologyHeight = window.innerHeight - 260;
  }

  private subscribeToTopologyErrorHandler() {
    this.topologyErrorService.error$.pipe(takeWhile(() => this.isAlive)).subscribe({
      next: (event) => this.errorHandler.emit(event.err, event.action),
      error: (err) => this.errorHandler.emit(err, 'There is a problem with topology error handler.'),
    });
  }
}
