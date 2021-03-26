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
import {ActivatedRouteSnapshot} from '@angular/router';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {SystemConfigStore} from '@base/store/system-config/system-config.store';
import {LanguageStore} from '@base/store/language/language.store';
import {NavigationStore} from '@base/store/navigation/navigation.store';
import {UserPreferenceStore} from '@base/store/user-preference/user-preference.store';
import {ThemeImagesStore} from '@base/store/theme-images/theme-images.store';
import {AppStateStore} from '@base/store/app-state/app-state.store';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';
import {forkJoin, Observable} from 'rxjs';
import {MessageService} from '@services/message/message.service';

@Injectable({providedIn: 'root'})
export class BaseRecordResolver extends BaseModuleResolver {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected metadataStore: MetadataStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected themeImagesStore: ThemeImagesStore,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper,
        protected appStateStore: AppStateStore,
        protected messageService: MessageService
    ) {
        super(
            systemConfigStore,
            languageStore,
            navigationStore,
            userPreferenceStore,
            themeImagesStore,
            moduleNameMapper,
            appStateStore,
            metadataStore,
            messageService
        );
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let routeModule = route.params.module;

        if (!routeModule) {
            routeModule = route.data.module;
        }

        return forkJoin({
            base: super.resolve(route),
            metadata: this.metadataStore.load(routeModule, this.metadataStore.getMetadataTypes()),
        });
    }
}
