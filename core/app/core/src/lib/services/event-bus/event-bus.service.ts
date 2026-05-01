/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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
import {Observable, Subject} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {EventMessage} from './event-bus.model';

interface EventResponse {
    messageId: string;
    payload: any;
}

@Injectable({
    providedIn: 'root'
})
export class EventBus {

    protected events$ = new Subject<EventMessage>();
    protected responses$ = new Subject<EventResponse>();
    protected idCounter = 0;

    emit<T = any>(type: string, payload?: T): void {
        this.events$.next({type, payload});
    }

    request<T = any, R = any>(type: string, payload?: T): Observable<R> {
        const messageId = this.generateId();
        this.events$.next({type, payload, messageId});
        return this.responses$.pipe(
            filter(r => r.messageId === messageId),
            take(1),
            map(r => r.payload)
        );
    }

    on<T = any>(type: string): Observable<EventMessage<T>> {
        return this.events$.pipe(
            filter(e => e.type === type)
        );
    }

    respond(messageId: string, payload: any): void {
        this.responses$.next({messageId, payload});
    }

    protected generateId(): string {
        return `evt-${++this.idCounter}-${Date.now()}`;
    }
}
