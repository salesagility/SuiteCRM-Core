import {Injectable} from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import {SystemConfigFacade} from '@services/metadata/configs/system-config.facade';
import {LanguageFacade} from '@base/facades/language.facade';
import {flatMap} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class BaseMetadataResolver implements Resolve<any> {

    constructor(private systemConfigFacade: SystemConfigFacade, private languageFacade: LanguageFacade) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.systemConfigFacade.load().pipe(
            flatMap(configs => this.languageFacade.loadAppStrings(configs['default_language'].value))
        );
    }
}
