import {BaseFieldComponent} from '@fields/base/base-field.component';
import {isTrue} from '@app-common/utils/value-utils';

export class BaseBooleanComponent extends BaseFieldComponent {

    get checked(): boolean {
        return isTrue(this.field.value);
    }

    toggle(): void {
        let newValue = 'true';

        if (this.checked) {
            newValue = 'false';
        }

        this.field.value = newValue;
    }
}
