import {Input} from '@angular/core';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {ViewContext} from '@app-common/views/view.model';

export class BaseWidgetComponent {
    @Input('config') config: WidgetMetadata;
    @Input('context') context: ViewContext;
}
