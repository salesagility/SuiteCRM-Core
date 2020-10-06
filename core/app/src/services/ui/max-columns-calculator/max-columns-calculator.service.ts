import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {SystemConfigStore} from '@store/system-config/system-config.store';

@Injectable()
export class MaxColumnsCalculator {

    screen: ScreenSize = ScreenSize.Medium;
    maxColumns = 5;

    constructor(
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore
    ) {
    }

    getMaxColumns(sidebarActive$: Observable<boolean>): Observable<number> {
        return combineLatest([sidebarActive$, this.screenSize.screenSize$]).pipe(
            map(([sidebarActive, screenSize]) => {

                if (screenSize) {
                    this.screen = screenSize;
                }

                return this.calculateMaxColumns(sidebarActive);
            }),
            distinctUntilChanged()
        );
    }

    calculateMaxColumns(sideBar = true): number {
        let sizeMap;
        sizeMap = this.systemConfigStore.getConfigValue('listview_column_limits');

        if (sideBar) {
            sizeMap = sizeMap.with_sidebar;
        } else {
            sizeMap = sizeMap.without_sidebar;
        }

        if (this.screen && sizeMap) {
            const maxCols = sizeMap[this.screen];
            if (maxCols) {
                this.maxColumns = maxCols;
            }
        }

        return this.maxColumns;
    }
}
