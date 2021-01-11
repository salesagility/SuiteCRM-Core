import {Component, Input} from '@angular/core';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-button',
    templateUrl: 'button.component.html'
})
export class ButtonComponent {
    @Input() config: ButtonInterface;

    constructor(public language: LanguageStore) {
    }
}
