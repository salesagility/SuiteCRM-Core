import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Button, ButtonInterface} from '@app-common/components/button/button.model';
import {MinimiseButtonStatus} from '@components/minimise-button/minimise-button.component';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'scrm-panel',
    templateUrl: './panel.component.html',
    styleUrls: []
})
export class PanelComponent implements OnInit, OnDestroy {

    @Input() klass = '';
    @Input() bodyPadding = 2;
    @Input() title: string;
    @Input() titleKey: string;
    @Input() mode: 'collapsible' | 'closable' | 'none' = 'closable';
    @Input() isCollapsed$: Observable<boolean>;
    @Input() close: ButtonInterface = {
        klass: ['btn', 'btn-outline-light', 'btn-sm']
    } as ButtonInterface;

    isCollapsed = false;
    minimiseButton: ButtonInterface;
    minimiseStatus: MinimiseButtonStatus;

    protected buttonClasses = ['btn', 'btn-outline-light', 'btn-sm'];
    protected subs: Subscription[] = [];

    constructor() {
    }

    ngOnInit(): void {
        if (this.isCollapsed$) {
            this.subs.push(this.isCollapsed$.subscribe(collapse => {
                this.isCollapsed = collapse;
                this.initMinimiseButton();
            }));
        }
        this.initCloseButton();
        this.initMinimiseButton();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    initCloseButton(): void {
        if (!this.close) {
            return;
        }

        const btn = Button.fromButton(this.close);
        btn.addClasses(this.buttonClasses);

        this.close = btn;
    }

    isClosable(): boolean {
        return this.mode === 'closable';
    }

    isCollapsible(): boolean {
        return this.mode === 'collapsible';
    }

    initMinimiseButton(): void {
        this.minimiseButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: () => {
                this.isCollapsed = !this.isCollapsed;
                this.initMinimiseStatus();
            },
        } as ButtonInterface;
        this.initMinimiseStatus();
    }

    initMinimiseStatus(): void {
        if (this.isCollapsed) {
            this.minimiseStatus = 'minimised';
            return;
        }
        this.minimiseStatus = 'maximised';
    }
}
