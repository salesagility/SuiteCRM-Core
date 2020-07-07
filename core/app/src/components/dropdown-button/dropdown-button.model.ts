import {ButtonInterface} from '@components/button/button.model';

export interface DropdownButtonItemInterface {
    label: string;
    onClick?: Function;
    klass?: string | string[] | Set<string> | { [key: string]: any };
}

export interface DropdownButtonInterface extends ButtonInterface {
    wrapperKlass?: string | string[] | Set<string> | { [key: string]: any };
    items?: DropdownButtonItemInterface[];
}
