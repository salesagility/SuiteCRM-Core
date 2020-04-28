import {MutationObserverFactory} from '@angular/cdk/observers';

export class IframeResizeHandlerHandler {
    private iframe: any;
    private observer: MutationObserver;

    constructor(iframe) {
        this.iframe = iframe;
    }

    /**
     * Public Api
     */

    public init(): void {
        this.initialSizeAdjustment();
        this.addBodyResizeListener();
    }

    public destroy(): void {

        this.observer.disconnect();

        this.iframe = null;
        this.observer = null;
    }

    /**
     * Protected Api
     */

    protected initialSizeAdjustment(): void {
        setTimeout(this.onResize.bind(this), 200);
    }

    protected addBodyResizeListener(): void {
        const watchedData = {
            document: this.iframe.contentWindow.document,
            element: this.iframe.contentWindow.document.body,
            height: this.iframe.contentWindow.document.body.scrollHeight,
            watched: [
                {
                    getHeight: (): number => {
                        const modals = watchedData.document.getElementsByClassName('modal in');
                        const modal = modals && modals[0];
                        const modalDialog = modal && modal.firstElementChild;
                        return (modalDialog && (modalDialog.scrollHeight + 200)) || -1;
                    }
                },
                {
                    getHeight: (): number => {
                        const container = watchedData.document.getElementById('bootstrap-container');
                        const containerHeight = (container && container.scrollHeight + 150) || -1;

                        if (containerHeight > 0) {
                            return containerHeight;
                        }

                        return watchedData.element.scrollHeight + 50;
                    }
                }
            ]
        };

        this.observer = (new MutationObserverFactory()).create(() => {
            const heights = [];
            watchedData.watched.forEach((watched) => {
                const elHeight = watched.getHeight();

                if (elHeight > 0) {
                    heights.push(elHeight);
                }
            });

            heights.sort((a, b) => a - b);

            // consider the Height of the biggest
            const elementHeight = heights.pop();

            if (watchedData.height === elementHeight) {
                return;
            }

            if (watchedData.height < (elementHeight - 20)) {
                watchedData.height = elementHeight;
                this.resizeIFrame(elementHeight);
                return;
            }

            if (this.iframe.scrollHeight > elementHeight) {
                watchedData.height = elementHeight;
                this.resizeIFrame(elementHeight);
                return;
            }
        });

        this.observer.observe(this.iframe.contentWindow.document.body, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    protected onResize(): void {
        if ((this.iframe.offsetHeight + 50) < this.iframe.contentWindow.document.body.scrollHeight) {
            this.resizeIFrame(this.iframe.contentWindow.document.body.scrollHeight + 50);
        }
    }

    protected resizeIFrame(size: number): void {
        this.iframe.style.height = size + 'px';
    }
}
