import {ButtonInterface} from '@components/button/button.model';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';

export type AnyButtonInterface = ButtonInterface | DropdownButtonInterface;

export interface DropdownButtonInterface extends ButtonInterface {
    wrapperKlass?: string | string[] | Set<string> | { [key: string]: any };
    items?: AnyButtonInterface[];
    placement?: PlacementArray;
}
