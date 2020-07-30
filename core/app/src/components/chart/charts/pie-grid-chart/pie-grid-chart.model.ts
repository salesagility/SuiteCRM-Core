import {Observable} from 'rxjs';

export interface PieGridChartResult {
    name: string;
    value: number;
}

export interface PieGridChartChartDataSource {
    height?: number;
    scheme: any;

    getResults(): Observable<PieGridChartResult[]>;

    getTotalLabel(): string;
}
