import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {SystemConfigFacade} from '@base/store/system-config/system-config.facade';
import {LanguageFacade} from '@base/store/language/language.facade';
import {NavigationFacade} from '@base/store/navigation/navigation.facade';
import {UserPreferenceFacade} from '@base/store/user-preference/user-preference.facade';
import {ThemeImagesFacade} from '@base/store/theme-images/theme-images.facade';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';
import {AppStateFacade} from '@base/store/app-state/app-state.facade';

@Injectable({providedIn: 'root'})
export class ClassicViewResolver extends BaseModuleResolver {

    constructor(
        protected systemConfigFacade: SystemConfigFacade,
        protected languageFacade: LanguageFacade,
        protected navigationFacade: NavigationFacade,
        protected userPreferenceFacade: UserPreferenceFacade,
        protected themeImagesFacade: ThemeImagesFacade,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper,
        protected appStateFacade: AppStateFacade,
        protected routeConverter: RouteConverter,
    ) {
        super(
            systemConfigFacade,
            languageFacade,
            navigationFacade,
            userPreferenceFacade,
            themeImagesFacade,
            moduleNameMapper,
            actionNameMapper,
            appStateFacade
        );
    }

    resolve(route: ActivatedRouteSnapshot): any {

        return super.resolve(route).pipe(
            map(() => this.routeConverter.toLegacy(route.params, route.queryParams))
        );
    }
}
