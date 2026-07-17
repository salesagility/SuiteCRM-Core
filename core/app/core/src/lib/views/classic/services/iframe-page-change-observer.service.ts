/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2021 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

export class IframePageChangeObserver {
    private iframe: any;
    private lastDispatched: string;
    private changeCallback: Function = null;
    private loadCallback: Function = null;
    private pageUnlockCallback: Function = null;
    private unLoadCallback: Function = null;
    private unloadListener: Function = null;
    private loadListener: Function = null;
    private destroyed = false;

    constructor(
        iframe,
        changeCallback: Function = null,
        loadCallback: Function = null,
        pageUnlockCallback: Function = null,
        unLoadCallback: Function = null,
    ) {
        this.iframe = iframe;
        this.changeCallback = changeCallback;
        this.loadCallback = loadCallback;
        this.pageUnlockCallback = pageUnlockCallback;
        this.unLoadCallback = unLoadCallback;
    }

    /**
     * Public Api
     */

    public init(): void {
        try {
            const href = this.iframe?.contentWindow?.location?.href;
            if (href && href !== 'about:blank') {
                this.lastDispatched = href;
            } else {
                this.lastDispatched = new URL(this.iframe.src, window.location.href).href;
            }
        } catch (e) {
            this.lastDispatched = this.iframe.src;
        }

        this.loadListener = this.loadHandler.bind(this);
        this.unloadListener = this.unloadHandler.bind(this);

        this.iframe.addEventListener('load', this.loadListener);
    }

    public destroy(): void {
        if (this.iframe) {
            this.iframe.removeEventListener('load', this.loadListener);
        }

        const contentWindow = this.iframe && this.iframe.contentWindow;
        if (contentWindow) {
            contentWindow.removeEventListener('pagehide', this.unloadListener);
        }

        this.destroyed = true;
        this.iframe = null;
        this.lastDispatched = null;
        this.changeCallback = null;
        this.loadCallback = null;
        this.pageUnlockCallback = null;
        this.unLoadCallback = null;
        this.loadListener = null;
        this.unloadListener = null;
    }

    /**
     * Internal API
     */

    protected loadHandler(): void {
        if (this.destroyed) {
            return;
        }

        this.triggerPageChange();
        this.loadCallback?.();
        this.bindUnload();
    }

    protected bindUnload(): void {
        const contentWindow = this.iframe?.contentWindow;
        if (contentWindow) {
            contentWindow.removeEventListener('pagehide', this.unloadListener);
            contentWindow.addEventListener('pagehide', this.unloadListener);
        }
    }

    protected unloadHandler(event: PageTransitionEvent): void {
        if (event.persisted || this.destroyed) {
            return;
        }

        this.unLoadCallback?.();
    }

    protected triggerPageChange(): void {
        if (this.destroyed) {
            return;
        }

        try {
            const newHref = this.iframe?.contentWindow?.location?.href;

            if (newHref && newHref !== this.lastDispatched) {
                this.lastDispatched = newHref;
                this.changeCallback?.(newHref);
            } else {
                this.pageUnlockCallback?.();
            }
        } catch (e) {
        }
    }

}
