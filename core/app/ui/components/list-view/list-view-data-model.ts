import {ListViewColumnModel} from './list-view-column-model';

export interface ListViewRowModel {
    selected: boolean;
    id: string;
    data: any;
}

export interface ListViewDataModel {
    module: string;
    columns: ListViewColumnModel[];
    orderby?: string;
    desc?: boolean;
    maxpage: number;
    page: number;
    rows: ListViewRowModel[];
}

export class ListViewData implements ListViewDataModel {
    module: string = null;
    columns: ListViewColumnModel[];
    orderby = '';
    desc: boolean = null;
    maxpage: number;
    page = 1;
    rows: ListViewRowModel[];
}
