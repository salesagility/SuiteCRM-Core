export interface StateFacadeMap {
    [key: string]: StateFacade;
}

export interface StateFacade {
    clear(): void;
}
