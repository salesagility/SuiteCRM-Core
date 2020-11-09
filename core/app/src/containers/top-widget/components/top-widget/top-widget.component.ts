import {Component, Input, OnInit} from '@angular/core';
import {componentTypeMap} from '@containers/top-widget/components/top-widget/top-widget.manifest';
import {BaseWidgetComponent} from '@app-common/containers/widgets/base-widget.model';

@Component({
    selector: 'scrm-top-widget',
    templateUrl: './top-widget.component.html',
    styles: []
})
export class TopWidgetComponent extends BaseWidgetComponent implements OnInit {

    @Input('type') type: string;

    map = componentTypeMap;

    get componentType(): any {
        return this.map[this.type];
    }

    ngOnInit(): void {
    }

}
