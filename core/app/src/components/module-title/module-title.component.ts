import {Component, Input} from '@angular/core';

@Component({
    selector: 'scrm-module-title',
    templateUrl: 'module-title.component.html'
})
export class ModuleTitleComponent {
    @Input() title = '';
}
