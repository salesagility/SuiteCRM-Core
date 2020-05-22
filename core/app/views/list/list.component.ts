import {Component} from '@angular/core';
import {AppState, AppStateFacade} from '@store/app-state/app-state.facade';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'scrm-list',
    templateUrl: './list.component.html',
    styleUrls: []
})
export class ListComponent {
    appState$: Observable<AppState> = this.appState.vm$;

    vm$ = combineLatest([this.appState$]).pipe(
        map(([appState]) => ({
            appState,
        }))
    );

    constructor(protected appState: AppStateFacade) {
    }
}
