import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {AppState, AppStateFacade} from "@base/store/app-state/app-state.facade";
import {Observable} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    @ViewChild('mainOutlet', {read: ViewContainerRef, static: true})
    mainOutlet: ViewContainerRef | undefined;
    appState$: Observable<AppState> = this.appStateFacade.vm$;

    constructor(private router: Router, private appStateFacade: AppStateFacade) {
        router.events.subscribe((routerEvent: Event) => this.checkRouterEvent(routerEvent));
    }

    ngOnInit() {
    }

    private checkRouterEvent(routerEvent: Event) {
        if (routerEvent instanceof NavigationStart) {
            this.appStateFacade.updateLoading('router-navigation',true);
        }

        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.appStateFacade.updateLoading('router-navigation', false);
        }
    }
}
