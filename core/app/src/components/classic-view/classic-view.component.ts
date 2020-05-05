import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {IframePageChangeObserver} from '@services/classic-view/iframe-page-change-observer.service';
import {IframeResizeHandlerHandler} from '@services/classic-view/iframe-resize-handler.service';

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
        private ngZone: NgZone) {
    }

    ngOnInit(): void {
        this.url = this.route.snapshot.data.legacyUrl;
    }

    ngAfterViewInit(): void {
        this.initIframe();
    }

    ngOnDestroy(): void {
        if (this.iframeResizeHandler) {
            this.iframeResizeHandler.destroy();
            this.iframeResizeHandler = null;

        }
        if (this.iframePageChangeHandler) {
            this.iframePageChangeHandler.destroy();
            this.iframePageChangeHandler = null;
        }

        this.iframe = null;
        const placeholder = this.wrapper;
        if (this.wrapper.firstChild) {
            placeholder.removeChild(placeholder.firstChild);
        }
        placeholder.innerHTML = '<iframe></iframe>';
        this.wrapper = null;
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
        const location = this.routeConverter.toFrontEnd(newLocation);

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
}
