import {LinkModel} from '../navbar/link-model';
import {FavoriteRecordModel} from './favorite-record-model';

export interface ActionBarModel {
    createLinks: LinkModel[];
    favoriteRecords: Array<FavoriteRecordModel>;
}
