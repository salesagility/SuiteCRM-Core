import {Component, Input, OnInit} from '@angular/core';
import {Action} from '@app-common/actions/action.model';
import {AnyButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {LanguageStore} from '@store/language/language.store';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {ButtonGroupInterface} from '@components/button-group/button-group.model';
import {SubpanelTableAdapter} from '@containers/subpanel/adapters/table.adapter';
import {SubpanelStore} from '@containers/subpanel/store/subpanel/subpanel.store';
import {TableConfig} from '@components/table/table.model';
import {SubpanelActionManager} from '@containers/subpanel/components/subpanel/action-manager.service';
import {ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
    providers: [
        SubpanelTableAdapter
    ]
})
export class SubpanelComponent implements OnInit {
    @Input() store: SubpanelStore;
    @Input() maxColumns$: Observable<number>;

    closeButton: ButtonInterface;
    adapter: SubpanelTableAdapter;
    config$: Observable<ButtonGroupInterface>;
    tableConfig: TableConfig;

    constructor(
        protected actionManager: SubpanelActionManager,
        protected languages: LanguageStore,
    ) {
    }

    ngOnInit(): void {
        this.adapter = new SubpanelTableAdapter(this.store, this.languages);
        this.tableConfig = this.adapter.getTable();
        if (this.maxColumns$) {
            this.tableConfig.maxColumns$ = this.maxColumns$;
        }

        this.config$ = of(this.getButtonGroupConfig(this.buildAction())).pipe(shareReplay(1));

        this.closeButton = {
            onClick: (): void => {
                this.store.show = false;
            }
        } as ButtonInterface;
    }

    buildAction(): any {
        const actions = [];

        if (this.store.metadata) {
            if (this.store.metadata.top_buttons) {
                this.store.metadata.top_buttons.forEach(button => {
                    const label = this.languages.getFieldLabel(
                        button.labelKey,
                        button.module
                    );

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

        let breakpoint = 1;
        if (buttons && buttons.length > 1) {
            breakpoint = -1;
        }

        const dropdownLabel = this.languages.getAppString('LBL_ACTIONS');

        return {
            buttons,
            breakpoint,
            dropdownLabel,
            buttonKlass: ['btn', 'btn-sm', 'btn-outline-light']
        } as ButtonGroupInterface;
    }

    protected buildButton(action: Action): AnyButtonInterface {
        return {
            label: action.label || '',
            klass: 'btn btn-sm btn-outline-light',
            onClick: (): void => {
                this.actionManager.run(action.key, {
                    subpanelMeta: this.store.metadata,
                    parentModule: this.store.parentModule,
                    parentId: this.store.parentId,
                    action
                });
            }
        } as AnyButtonInterface;
    }
}
