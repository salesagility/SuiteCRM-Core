import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    @ViewChild('mainOutlet', {read: ViewContainerRef, static: true})
    mainOutlet: ViewContainerRef | undefined;
    loading = false;

    constructor(private router: Router) {
        router.events.subscribe((routerEvent: Event) => this.checkRouterEvent(routerEvent));
    }

    ngOnInit() {
    }

    private checkRouterEvent(routerEvent: Event) {
        if (routerEvent instanceof NavigationStart) {
            this.loading = true;
        }

        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.loading = false;
        }
    }
}
