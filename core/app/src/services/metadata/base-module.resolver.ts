import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {tap} from 'rxjs/operators';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {AppStateStore} from '@store/app-state/app-state.store';

@Injectable({providedIn: 'root'})
export class BaseModuleResolver extends BaseMetadataResolver {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
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
            appStateStore
        );
    }

    resolve(route: ActivatedRouteSnapshot): any {

        return super.resolve(route).pipe(
            tap(() => {
                if (route.params.module) {
                    const module = this.calculateActiveModule(route);

                    this.appStateStore.setModule(module);
                }
                if (route.params.action) {
                    this.appStateStore.setView(route.params.action);
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
