import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {RouteConverter, RouteInfo} from '@services/navigation/route-converter/route-converter.service';
import {IframePageChangeObserver} from '@views/classic/services/iframe-page-change-observer.service';
import {IframeResizeHandlerHandler} from '@views/classic/services/iframe-resize-handler.service';
import {AuthService} from '@services/auth/auth.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';

interface RoutingExclusions {
    [key: string]: string[];
}

@Component({
    selector: 'scrm-classic-view-ui',
    templateUrl: './classic-view.component.html',
    styleUrls: []
})
export class ClassicViewUiComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('dataContainer', {static: true}) dataContainer: ElementRef;
    public wrapper: any;
    public url: string;
    protected iframe = null;
    private iframePageChangeHandler: IframePageChangeObserver;
    private iframeResizeHandler: IframeResizeHandlerHandler;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private routeConverter: RouteConverter,
        private auth: AuthService,
        private ngZone: NgZone,
        private systemConfigs: SystemConfigStore,
    ) {
    }

    ngOnInit(): void {
        this.url = this.route.snapshot.data.legacyUrl;
    }

    ngAfterViewInit(): void {
        this.initIframe();
    }

    ngOnDestroy(): void {
        this.cleanObservers();

        this.iframe = null;
        const placeholder = this.wrapper;
        if (this.wrapper.firstChild) {
            placeholder.removeChild(placeholder.firstChild);
        }
        placeholder.innerHTML = '<iframe></iframe>';
        this.wrapper = null;
    }

    cleanObservers(): void {
        if (this.iframeResizeHandler) {
            this.iframeResizeHandler.destroy();
            this.iframeResizeHandler = null;

        }
        if (this.iframePageChangeHandler) {
            this.iframePageChangeHandler.destroy();
            this.iframePageChangeHandler = null;
        }
    }

    initIframe(): void {
        this.wrapper = this.dataContainer.nativeElement;

        if (this.wrapper.firstChild) {
            this.wrapper.removeChild(this.wrapper.firstChild);
        }
        const iframe = document.createElement('iframe');
        iframe.src = this.url;

        this.wrapper.appendChild(iframe);

        this.iframe = iframe;

        this.iframe.style.display = 'block';

        this.initObservers();
    }

    initObservers(): void {
        this.iframePageChangeHandler = this.buildIframePageChangeObserver();
        this.iframeResizeHandler = this.buildIframeResizeHandlerHandler();

        if (this.iframePageChangeHandler) {
            this.iframePageChangeHandler.init();
        }
    }

    protected onPageChange(newLocation): void {

        if (this.shouldRedirect(newLocation) === false) {
            this.iframe.style.display = 'block';
            this.cleanObservers();
            this.initObservers();
            return;
        }

        const location = this.routeConverter.toFrontEndRoute(newLocation);

        if (location === '/users/login') {
            this.auth.logout('LBL_SESSION_EXPIRED');
            return;
        }

        this.ngZone.run(() => this.router.navigateByUrl(location).then()).then();
    }

    protected onIFrameLoad(): void {
        // Do not show scroll at any time, to avoid flickering
        this.iframe.contentWindow.document.body.style.overflow = 'hidden';

        // Init resize handler
        this.iframeResizeHandler.init(this.iframe);
    }

    protected onIFrameUnload(): void {
        // hide iframe, while being re-directed
        this.iframe.style.display = 'none';
        this.iframeResizeHandler.destroy();
    }

    protected buildIframePageChangeObserver(): IframePageChangeObserver {
        return new IframePageChangeObserver(
            this.iframe,
            this.onPageChange.bind(this),
            this.onIFrameLoad.bind(this),
            this.onIFrameUnload.bind(this),
        );
    }

    protected buildIframeResizeHandlerHandler(): IframeResizeHandlerHandler {
        return new IframeResizeHandlerHandler();
    }

    /**
     * Check if should re-direct to link or if it was excluded
     *
     * @param {string} legacyLink to check
     * @returns {boolean} should redirect
     */
    protected shouldRedirect(legacyLink: string): boolean {

        if (legacyLink && legacyLink.includes('/#/')) {
            return true;
        }

        const routeInfo = this.routeConverter.parse(legacyLink);

        // if no route or no module, don't re-direct
        if (!routeInfo || !routeInfo.module) {
            return false;
        }

        const reuse = this.routeConverter.matchesActiveRoute(this.route, routeInfo);

        if (reuse === true) {
            return false;
        }

        if (!routeInfo.action) {
            return true;
        }

        return this.toExclude(routeInfo);
    }

    /**
     * Check if given route is to exclude from redirection
     *
     * @param {object} routeInfo to check
     * @returns {boolean} is to exclude
     */
    protected toExclude(routeInfo: RouteInfo): boolean {
        const exclusions: RoutingExclusions = this.systemConfigs.getConfigValue('classicview_routing_exclusions');

        if (!exclusions || Object.keys(exclusions).length === 0) {
            return true;
        }

        // if action is excluded for any module, don't re-direct
        if (exclusions.any && exclusions.any.includes(routeInfo.action)) {
            return false;
        }

        if (!exclusions[routeInfo.module]) {
            return true;
        }

        // if module action is excluded, don't re-direct
        const moduleExclusions = exclusions[routeInfo.module];
        return !(moduleExclusions && moduleExclusions.includes(routeInfo.action));
    }
}
