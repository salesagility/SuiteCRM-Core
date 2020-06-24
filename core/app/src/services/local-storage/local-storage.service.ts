import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    protected storageKey = 'scrm-session-storage';

    constructor() {
    }

    clear(): void {
        this.getLocalStorage().removeItem(this.storageKey);
    }

    set(key: string, data: any): void {
        const storeJson = this.getLocalStorage().getItem(this.storageKey);
        let store = {};

        if (storeJson) {
            store = JSON.parse(storeJson);
        }

        store[key] = data;

        this.getLocalStorage().setItem(this.storageKey, JSON.stringify(store));
    }

    get(key: string): any {
        const storeJson = this.getLocalStorage().getItem(this.storageKey);
        let store = {};

        if (storeJson) {
            store = JSON.parse(storeJson);
        }

        return store[key];
    }

    protected getLocalStorage(): Storage {
        return localStorage;
    }
}
