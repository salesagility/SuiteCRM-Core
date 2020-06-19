import {ButtonInterface} from '@components/button/button.model';

export interface DropdownButtonItemInterface {
    label: string;
    onClick?: Function;
}

export interface DropdownButtonInterface extends ButtonInterface {
    items?: DropdownButtonItemInterface[];
}
