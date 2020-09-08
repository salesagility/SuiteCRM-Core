import {ButtonInterface} from '@components/button/button.model';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';

export interface DropdownOptions {
    placement?: PlacementArray;
    wrapperKlass?: string[];
}

export interface ButtonGroupInterface {
    wrapperKlass?: string[];
    buttonKlass?: string[];
    buttons?: ButtonInterface[];
    dropdownLabel?: string;
    dropdownOptions?: DropdownOptions;
    breakpoint?: number;
}
