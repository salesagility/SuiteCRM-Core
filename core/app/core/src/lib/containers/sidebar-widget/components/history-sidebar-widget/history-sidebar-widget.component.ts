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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {HistoryTimelineAdapter} from './history-timeline.adapter.service';
import {BaseWidgetComponent} from '../../../widgets/base-widget.model';
import {LanguageStore} from '../../../../store/language/language.store';
import {HistoryTimelineAdapterFactory} from './history-timeline.adapter.factory';
import {Subscription, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';

@Component({
    selector: 'scrm-history-timeline-widget',
    templateUrl: './history-sidebar-widget.component.html',
    styleUrls: [],
    providers: [HistoryTimelineAdapter]
})
export class HistorySidebarWidgetComponent extends BaseWidgetComponent implements OnInit, OnDestroy {

    public adapter: HistoryTimelineAdapter;
    private subscription = new Subscription();

    constructor(
        protected historyTimelineAdapterFactory: HistoryTimelineAdapterFactory,
        protected languageStore: LanguageStore) {
        super();
    }

    ngOnInit(): void {

        // reload request will be ignored;
        // if they are notified multiple times within the dueTime/delay 500 ms

        const debouncedReload = this.config.reload$.pipe(debounce(() => timer(500)));

        this.subscription.add(debouncedReload.subscribe(reload => {
            if (reload) {
                this.adapter = this.historyTimelineAdapterFactory.create();
                this.adapter.init(this.context);
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getHeaderLabel(): string {
        return this.languageStore.getFieldLabel('LBL_QUICK_HISTORY');
    }

}
