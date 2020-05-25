import {Component, Input} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LanguageFacade, LanguageStrings} from '@store/language/language.facade';
import {ModuleAction, Navigation, NavigationFacade} from '@store/navigation/navigation.facade';
import {Button} from '@components/button/button.model';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';

@Component({
    selector: 'scrm-action-menu',
    templateUrl: 'action-menu.component.html',
})
export class ActionMenuComponent {

    @Input() module;
    language$: Observable<LanguageStrings> = this.language.vm$;
    navigation$: Observable<Navigation> = this.navigation.vm$;

    vm$ = combineLatest([this.language$, this.navigation$]).pipe(
        map(([language, navigation]) => {

            const moduleInfo = this.actionHandler.getModuleInfo(this.module, navigation);
            return {
                language,
                navigation,
                moduleInfo
            };
        })
    );

    constructor(
        protected language: LanguageFacade,
        protected navigation: NavigationFacade,
        protected actionHandler: ModuleNavigation
    ) {
    }

    public getButtonConfig(action: ModuleAction, language: LanguageStrings): Button {

        return {
            class: 'action-button',
            label: this.actionHandler.getActionLabel(this.module, action, language),
            onClick: (): void => {
                this.actionHandler.navigate(action).then();
            }
        };
    }
}
