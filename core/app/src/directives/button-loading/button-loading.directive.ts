import {Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AppStateStore} from '@store/app-state/app-state.store';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[scrm-button-loading]'
})
export class ButtonLoadingDirective implements OnInit, OnDestroy, OnChanges {

    @Input('scrm-button-loading') state: boolean;
    private subscription: Subscription;
    private appLoading = false;

    constructor(private el: ElementRef, private appStateStore: AppStateStore) {
    }

    ngOnInit(): void {
        this.subscription = this.appStateStore.loading$.pipe(tap((loading: boolean) => {
            this.appLoading = loading;
            this.updateComponent();
        })).subscribe();
        this.updateComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.state) {
            this.updateComponent();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @HostListener('click')
    clickEvent(): void {
        this.updateComponent();
    }

    /**
     * Calculate loading state and update loading
     */
    private updateComponent(): void {
        const loading = this.isLoading();
        this.setDisabledState(loading);
    }

    /**
     * Calculate if is loading
     *
     * @returns {boolean} isLoading
     */
    private isLoading(): boolean {
        let loading = false;

        if (this.state === true || this.appLoading === true) {
            loading = true;
        }

        return loading;
    }

    /**
     * Disable or enable button
     *
     * @param {boolean} state to set
     */
    private setDisabledState(state: boolean): void {
        this.el.nativeElement.disabled = state;
    }
}
