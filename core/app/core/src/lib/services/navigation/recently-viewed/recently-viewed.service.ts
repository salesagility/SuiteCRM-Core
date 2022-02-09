import {Injectable} from '@angular/core';
import {MetadataStore} from '../../../store/metadata/metadata.store.service';
import {deepClone, RecentlyViewed, ViewMode} from 'common';
import {ProcessService} from '../../process/process.service';
import {take} from 'rxjs/operators';
import {ActivatedRouteSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})
export class RecentlyViewedService {

    constructor(
        protected metadata: MetadataStore,
        protected processService: ProcessService
    ) {
    }

    /**
     * Public Api
     */

    /**
     * On navigation add
     * @param module
     * @param route
     */
    public onNavigationAdd(module: string, route: ActivatedRouteSnapshot) {

        let mode = 'detail' as ViewMode;
        const data = (route && route.data) || {};

        if (data.mode) {
            mode = data.mode;
        }

        const recordId = route?.params?.record ?? null;

        if (recordId && mode !== 'create') {
            const recentlyViewed = this.buildRecentlyViewed(module, recordId);
            this.addRecentlyViewed(module, recentlyViewed)
        }
    }

    /**
     * Build new recently viewed
     * @param module
     * @param id
     * @param view
     */
    public buildRecentlyViewed(module: string, id: string, view = 'detailview'): RecentlyViewed {
        return deepClone({
            module: 'Tracker',
            type: 'Tracker',
            attributes: {
                module_name: module ?? '',
                item_id: id ?? '',
                action: view ?? '',
            },
        } as RecentlyViewed);
    }

    /**
     * Add recently viewed
     * @param module
     * @param viewed
     */
    public addRecentlyViewed(module: string, viewed: RecentlyViewed): void {
        this.saveRecentlyViewed(module, viewed);
    }

    /**
     * Save recently viewed to backend
     * @param module
     * @param viewed
     */
    protected saveRecentlyViewed(module: string, viewed: RecentlyViewed): void {

        const processType = 'add-recently-viewed';

        const options = {
            recentlyViewed: viewed
        };

        setTimeout(() => {
            this.processService.submit(processType, options).pipe(take(1)).subscribe(result => {

                const saved = {
                    id: viewed.id ?? '',
                    module: viewed.module ?? '',
                    attributes: {...(viewed.attributes ?? {})},
                };

                const tracker = result?.data?.tracker ?? null;
                if (tracker === null) {
                    return;
                }

                saved.attributes.item_summary = tracker.item_summary;
                const newItemId = saved?.attributes?.item_id ?? '';

                const metadata = this.metadata.getModuleMeta(module);

                const current = metadata?.recentlyViewed ?? null;
                if (current) {
                    let cleared = current.filter(item => ((item?.attributes?.item_id ?? '') !== newItemId));
                    cleared.unshift(saved);
                    metadata.recentlyViewed = cleared;
                }

                this.metadata.setModuleMetadata(module, metadata);
            });
        }, 500);
    }

}
