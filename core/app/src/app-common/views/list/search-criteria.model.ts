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

export interface FilterPresetHandler {
    type: string;
    params: { [key: string]: string };
}

export interface SearchCriteria {
    name?: string;
    preset?: FilterPresetHandler;
    filters?: SearchCriteriaFilter;
}
