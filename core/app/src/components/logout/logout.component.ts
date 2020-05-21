import {Component} from '@angular/core';
import {AuthService} from '@services/auth/auth.service';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LanguageFacade, LanguageStrings} from '@store/language/language.facade';
import {LogoutModel} from "@components/logout/logout-model";

@Component({
    selector: 'scrm-logout-ui',
    templateUrl: './logout.component.html',
    styleUrls: []
})
export class LogoutUiComponent {

    logout: LogoutModel = {
        logoutAction: {
            label: 'LBL_LOGOUT'
        }
    }

    languages$: Observable<LanguageStrings> = this.languageFacade.vm$;

    vm$ = combineLatest([
        this.languages$,
    ]).pipe(
        map(([languages]) => (
            {
                appStrings: languages.appStrings || {},
                appListStrings: languages.appListStrings || {}
            })
        )
    );

    constructor(
        protected auth: AuthService,
        protected languageFacade: LanguageFacade
    ) {
    }

    /**
     * call logout
     */
    doLogout(): void {
        this.auth.logout();
    }
}
