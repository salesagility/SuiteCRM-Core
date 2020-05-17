import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';

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
