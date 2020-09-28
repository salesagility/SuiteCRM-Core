import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore} from '@store/language/language.store';
import {NavigationStore} from '@store/navigation/navigation.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {AppStateStore} from '@store/app-state/app-state.store';
import {forkJoin} from 'rxjs';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {MessageService} from '@services/message/message.service';
import {tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class BaseModuleResolver extends BaseMetadataResolver {

    constructor(
        protected systemConfigStore: SystemConfigStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected themeImagesStore: ThemeImagesStore,
        protected moduleNameMapper: ModuleNameMapper,
        protected appStateStore: AppStateStore,
        protected metadataStore: MetadataStore,
        protected messageService: MessageService,
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
        let routeModule = route.params.module;

        if (!routeModule) {
            routeModule = route.data.module;
        }

        return forkJoin({
            base: super.resolve(route),
            metadata: this.metadataStore.load(routeModule, this.metadataStore.getMetadataTypes()),
        }).pipe(
            tap(
                () => {
                    if (routeModule) {
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
