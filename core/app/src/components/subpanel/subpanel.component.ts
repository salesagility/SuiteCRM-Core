import {
    Component,
    Input, OnInit
} from '@angular/core';
import {
    Action
} from '@app-common/actions/action.model';
import { RecordViewStore } from '@base/store/record-view/record-view.store';
import { AnyButtonInterface } from '@components/dropdown-button/dropdown-button.model';
import { LanguageStore, LanguageStrings } from '@store/language/language.store';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ButtonGroupInterface } from '../button-group/button-group.model';
import { SubPanelActionManager } from './actions-mananger.service';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html'
})
export class SubpanelComponent implements OnInit {
    @Input() title: string;
    @Input() metadata: any;

    languages$: Observable<LanguageStrings> = this.languages.vm$;

    config$:  Observable<ButtonGroupInterface>;

    constructor(
        protected actionManager: SubPanelActionManager,
        protected languages: LanguageStore,
        protected store: RecordViewStore
    ) {
    }

    ngOnInit(): void {
        this.config$ = of(this.getButtonGroupConfig(this.buildAction())).pipe(shareReplay(1));
    }

    buildAction(): any {
        const actions = [];

        if (this.metadata) {
            if (this.metadata.top_buttons) {
                this.metadata.top_buttons.forEach(button => {
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
        const button = {
            label: action.label || '',
            klass: 'btn btn-sm btn-outline-light',
            onClick: (): void => {
                this.actionManager.run(action.key, {
                    subpanelMeta: this.metadata,
                    store: this.store
                });
            }
        } as AnyButtonInterface;

        return button;
    }
}
