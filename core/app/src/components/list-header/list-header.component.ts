import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LanguageFacade, LanguageListStringMap} from '@store/language/language.facade';
import {NavbarModule, Navigation, NavigationFacade} from '@store/navigation/navigation.facade';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

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

            const moduleInfo = this.moduleNavigation.getModuleInfo(this.module, navigation);
            return {
                appListStrings,
                navigation,
                moduleInfo
            };
        })
    );

    constructor(
        protected language: LanguageFacade,
        protected navigation: NavigationFacade,
        protected moduleNavigation: ModuleNavigation
    ) {
    }

    getModuleTitle(appListStrings: LanguageListStringMap, module: NavbarModule): string {
        return this.moduleNavigation.getModuleLabel(module, appListStrings);
    }

}
