import {Injectable} from '@angular/core';
import {StateStore} from '@store/state';
import {AppState, AppStateStore} from '@store/app-state/app-state.store';
import {map, tap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {LanguageListStringMap, LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {NavbarModule, Navigation, NavigationStore} from '@store/navigation/navigation.store';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {Metadata, MetadataStore} from '@store/metadata/metadata.store.service';
import {SearchMeta} from '@app-common/metadata/list.metadata.model';


export interface AppData {
    appState: AppState;
    module: NavbarModule;
    language: LanguageStrings;
    navigation: Navigation;
}

@Injectable()
export class ViewStore implements StateStore {

    appState$: Observable<AppState>;
    module$: Observable<NavbarModule>;
    language$: Observable<LanguageStrings>;
    navigation$: Observable<Navigation>;
    appData$: Observable<AppData>;
    metadata$: Observable<Metadata>;

    appData: AppData;
    metadata: Metadata;

    constructor(
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected navigationStore: NavigationStore,
        protected moduleNavigation: ModuleNavigation,
        protected metadataStore: MetadataStore
    ) {
        this.appState$ = this.appStateStore.vm$;
        this.language$ = this.languageStore.vm$;
        this.navigation$ = this.navigationStore.vm$;
        this.module$ = combineLatest([this.appState$, this.navigationStore.vm$]).pipe(
            map(([appStateInfo, navigationInfo]) =>
                this.moduleNavigation.getModuleInfo(appStateInfo.module, navigationInfo))
        );

        this.appData$ = combineLatest([this.appState$, this.module$, this.language$, this.navigation$]).pipe(
            map(([appState, module, language, navigation]) => {
                this.appData = {appState, module, language, navigation} as AppData;
                return this.appData;
            })
        );

        this.metadata$ = metadataStore.metadata$.pipe(tap(metadata => {
            this.metadata = metadata;
        }));
    }

    clear(): void {
    }

    public clearAuthBased(): void {
        this.clear();
    }

    get appState(): AppState {
        if (!this.appData.appState) {
            return {};
        }
        return this.appData.appState;
    }

    get module(): NavbarModule {
        return this.appData.module;
    }

    get language(): LanguageStrings {
        if (!this.appData.language) {
            return {
                appStrings: {},
                appListStrings: {},
                modStrings: {},
                languageKey: ''
            };
        }
        return this.appData.language;
    }

    get appStrings(): LanguageStringMap {
        return this.language.appStrings;
    }

    get appListStrings(): LanguageListStringMap {
        return this.language.appListStrings;
    }

    get modStrings(): LanguageListStringMap {
        return this.language.modStrings;
    }

    get navigation(): Navigation {
        return this.appData.navigation;
    }

    get searchMeta(): SearchMeta {
        if (!this.metadata.search) {
            return {
                layout: {
                    basic: {},
                    advanced: {}
                }
            };
        }

        return this.metadata.search;
    }
}
