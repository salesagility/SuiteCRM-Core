import {Injectable} from '@angular/core';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {LanguageStore} from '@store/language/language.store';
import {Action, ActionDataSource, ModeActions} from '@app-common/actions/action.model';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RecordActionManager} from '@views/record/actions/record-action-manager.service';
import {RecordActionData} from '@views/record/actions/record.action';

@Injectable()
export class RecordActionsAdapter implements ActionDataSource {

    defaultActions: ModeActions = {
        detail: [
            {
                key: 'create',
                labelKey: 'LBL_NEW',
                params: {},
                acl: []
            },
            {
                key: 'edit',
                labelKey: 'LBL_EDIT',
                params: {},
                acl: []
            },
            {
                key: 'toggle-widgets',
                labelKey: 'LBL_WIDGETS',
                params: {},
                acl: []
            },
        ],
        edit: [
            {
                key: 'save',
                labelKey: 'LBL_SAVE_BUTTON_LABEL',
                params: {},
                acl: []
            },
            {
                key: 'cancel',
                labelKey: 'LBL_CANCEL',
                params: {},
                acl: []
            },
            {
                key: 'toggle-widgets',
                labelKey: 'LBL_WIDGETS',
                params: {},
                acl: []
            },
        ],
    };

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore,
        protected actionManager: RecordActionManager
    ) {
    }

    getActions(): Observable<Action[]> {
        return combineLatest(
            [
                this.metadata.recordViewMetadata$,
                this.store.mode$,
                this.store.record$,
                this.language.vm$,
                this.store.widgets$
            ]
        ).pipe(
            map((
                [
                    meta,
                    mode,
                    record,
                    languages
                ]
            ) => {
                if (!mode || !meta) {
                    return [];
                }
                const availableActions = this.defaultActions;

                const actions = [];

                availableActions[mode].forEach(action => {

                    const actionHandler = this.actionManager.getHandler(action.key, mode);

                    if (!actionHandler || !actionHandler.shouldDisplay(this.store)) {
                        return;
                    }

                    const label = this.language.getFieldLabel(action.labelKey, record.module, languages);
                    actions.push({
                        ...action,
                        label
                    });
                });

                return actions;
            })
        );
    }

    runAction(action: string): void {

        const data: RecordActionData = {
            store: this.store
        };

        this.actionManager.run(action, this.store.getMode(), data);
    }
}
