import {Component, Input} from '@angular/core';
import {ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-button',
    templateUrl: 'button.component.html'
})
export class ButtonComponent {
    @Input() config: ButtonInterface;
}
