export interface StateStoreMap {
    [key: string]: StateStoreMapEntry;
}

export interface StateStoreMapEntry {
    store: StateStore;
    authBased: boolean;
}

export interface StateStore {
    clear(): void;

    clearAuthBased(): void;
}
