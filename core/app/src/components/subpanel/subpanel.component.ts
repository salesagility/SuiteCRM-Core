import {Component, Input, OnInit} from '@angular/core';
import {Action} from '@app-common/actions/action.model';
import {AnyButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {LanguageStore} from '@store/language/language.store';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {ButtonGroupInterface} from '../button-group/button-group.model';
import {SubPanelActionManager} from './actions-mananger.service';
import {SubpanelTableAdapter} from '@components/subpanel/adapter/table.adapter';
import {SubpanelStore} from '@store/supanel/subpanel.store';
import {RecordViewStore} from '@store/record-view/record-view.store';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
    providers: [
        SubpanelTableAdapter
    ]
})
export class SubpanelComponent implements OnInit {
    @Input() store: SubpanelStore;
    @Input() recordStore: RecordViewStore;

    adapter: SubpanelTableAdapter;
    config$: Observable<ButtonGroupInterface>;

    constructor(
        protected actionManager: SubPanelActionManager,
        protected languages: LanguageStore,
    ) {
    }

    ngOnInit(): void {
        this.adapter = new SubpanelTableAdapter(this.store, this.languages);
        this.config$ = of(this.getButtonGroupConfig(this.buildAction())).pipe(shareReplay(1));
    }

    buildAction(): any {
        const actions = [];

        if (this.store.metadata) {
            if (this.store.metadata.top_buttons) {
                this.store.metadata.top_buttons.forEach(button => {
                    const label = this.languages.getAppString(button.labelKey);

                    actions.push({
                        ...button,
                        label
                    });
                });
            }
        }

        return actions;
    }

    getButtonGroupConfig(actions: Action[]): ButtonGroupInterface {
        const buttons = [];

        actions.forEach((action: Action) => {
            buttons.push(this.buildButton(action));
        });

        return {
            buttons
        } as ButtonGroupInterface;
    }

    protected buildButton(action: Action): AnyButtonInterface {
        return {
            label: action.label || '',
            klass: 'btn btn-sm btn-outline-light',
            onClick: (): void => {
                this.actionManager.run(action.key, {
                    subpanelMeta: this.store.metadata,
                    store: this.recordStore
                });
            }
        } as AnyButtonInterface;
    }
}
