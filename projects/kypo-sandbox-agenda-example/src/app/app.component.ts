import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Agenda, AgendaContainer } from '@sentinel/layout';
import { SentinelAuthService, User } from '@sentinel/auth';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  activeUser$: Observable<User>;
  title$: Observable<string>;
  subtitle$: Observable<string>;
  agendaContainers$: Observable<AgendaContainer[]>;
  notificationRoute = 'notifications';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: SentinelAuthService,
  ) {
    this.activeUser$ = this.auth.activeUser$;
    this.title$ = this.getTitleFromRouter();
    this.subtitle$ = this.getSubtitleFromRouter();

    this.agendaContainers$ = this.auth.activeUser$.pipe(
      filter((user) => user !== null && user !== undefined),
      map(() => this.buildNav()),
    );
  }

  private getTitleFromRouter(): Observable<string> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      map((route) => route.snapshot),
      map((snapshot) => snapshot.data.title),
    );
  }

  private getSubtitleFromRouter(): Observable<string> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      map((route) => route.snapshot),
      map((snapshot) => snapshot.data.subtitle),
    );
  }

  onLogin(): void {
    this.auth.login();
  }

  onLogout(): void {
    this.auth.logout();
  }

  buildNav(): AgendaContainer[] {
    const containers: AgendaContainer[] = [];
    const agendas: Agenda[] = [];
    agendas.push(new Agenda('Definition', 'sandbox-definition'));
    agendas.push(new Agenda('Pool', 'pool'));
    agendas.push(new Agenda('Images', 'images'));
    if (agendas.length > 0) {
      containers.push(new AgendaContainer('Sandboxes', agendas));
    }
    return containers;
  }
}
