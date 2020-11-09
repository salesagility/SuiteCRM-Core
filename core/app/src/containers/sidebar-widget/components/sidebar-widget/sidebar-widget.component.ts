import {Component, Input} from '@angular/core';
import {componentTypeMap} from './sidebar-widget.manifest';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';

@Component({
    selector: 'scrm-sidebar-widget',
    templateUrl: './sidebar-widget.component.html',
    styles: []
})
export class SidebarWidgetComponent extends BaseWidgetComponent {

    @Input('type') type: string;

    map = componentTypeMap;

    get componentType(): any {
        return this.map[this.type];
    }
}
