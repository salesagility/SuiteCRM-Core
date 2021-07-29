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

import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import {onError} from '@apollo/link-error';
import {FetchPolicy} from '@apollo/client/core/watchQueryOptions';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {
    AuthService,
    ClassicViewUiModule,
    ColumnChooserModule,
    CreateRecordModule,
    ErrorInterceptor,
    FilterUiModule,
    FooterUiModule,
    FullPageSpinnerModule,
    ImageModule,
    InstallViewModule,
    ListContainerModule,
    ListHeaderModule,
    ListModule,
    MessageModalModule,
    MessageUiModule,
    ModuleTitleModule,
    NavbarUiModule,
    RecordListModalModule,
    RecordModule,
    TableModule,
} from 'core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {environment} from '../environments/environment';
import {RouteReuseStrategy} from '@angular/router';
import {AppRouteReuseStrategy} from './app-router-reuse-strategy';
import {BnNgIdleService} from 'bn-ng-idle';
import {AppInit} from '@app/app-initializer';
import {GraphQLError} from 'graphql';
import {AngularSvgIconModule} from 'angular-svg-icon';

export const initializeApp = (appInitService: AppInit) => (): Promise<any> => appInitService.init();

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FooterUiModule,
        NavbarUiModule,
        MessageUiModule,
        ClassicViewUiModule,
        FilterUiModule,
        ListModule,
        RecordModule,
        CreateRecordModule,
        InstallViewModule,
        TableModule,
        ModuleTitleModule,
        ListHeaderModule,
        ListContainerModule,
        ColumnChooserModule,
        AngularSvgIconModule.forRoot(),
        ImageModule,
        BrowserAnimationsModule,
        NgbModule,
        FullPageSpinnerModule,
        MessageModalModule,
        RecordListModalModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
        BnNgIdleService,
        AppInit,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            multi: true,
            deps: [AppInit]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(apollo: Apollo, httpLink: HttpLink, protected auth: AuthService) {

        const defaultOptions = {
            watchQuery: {
                fetchPolicy: 'no-cache' as FetchPolicy
            },
            query: {
                fetchPolicy: 'no-cache' as FetchPolicy
            },
        };

        const http = httpLink.create({
            uri: environment.graphqlApiUrl,
            withCredentials: true
        });

        const logoutLink = onError((err) => {
            if (err.graphQLErrors && err.graphQLErrors.length > 0) {
                err.graphQLErrors.forEach((value: GraphQLError) => {
                    if (this.auth.isUserLoggedIn.value === true && value.message.includes('Access Denied')) {
                        auth.logout('LBL_SESSION_EXPIRED');
                    }
                });
            }
        });

        apollo.create({
            defaultOptions,
            link: logoutLink.concat(http),
            cache: new InMemoryCache()
        });
    }
}
