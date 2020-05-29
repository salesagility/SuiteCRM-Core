import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';
import {AppStateStore} from '@store/app-state/app-state.store';

@Injectable({providedIn: 'root'})
export class ClassicViewResolver extends BaseModuleResolver {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected themeImagesStore: ThemeImagesStore,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper,
        protected appStateStore: AppStateStore,
        protected routeConverter: RouteConverter,
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

    resolve(route: ActivatedRouteSnapshot): any {

        return super.resolve(route).pipe(
            map(() => this.routeConverter.toLegacy(route.params, route.queryParams))
        );
    }
}
