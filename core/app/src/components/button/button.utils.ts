import {Injectable} from '@angular/core';
import {AnyButtonInterface} from '@app-common/components/button/dropdown-button.model';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ButtonUtils {

    constructor() {
    }

    addOnClickPartial(button: AnyButtonInterface, partial: any): AnyButtonInterface {
        const copy = {...button};

        if (button && 'items' in copy) {
            const items = copy.items;
            copy.items = [];

            items.forEach(item => {


                copy.items.push(this.addOnClickPartial(item, partial));
            });

            return copy;
        }

        copy.onClick = copy.onClick && _.partial(copy.onClick, partial);

        return copy;
    }
}
