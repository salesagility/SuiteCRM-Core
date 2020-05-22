import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LanguageFacade, LanguageListStringMap} from '@store/language/language.facade';
import {NavbarModule, Navigation, NavigationFacade} from '@store/navigation/navigation.facade';

@Component({
    selector: 'scrm-list-header',
    templateUrl: 'list-header.component.html'
})
export class ListHeaderComponent {

    @Input() module;
    appListStrings$: Observable<LanguageListStringMap> = this.language.appListStrings$;
    navigation$: Observable<Navigation> = this.navigation.vm$;
    displayResponsiveTable = false;

    vm$ = combineLatest([
        this.appListStrings$,
        this.navigation$
    ]).pipe(
        map((
            [
                appListStrings,
                navigation
            ]
        ) => {

            const moduleInfo = this.getModuleInfo(navigation, this.module);
            return {
                appListStrings,
                navigation,
                moduleInfo
            };
        })
    );

    constructor(protected language: LanguageFacade, protected navigation: NavigationFacade) {
    }

    getModuleInfo(navigation: Navigation, module: string): NavbarModule {
        if (!navigation || !navigation.modules) {
            return null;
        }
        return navigation.modules[module];
    }

    getModuleTitle(appListStrings: LanguageListStringMap, module: NavbarModule): string {
        if (!appListStrings || !appListStrings.moduleList || !module || !module.labelKey) {
            return '';
        }
        return appListStrings.moduleList[module.labelKey] || '';
    }
}
