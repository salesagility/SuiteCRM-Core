export class IframePageChangeObserver {
    private iframe: any;
    private lastDispatched: string;
    private changeCallback: Function = null;
    private loadCallback: Function = null;
    private unLoadCallback: Function = null;
    private unloadListener: Function = null;
    private loadListener: Function = null;

    constructor(
        iframe,
        changeCallback: Function = null,
        loadCallback: Function = null,
        unLoadCallback: Function = null,
    ) {
        this.iframe = iframe;
        this.changeCallback = changeCallback;
        this.loadCallback = loadCallback;
        this.unLoadCallback = unLoadCallback;
    }

    /**
     * Public Api
     */

    public init(): void {
        this.loadListener = this.loadHandler.bind(this);
        this.unloadListener = this.unloadHandler.bind(this);
        this.iframe.contentWindow.addEventListener('load', this.loadListener);
        this.iframe.contentWindow.removeEventListener('unload', this.unloadListener);
    }

    public destroy(): void {

        this.iframe.contentWindow.removeEventListener('unload', this.unloadListener);
        this.iframe.contentWindow.removeEventListener('load', this.loadListener);

        this.iframe = null;
        this.lastDispatched = null;
        this.changeCallback = null;
        this.loadCallback = null;
        this.unLoadCallback = null;
        this.loadListener = null;
        this.unloadListener = null;
    }


    /**
     * Internal API
     */

    protected loadHandler(): void {
        this.loadCallback();
        this.bindUnload();
    }

    protected bindUnload(): void {
        this.iframe.contentWindow.removeEventListener('unload', this.unloadListener);
        this.unloadListener = this.unloadHandler.bind(this);
        this.iframe.contentWindow.addEventListener('unload', this.unloadListener);
    }

    protected unloadHandler(): void {
        this.unLoadCallback();

        // Timeout needed because the URL changes immediately after
        // the `unload` event is dispatched.
        setTimeout(this.triggerPageChange.bind(this), 0);
    }

    protected triggerPageChange(): void {
        const newHref = this.iframe.contentWindow.location.href;

        if (newHref !== this.lastDispatched) {
            this.lastDispatched = newHref;
            this.changeCallback(newHref);
        }
    }

}
