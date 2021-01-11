import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {DropdownButtonInterface} from '@app-common/components/button/dropdown-button.model';
import {DropdownOptions} from '@app-common/components/button/button-group.model';

export declare type ModalButtonCallback = (activeModal: NgbActiveModal) => void;

export type AnyModalButtonInterface = ModalButtonInterface | ModalDropdownButtonInterface;

export interface ModalButtonInterface extends ButtonInterface {
    onClick?: ModalButtonCallback;
}

export interface ModalDropdownButtonInterface extends DropdownButtonInterface {
    items?: AnyModalButtonInterface[];
}

export interface ModalCloseFeedBack {
    type: string;
}

export interface ModalButtonGroupInterface {
    wrapperKlass?: string[];
    buttonKlass?: string[];
    buttons?: AnyModalButtonInterface[];
    dropdownLabel?: string;
    dropdownOptions?: DropdownOptions;
    breakpoint?: number;
}
