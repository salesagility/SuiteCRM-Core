import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {tap} from 'rxjs/operators';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {SystemConfigFacade} from '@base/store/system-config/system-config.facade';
import {LanguageFacade} from '@base/store/language/language.facade';
import {NavigationFacade} from '@base/store/navigation/navigation.facade';
import {UserPreferenceFacade} from '@base/store/user-preference/user-preference.facade';
import {ThemeImagesFacade} from '@base/store/theme-images/theme-images.facade';
import {AppStateFacade} from '@base/store/app-state/app-state.facade';

@Injectable({providedIn: 'root'})
export class BaseModuleResolver extends BaseMetadataResolver {

    constructor(
        protected systemConfigFacade: SystemConfigFacade,
        protected languageFacade: LanguageFacade,
        protected navigationFacade: NavigationFacade,
        protected userPreferenceFacade: UserPreferenceFacade,
        protected themeImagesFacade: ThemeImagesFacade,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper,
        protected appStateFacade: AppStateFacade,
    ) {
        super(
            systemConfigFacade,
            languageFacade,
            navigationFacade,
            userPreferenceFacade,
            themeImagesFacade,
            appStateFacade
        );
    }

    resolve(route: ActivatedRouteSnapshot): any {

        return super.resolve(route).pipe(
            tap(() => {
                if (route.params.module) {
                    const module = this.calculateActiveModule(route);

                    this.appStateFacade.setModule(module);
                }
                if (route.params.action) {
                    this.appStateFacade.setView(route.params.action);
                }
            })
        );
    }

    /**
     * Calculate the active module
     *
     * @param {{}} route active
     * @returns {string} active module
     */
    protected calculateActiveModule(route: ActivatedRouteSnapshot): string {

        let module = route.params.module;
        const parentModuleParam = this.getParentModuleMap()[module] || '';
        const parentModule = route.queryParams[parentModuleParam] || '';

        if (parentModule) {
            module = this.moduleNameMapper.toFrontend(parentModule);
        }
        return module;
    }

    /**
     * Get Parent Module Map
     *
     * @returns {{}} parent module map
     */
    protected getParentModuleMap(): { [key: string]: string } {
        return {
            'merge-records': 'return_module',
            import: 'import_module'
        };
    }
}
