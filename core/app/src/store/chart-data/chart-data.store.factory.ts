import {Injectable} from '@angular/core';
import {StatisticsFetchGQL} from '@store/statistics/graphql/api.statistics.get';
import {ChartDataStore} from '@store/chart-data/chart-data.store';
import {DataTypeFormatter} from '@services/formatters/data-type.formatter.service';

@Injectable({
    providedIn: 'root',
})
export class ChartDataStoreFactory {

    constructor(protected fetchGQL: StatisticsFetchGQL, protected formatter: DataTypeFormatter) {
    }

    create(): ChartDataStore {
        return new ChartDataStore(this.fetchGQL, this.formatter);
    }
}
