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
  agendaContainers$: Observable<AgendaContainer[]>;
  notificationRoute = 'notifications';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private auth: SentinelAuthService) {
    this.activeUser$ = this.auth.activeUser$;
    this.title$ = this.getTitleFromRouter();

    this.agendaContainers$ = this.auth.activeUser$.pipe(
      filter((user) => user !== null && user !== undefined),
      map((user) => this.buildNav(user))
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
      map((snapshot) => snapshot.data.title)
    );
  }

  onLogin() {
    this.auth.login();
  }

  onLogout() {
    this.auth.logout();
  }

  buildNav(user: User): AgendaContainer[] {
    const containers: AgendaContainer[] = [];
    const agendas: Agenda[] = [];
    agendas.push(new Agenda('Definition', 'sandbox-definition'));
    agendas.push(new Agenda('Pool', 'pool'));
    agendas.push(new Agenda('Resources', 'resources'));
    if (agendas.length > 0) {
      containers.push(new AgendaContainer('Sandboxes', agendas));
    }
    return containers;
  }
}
