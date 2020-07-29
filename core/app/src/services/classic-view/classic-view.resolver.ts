import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {RouteConverter} from '@services/navigation/route-converter/route-converter.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {AppStateStore} from '@store/app-state/app-state.store';
import {MessageService} from '@services/message/message.service';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';

@Injectable({providedIn: 'root'})
export class ClassicViewResolver extends BaseMetadataResolver {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected themeImagesStore: ThemeImagesStore,
        protected moduleNameMapper: ModuleNameMapper,
        protected routeConverter: RouteConverter,
        protected messageService: MessageService,
        protected appStateStore: AppStateStore,
    ) {
        super(
            systemConfigStore,
            languageStore,
            navigationStore,
            userPreferenceStore,
            themeImagesStore,
            appStateStore,
            moduleNameMapper,
            messageService
        );
    }

    resolve(route: ActivatedRouteSnapshot): any {

        return super.resolve(route).pipe(
            map(() => this.routeConverter.toLegacy(route.params, route.queryParams)),
            tap(
                () => {
                    if (route.params.module) {
                        const module = this.calculateActiveModule(route);

                        this.appStateStore.setModule(module);
                    }
                    if (route.params.action) {
                        this.appStateStore.setView(route.params.action);
                    }
                },
                () => {
                    this.addMetadataLoadErrorMessage();
                }),
        );
    }
}
