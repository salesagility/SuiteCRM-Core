import {Component, Input, OnInit} from '@angular/core';
import {Button, ButtonInterface} from '@app-common/components/button/button.model';

@Component({
    selector: 'scrm-panel',
    templateUrl: './panel.component.html',
    styleUrls: []
})
export class PanelComponent implements OnInit {

    @Input() klass = '';
    @Input() bodyPadding = 2;
    @Input() title: string;
    @Input() mode: 'collapsible' | 'closable' | 'none' = 'closable';
    @Input() close: ButtonInterface = {
        klass: ['btn', 'btn-outline-light', 'btn-sm']
    } as ButtonInterface;

    isCollapsed = false;

    protected buttonClasses = ['btn', 'btn-outline-light', 'btn-sm'];

    constructor() {
    }

    ngOnInit(): void {
        this.initCloseButton();
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

    minimiseConfig(): ButtonInterface {
        return {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: () => {
                this.isCollapsed = !this.isCollapsed;
            },
        } as ButtonInterface;
    }
}
