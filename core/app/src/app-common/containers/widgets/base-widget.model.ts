import { Input, Directive } from '@angular/core';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {ViewContext} from '@app-common/views/view.model';
import {Observable} from 'rxjs';

@Directive()
export class BaseWidgetComponent {
    @Input('config') config: WidgetMetadata;
    @Input('context') context: ViewContext;
    @Input('context$') context$: Observable<ViewContext>;
}
