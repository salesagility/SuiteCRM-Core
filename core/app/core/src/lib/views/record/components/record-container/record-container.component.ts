/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {combineLatestWith, Observable, Subscription} from 'rxjs';
import {map, filter} from 'rxjs/operators';
import {ViewContext} from '../../../../common/views/view.model';
import {WidgetMetadata} from '../../../../common/metadata/widget.metadata';
import {MetadataStore} from '../../../../store/metadata/metadata.store.service';
import {LanguageStore, LanguageStrings} from '../../../../store/language/language.store';
import {
    SubpanelContainerConfig
} from '../../../../containers/subpanel/components/subpanel-container/subpanel-container.model';
import {SidebarWidgetAdapter} from '../../adapters/sidebar-widget.adapter';
import {RecordViewStore} from '../../store/record-view/record-view.store';
import {RecordContentAdapter} from '../../adapters/record-content.adapter';
import {RecordContentDataSource} from '../../../../components/record-content/record-content.model';
import {TopWidgetAdapter} from '../../adapters/top-widget.adapter';
import {BottomWidgetAdapter} from '../../adapters/bottom-widget.adapter';
import {RecordActionsAdapter} from '../../adapters/actions.adapter';
import {Action, ActionContext} from '../../../../common/actions/action.model';
import {RecordViewSidebarWidgetService} from "../../services/record-view-sidebar-widget.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'scrm-record-container',
    templateUrl: 'record-container.component.html',
    providers: [RecordContentAdapter, TopWidgetAdapter, SidebarWidgetAdapter, BottomWidgetAdapter]
})
export class RecordContainerComponent implements OnInit, OnDestroy {

    protected subs: Subscription[] = [];

    saveAction: Action;
    context: ActionContext;
    loading: boolean = true;
    language$: Observable<LanguageStrings> = this.language.vm$;
    isOffsetExist: boolean = false;
    displayWidgets: boolean = true;
    swapWidgets: boolean = false;
    sidebarWidgetConfig: any;

    vm$ = this.language$.pipe(
        combineLatestWith(
            this.bottomWidgetAdapter.config$,
            this.topWidgetAdapter.config$,
            this.recordViewStore.showSubpanels$
        ),
        map((
            [
                language,
                bottomWidgetConfig,
                topWidgetConfig,
                showSubpanels
            ]
        ) => ({
            language,
            bottomWidgetConfig,
            topWidgetConfig,
            showSubpanels
        }))
    );

    actionConfig$ =  this.recordViewStore.mode$.pipe(
        combineLatestWith(
            this.actionsAdapter.getActions(),
            this.getViewContext$()),
        filter(([mode, actions, context]) => mode === 'edit'),
        map(([mode, actions, context]) => ({
            mode,
            actions,
            context
        }))
    );

    @HostListener('keyup.control.enter')
    onEnterKey() {
        if (!this.saveAction || !this.context) {
            return;
        }
        this.actionsAdapter.runAction(this.saveAction, this.context);
    }

    constructor(
        public recordViewStore: RecordViewStore,
        protected language: LanguageStore,
        protected metadata: MetadataStore,
        protected contentAdapter: RecordContentAdapter,
        protected topWidgetAdapter: TopWidgetAdapter,
        protected sidebarWidgetAdapter: SidebarWidgetAdapter,
        protected bottomWidgetAdapter: BottomWidgetAdapter,
        protected actionsAdapter: RecordActionsAdapter,
        protected sidebarWidgetHandler: RecordViewSidebarWidgetService,
        private activatedRoute: ActivatedRoute
    ) {
        const queryParams = this.activatedRoute.snapshot.queryParamMap;
        this.isOffsetExist = !!queryParams.get('offset');
    }

    ngOnInit(): void {
        this.subs.push(this.recordViewStore.loading$.subscribe(loading => {
            this.loading = loading;
        }));

        this.subs.push(this.actionConfig$.subscribe(config => {
                this.context = config.context;
                config.actions.forEach(actionItem => {
                    if (actionItem.key === 'save') {
                        this.saveAction = actionItem;
                    }
                });
            })
        );

        this.subs.push(this.sidebarWidgetAdapter.config$.subscribe(sidebarWidgetConfig => {
            this.sidebarWidgetConfig = sidebarWidgetConfig;
            this.displayWidgets = this.sidebarWidgetConfig.show && this.sidebarWidgetConfig.widgets;
        }));

        this.subs.push(this.sidebarWidgetHandler.widgetSwap$.subscribe(swap => {
            this.swapWidgets = swap;
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
        this.contentAdapter.clean();
    }

    getContentAdapter(): RecordContentDataSource {
        return this.contentAdapter;
    }

    getSubpanelsConfig(): SubpanelContainerConfig {
        return {
            parentModule: this.recordViewStore.getModuleName(),
            subpanels$: this.recordViewStore.subpanels$,
            sidebarActive$: this.recordViewStore.widgets$
        } as SubpanelContainerConfig;
    }

    getViewContext(): ViewContext {
        return this.recordViewStore.getViewContext();
    }

    getViewContext$(): Observable<ViewContext> {
        return this.recordViewStore.viewContext$;
    }

    hasTopWidgetMetadata(meta: WidgetMetadata): boolean {
        return !!(meta && meta.type);
    }
}
