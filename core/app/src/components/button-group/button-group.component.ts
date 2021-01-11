import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Button, ButtonInterface} from '@app-common/components/button/button.model';
import {DropdownButtonInterface} from '@app-common/components/button/dropdown-button.model';
import {ButtonGroupInterface} from '@app-common/components/button/button-group.model';
import {Observable, Subscription} from 'rxjs';

interface SplitButtons {
    expanded: ButtonInterface[];
    collapsed: ButtonInterface[];
}

@Component({
    selector: 'scrm-button-group',
    templateUrl: './button-group.component.html',
    styles: [],
})
export class ButtonGroupComponent implements OnInit, OnDestroy {

    @Input() config$: Observable<ButtonGroupInterface>;

    buttons: SplitButtons = {
        expanded: [],
        collapsed: [],
    };

    dropdownConfig: DropdownButtonInterface;

    protected internalConfig: ButtonGroupInterface;
    private sub: Subscription;

    constructor() {
    }

    ngOnInit(): void {
        this.sub = this.config$.subscribe(config => {
            this.internalConfig = {...config};
            this.splitButtons();
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    isDropdown(item: ButtonInterface): boolean {
        if (!item) {
            return false;
        }
        return 'items' in item;
    }

    buildDropdownConfig(): void {

        let buttonClasses = ['button-group-button'];

        if (this.internalConfig.buttonKlass && this.internalConfig.buttonKlass.length > 0) {
            buttonClasses = buttonClasses.concat(this.internalConfig.buttonKlass);
        }

        let wrapperClasses = ['button-group-dropdown'];

        const dropdownOptions = this.internalConfig.dropdownOptions;
        const optionsWrapperKlass = dropdownOptions && dropdownOptions.wrapperKlass;

        if (optionsWrapperKlass && optionsWrapperKlass.length > 0) {
            wrapperClasses = wrapperClasses.concat(optionsWrapperKlass);
        }

        this.dropdownConfig = {
            label: this.internalConfig.dropdownLabel,
            klass: [...buttonClasses],
            wrapperKlass: wrapperClasses,
            items: this.buttons.collapsed,
        } as DropdownButtonInterface;

        if (this.internalConfig.dropdownOptions && this.internalConfig.dropdownOptions.placement) {
            this.dropdownConfig.placement = this.internalConfig.dropdownOptions.placement;
        }
    }

    protected getBreakpoint(): number {

        if (!this.internalConfig.breakpoint) {
            return 4;
        }

        return this.internalConfig.breakpoint;
    }

    protected splitButtons(): void {

        this.buttons.expanded = [];
        this.buttons.collapsed = [];

        if (!this.internalConfig.buttons || this.internalConfig.buttons.length < 1) {
            return;
        }

        let count = 0;

        this.internalConfig.buttons.forEach(button => {

            if (!button) {
                return;
            }

            if (count < this.getBreakpoint()) {
                let classes = ['button-group-button'];
                if (this.internalConfig.buttonKlass && this.internalConfig.buttonKlass.length > 0) {
                    classes = classes.concat(this.internalConfig.buttonKlass);
                }
                const newButton = {...button};
                Button.appendClasses(newButton, [...classes]);

                this.buttons.expanded.push(newButton);
            } else {
                this.buttons.collapsed.push({...button});
            }

            count++;
        });

        this.buildDropdownConfig();
    }

}
