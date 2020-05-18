import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {NavigationFacade} from '@base/facades/navigation/navigation.facade';
import {UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {map} from 'rxjs/operators';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';

@Injectable({providedIn: 'root'})
export class ClassicViewResolver extends BaseMetadataResolver {

    constructor(
        protected systemConfigFacade: SystemConfigFacade,
        protected languageFacade: LanguageFacade,
        protected navigationFacade: NavigationFacade,
        protected userPreferenceFacade: UserPreferenceFacade,
        protected themeImagesFacade: ThemeImagesFacade,
        protected routeConverter: RouteConverter,
        protected appState: AppStateFacade
    ) {
        super(
            systemConfigFacade,
            languageFacade,
            navigationFacade,
            userPreferenceFacade,
            themeImagesFacade,
            appState
        );
    }

    resolve(route: ActivatedRouteSnapshot): any {

        return super.resolve(route).pipe(
            map(() => this.routeConverter.toLegacy(route.params, route.queryParams))
        );
    }
}
