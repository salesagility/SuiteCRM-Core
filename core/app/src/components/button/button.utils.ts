import {Injectable} from '@angular/core';
import {AnyButtonInterface} from '@app-common/components/button/dropdown-button.model';
import partial from 'lodash-es/partial';

@Injectable({
    providedIn: 'root'
})
export class ButtonUtils {

    constructor() {
    }

    addOnClickPartial(button: AnyButtonInterface, partialInput: any): AnyButtonInterface {
        const copy = {...button};

        if (button && 'items' in copy) {
            const items = copy.items;
            copy.items = [];

            items.forEach(item => {


                copy.items.push(this.addOnClickPartial(item, partialInput));
            });

            return copy;
        }

        copy.onClick = copy.onClick && partial(copy.onClick, partialInput);

        return copy;
    }
}
