import {Injectable} from '@angular/core';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {SingleValueStatisticsStore} from '@store/single-value-statistics/single-value-statistics.store';
import {FieldManager} from '@services/record/field/field.manager';

@Injectable({
    providedIn: 'root',
})
export class SingleValueStatisticsStoreFactory {

    constructor(protected fetchGQL: StatisticsFetchGQL, protected fieldManager: FieldManager) {
    }

    create(): SingleValueStatisticsStore {
        return new SingleValueStatisticsStore(this.fetchGQL, this.fieldManager);
    }
}
