import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NavbarUiModule} from '../components/navbar/navbar.module';
import {FooterUiModule} from '../components/footer/footer.module';
import {ClassicViewUiModule} from '../components/classic-view/classic-view.module';
import {MessageUiModule} from '../components/message/message.module';
import {FilterUiModule} from '../components/filter/filter.module';
import {ColumnchooserUiModule} from '../components/columnchooser/columnchooser.module';
import {ListModule} from '../../views/list/list.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {
  AppManagerModule
} from '../app-manager/app-manager.module';

import {environment} from '../environments/environment';
import { FetchPolicy } from 'apollo-client/core/watchQueryOptions';



@NgModule({
  declarations: [
    AppComponent
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
    ColumnchooserUiModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
  constructor(apollo: Apollo,
              httpLink: HttpLink) {

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

    apollo.create({
      link: httpLink.create({uri}),
      defaultOptions,
      cache
    });
  }
}
