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

import {Injectable} from '@angular/core';
import {CollectionViewer, DataSource, ListRange} from '@angular/cdk/collections';
import {HistoryTimelineEntry} from './history-sidebar-widget.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HistoryTimelineStore} from '../../store/history-timeline/history-timeline.store';
import {ViewContext, Record, emptyObject} from 'common';
import {startWith, switchMap, take} from 'rxjs/operators';
import {HistoryTimelineStoreFactory} from './history-timeline.store.factory';

export type ActivityTypes = 'calls' | 'tasks' | 'meetings' | 'history' | 'audit' | 'notes' | string;

@Injectable()
export class HistoryTimelineAdapter extends DataSource<HistoryTimelineEntry> {

    private defaultPageSize = 10;

    private cache: HistoryTimelineEntry[] = [];
    private dataStream = new BehaviorSubject<HistoryTimelineEntry[]>(this.cache);
    private dataStream$ = this.dataStream.asObservable();

    private store: HistoryTimelineStore;
    private context: ViewContext;

    constructor(protected historyTimelineStoreFactory: HistoryTimelineStoreFactory
    ) {
        super();
    }

    /**
     * @returns {void}
     * @param {ViewContext} context - parent module context
     * @description adapter init function to initialize the timeline objects
     */
    init(context: ViewContext): void {
        this.store = this.historyTimelineStoreFactory.create();
        this.context = context;
    }

    /**
     * @returns {HistoryTimelineEntry[]} Array of Objects to be parsed by the rendering component
     * @param {CollectionViewer} collectionViewer object
     * @description The angular cdk components built-in API which listens to the viewChange event
     * this function provides the range for the recordset to be loaded; calculated dynamically
     * by the cdk-virtual scroll component based on the container scroll event by the user
     */
    connect(collectionViewer: CollectionViewer): Observable<HistoryTimelineEntry[]> {

        return collectionViewer.viewChange.pipe(
            startWith({start: 0, end: this.defaultPageSize}),
            switchMap(viewChange => this.fetchPage(viewChange))
        );

    }

    /**
     * @returns {void}
     * @description the cleanup function on cdk-component unload
     */
    disconnect(): void {
        this.cache.length = 0;
    }

    /**
     * @returns {void}
     * @param {ListRange} range object contains the start & end integer values
     * @description calculates the offsets/limit of the new recordset, which don't exist
     * in local cache object to be fetched from the database
     */
    fetchPage(range: ListRange): Observable<HistoryTimelineEntry[]> {

        const cacheLength = this.cache.length;

        // limit is always defaultPageSize for performance reason
        const limit = this.defaultPageSize;

        // calculate offset
        let offset = 0;

        if (cacheLength <= 0) {
            offset = 0;
        } else if (cacheLength < range.end) {
            offset = cacheLength;
        } else {
            return this.dataStream$;
        }

        return this.retrieveRecords(offset, limit);
    }

    /**
     * @returns {void}
     * @param {number} offset record pointer
     * @param {number} limit  record size
     * @description retrieve the records based on the calculated offsets/limit by the caller function
     */
    retrieveRecords(offset: number, limit: number): Observable<HistoryTimelineEntry[]> {

        this.store.init(this.context.module, this.context.id, offset, limit);

        this.store.load(false).pipe(take(1)).subscribe(value => {

            const records: Record [] = value.records;

            if (!emptyObject(records)) {

                Object.keys(records).forEach(key => {

                    const timelineModule = records[key].module;

                    let moduleIcon = records[key].attributes.module_name;
                    if (timelineModule === 'audit') {
                        moduleIcon = 'History';
                    }

                    const gridColor = this.getActivityGridColor(records[key].module);

                    const timelineEntry = {
                        module: timelineModule,
                        icon: moduleIcon,
                        color: gridColor,
                        title: {
                            type: 'varchar',
                            value: records[key].attributes.name
                        },
                        user: {
                            type: 'varchar',
                            value: records[key].attributes.assigned_user_name.user_name,
                        },
                        date: {
                            type: 'datetime',
                            value: records[key].attributes.date_end,
                        },
                        record: records[key]
                    } as HistoryTimelineEntry;

                    if (timelineModule === 'audit') {

                        timelineEntry.description = {
                            type: 'html',
                            value: records[key].attributes.description
                        };
                    }
                    this.cache.push(timelineEntry);
                });
                this.dataStream.next(this.cache);
            }
        });
        return this.dataStream$;
    }

    /**
     * @returns {string} color code
     * @param {string} activity the valid activity types
     * @description {returns the mapped color code defined for an activity}
     */
    getActivityGridColor(activity: ActivityTypes): string {
        const colorMap = {
            calls: 'yellow',
            tasks: 'green',
            meetings: 'blue',
            notes: 'orange',
            audit: 'purple',
            history: 'purple'
        };
        return colorMap[activity] || 'yellow';
    }

}
