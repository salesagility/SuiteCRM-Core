import {Component, Input, OnInit} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {Record} from '@app-common/record/record.model';
import {LineAction} from '@app-common/actions/line-action.model';

@Component({
    selector: 'scrm-line-action-menu',
    templateUrl: 'line-action-menu.component.html'
})

export class LineActionMenuComponent implements OnInit {

    @Input() lineActions: LineAction[];
    @Input() record: Record;

    items: LineAction[];

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        this.setLineActions();
    }

    setLineActions(): void {
        const actions = [];
        this.lineActions.forEach(action => {
            const recordAction = {...action};

            const params: { [key: string]: any } = {};
            /* eslint-disable camelcase,@typescript-eslint/camelcase*/
            params.return_module = action.legacyModuleName;
            params.return_action = action.returnAction;
            params.return_id = this.record.id;
            /* eslint-enable camelcase,@typescript-eslint/camelcase */
            params[action.mapping.moduleName] = action.legacyModuleName;

            params[action.mapping.name] = this.record.attributes.name;
            params[action.mapping.id] = this.record.id;

            recordAction.label = this.languageStore.getAppString(recordAction.labelKey);
            recordAction.link = {
                label: recordAction.label,
                url: null,
                route: '/' + action.module + '/' + action.action,
                params
            };

            actions.push(recordAction);
        });
        this.items = actions.reverse();
    }
}
