import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NavbarUiModule} from '@components/navbar/navbar.module';
import {FooterUiModule} from '@components/footer/footer.module';
import {ClassicViewUiModule} from '@components/classic-view/classic-view.module';
import {MessageUiModule} from '@components/message/message.module';
import {FilterUiModule} from '@components/filter/filter.module';
import {ColumnchooserUiModule} from '@components/columnchooser/columnchooser.module';
import {WidgetUiModule} from '@components/widget/widget.module';
import {TableUiModule} from '@components/table/table.module';
import {ModuletitleUiModule} from '@components/module-title/module-title.module';
import {ListheaderUiModule} from '@components/list-header/list-header.module';
import {ListcontainerUiModule} from '@components/list-container/list-container.module';
import {ListModule} from '@views/list/list.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ErrorInterceptor} from '@services/auth/error.interceptor';

import {AppManagerModule} from '../app-manager/app-manager.module';

import {environment} from '../environments/environment';
import {FetchPolicy} from 'apollo-client/core/watchQueryOptions';
import {FullPageSpinnerComponent} from '@components/full-page-spinner/full-page-spinner.component';
import {RouteReuseStrategy} from '@angular/router';
import {AppRouteReuseStrategy} from './app-router-reuse-strategy';
import {ImageModule} from '@components/image/image.module';
import {AuthService} from '@services/auth/auth.service';
import {GraphQLError} from 'graphql';

import {BnNgIdleService} from 'bn-ng-idle';

@NgModule({
    declarations: [
        AppComponent,
        FullPageSpinnerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        AppManagerModule,
        AppRoutingModule,
        FooterUiModule,
        NavbarUiModule,
        MessageUiModule,
        ClassicViewUiModule,
        FilterUiModule,
        ListModule,
        WidgetUiModule,
        TableUiModule,
        ModuletitleUiModule,
        ListheaderUiModule,
        ListcontainerUiModule,
        ColumnchooserUiModule,
        ImageModule,
        BrowserAnimationsModule,
        NgbModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
        BnNgIdleService
    ],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule {
    constructor(apollo: Apollo, httpLink: HttpLink, protected auth: AuthService) {

        const uri = environment.graphqlApiUrl;
        const cache = new InMemoryCache();

        const defaultOptions = {
            watchQuery: {
                fetchPolicy: 'no-cache' as FetchPolicy
            },
            query: {
                fetchPolicy: 'no-cache' as FetchPolicy
            },
        };

        const http = httpLink.create({
            uri,
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
            link: logoutLink.concat(http),
            defaultOptions,
            cache
        });
    }
}
