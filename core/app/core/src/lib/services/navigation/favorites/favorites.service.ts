import {Injectable} from '@angular/core';
import {MetadataStore} from '../../../store/metadata/metadata.store.service';
import {deepClone, Favorite} from 'common';
import {ProcessService} from '../../process/process.service';
import {take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class FavoritesService {

    constructor(
        protected metadata: MetadataStore,
        protected processService: ProcessService
    ) {
    }

    /**
     * Public Api
     */

    /**
     * Build new favorite
     * @param module
     * @param id
     */
    public build(module: string, id: string): Favorite {
        return deepClone({
            module: 'Favorite',
            type: 'Favorite',
            attributes: {
                parent_id: id,
                parent_type: module,
            },
        } as Favorite);
    }


    /**
     * Add favorite
     * @param module
     * @param favorite
     */
    public add(module: string, favorite: Favorite): void {
        this.update(module, favorite, 'add');
    }

    /**
     * Add favorite
     * @param module
     * @param favorite
     */
    public remove(module: string, favorite: Favorite): void {
        this.update(module, favorite, 'remove');
    }

    /**
     * Save favorite to backend
     * @param module
     * @param favorite
     * @param action
     */
    protected update(module: string, favorite: Favorite, action: string): void {

        const processType = 'update-favorite';

        const options = {
            favorite: favorite,
            action
        };

        setTimeout(() => {
            this.processService.submit(processType, options).pipe(take(1)).subscribe(result => {

                const savedFavorite = result?.data?.favorite ?? null;
                if (savedFavorite === null) {
                    this.removeFavoriteFromMetadata(module, favorite);
                    return;
                }
                this.addFavoriteToMetadata(savedFavorite, module);
            });
        }, 100);
    }

    /**
     *
     * @param savedFavorite
     * @param module
     * @private
     */
    protected addFavoriteToMetadata(savedFavorite: Favorite, module: string): void {
        const saved = {
            id: savedFavorite?.id ?? '',
            module: savedFavorite?.module ?? '',
            attributes: {...(savedFavorite?.attributes ?? {})},
        };

        const newItemId = savedFavorite?.attributes?.parent_id ?? '';
        const metadata = this.metadata.getModuleMeta(module);

        const current = metadata?.favorites ?? null;
        if (current) {
            let cleared = current.filter(item => ((item?.attributes?.parent_id ?? '') !== newItemId));
            cleared.unshift(saved);
            metadata.favorites = cleared;
        }

        this.metadata.setModuleMetadata(module, metadata);
    }

    /**
     * Remove favorite from metadata
     * @param module
     * @param favorite
     */
    protected removeFavoriteFromMetadata(module: string, favorite: Favorite): void {
        const metadata = this.metadata.getModuleMeta(module);

        const current = metadata?.favorites ?? null;
        const parentId = favorite?.attributes?.parent_id ?? null;
        if (!current || !current.length || !parentId) {
            return;
        }

        metadata.favorites = current.filter(item => ((item?.attributes?.parent_id ?? '') !== parentId));
        this.metadata.setModuleMetadata(module, metadata);
    }
}
