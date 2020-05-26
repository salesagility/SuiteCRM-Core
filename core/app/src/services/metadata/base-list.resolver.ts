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
import {ListViewMetaStore} from '@store/metadata/list-view-meta.store';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';
import {forkJoin, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class BaseListResolver extends BaseModuleResolver {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected listViewMetaStore: ListViewMetaStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected themeImagesStore: ThemeImagesStore,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper,
        protected appStateStore: AppStateStore,
    ) {
        super(
            systemConfigStore,
            languageStore,
            navigationStore,
            userPreferenceStore,
            themeImagesStore,
            moduleNameMapper,
            actionNameMapper,
            appStateStore
        );
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return forkJoin({
            base: super.resolve(route),
            metadata: this.listViewMetaStore.load(route.params.module)
        });
    }
}
