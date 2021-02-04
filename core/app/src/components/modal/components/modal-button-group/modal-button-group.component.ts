import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ButtonGroupInterface} from '@app-common/components/button/button-group.model';
import {ModalButtonGroupInterface} from '@app-common/components/modal/modal.model';
import {deepClone} from '@app-common/utils/object-utils';
import {map} from 'rxjs/operators';
import {ButtonUtils} from '@components/button/button.utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import defaults from 'lodash-es/defaults';
import {SystemConfigStore} from '@store/system-config/system-config.store';

@Component({
    selector: 'scrm-modal-button-group',
    templateUrl: './modal-button-group.component.html',
    styleUrls: []
})
export class ModalButtonGroupComponent implements OnInit {

    @Input() config$: Observable<ModalButtonGroupInterface>;
    @Input() activeModal: NgbActiveModal = null;

    buttonGroup$: Observable<ButtonGroupInterface>;
    protected defaultButtonGroup: ButtonGroupInterface = {
        breakpoint: 4,
        wrapperKlass: ['modal-buttons'],
        buttonKlass: ['modal-button', 'btn', 'btn-sm'],
        buttons: []
    };

    constructor(
        protected buttonUtils: ButtonUtils,
        protected config: SystemConfigStore,
    ) {
        const ui = this.config.getConfigValue('ui');
        if (ui && ui.modal_button_group_breakpoint) {
            this.defaultButtonGroup.breakpoint = ui.modal_buttons_collapse_breakpoint;
        }
    }

    ngOnInit(): void {

        if (this.config$) {
            this.buttonGroup$ = this.config$.pipe(
                map((config: ButtonGroupInterface) => this.mapButtonGroup(config))
            );
        }
    }

    protected mapButtonGroup(config: ButtonGroupInterface): ButtonGroupInterface {
        const group = defaults({...config}, deepClone(this.defaultButtonGroup));

        this.mapButtons(group);

        return group;
    }

    protected mapButtons(group: ButtonGroupInterface): void {
        const buttons = group.buttons || [];
        group.buttons = [];

        if (buttons.length > 0) {
            buttons.forEach(modalButton => {
                const button = this.buttonUtils.addOnClickPartial(modalButton, this.activeModal);
                group.buttons.push(button);
            });
        }
    }
}
