export interface SearchCriteriaFieldFilter {
    field?: string;
    operator: string;
    values?: string[];
    start?: string;
    end?: string;
}

export interface SearchCriteriaFilter {
    [key: string]: SearchCriteriaFieldFilter;
}

export interface SearchCriteria {
    name?: string;
    type?: string;
    filters: SearchCriteriaFilter;
}
