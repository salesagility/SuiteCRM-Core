import {Component, Input, OnInit} from '@angular/core';
import {Button, ButtonInterface} from '@components/button/button.model';

type MinimiseButtonStatus = 'minimised' | 'maximised';

@Component({
    selector: 'scrm-minimise-button',
    templateUrl: './minimise-button.component.html',
    styleUrls: []
})
export class MinimiseButtonComponent implements OnInit {
    @Input() config: ButtonInterface;
    @Input() status: MinimiseButtonStatus = 'maximised';
    internalConfig: ButtonInterface;

    buttonClasses = ['minimise-button'];

    constructor() {
    }

    ngOnInit(): void {
        this.buildButton();
    }

    buildButton(): void {
        const btn = Button.fromButton(this.config);
        btn.addClasses(this.buttonClasses);
        btn.icon = this.getIcon();
        btn.onClick = (): void => {
            this.config.onClick();
            this.toggleStatus();
        };
        this.internalConfig = btn;
    }

    toggleStatus(): void {
        let newStatus: MinimiseButtonStatus = 'minimised';
        if (this.status === 'minimised') {
            newStatus = 'maximised';
        }
        this.status = newStatus;
        this.buildButton();
    }

    getIcon(): string {
        if (this.status === 'minimised') {
            return 'plus_thin';
        }
        return 'minimise';
    }
}
