export interface StateFacadeMap {
    [key: string]: StateFacadeMapEntry;
}

export interface StateFacadeMapEntry {
    facade: StateFacade;
    authBased: boolean;
}

export interface StateFacade {
    clear(): void;
}
