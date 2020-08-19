import { takeWhile, tap } from 'rxjs/operators';
import { Resources } from 'kypo-sandbox-model/public-api';
import { SentinelBaseDirective } from '@sentinel/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { SandboxResourcesService } from '../services/sandbox-resources.service';

@Component({
  selector: 'kypo-sandbox-resources',
  templateUrl: './sandbox-resources.component.html',
  styleUrls: ['./sandbox-resources.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxResourcesComponent extends SentinelBaseDirective implements OnInit {
  constructor(private sandboxResourcesService: SandboxResourcesService) {
    super();
    this.data$ = this.sandboxResourcesService.resources$;
  }

  data$: Observable<Resources>;

  ngOnInit(): void {
    this.sandboxResourcesService
      .getResources()
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }
}
