import {LocalStorageService} from '@services/local-storage/local-storage.service';

class MockLocalStorage implements Storage {
    [name: string]: any;

    store = {};

    readonly length: number;

    clear(): void {
        this.store = {};
    }

    getItem(key: string): string | null {
        return this.store[key];
    }

    key(index: number): string | null {
        const keys = Object.keys(this.store);

        if (keys && keys[index]) {
            return keys[index];
        }

        return null;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }
}

export class MockLocalStorageService extends LocalStorageService {
    store = new MockLocalStorage();

    getStore(): MockLocalStorage {
        return this.store;
    }

    protected getLocalStorage(): Storage {
        return this.store;
    }
}

export const localStorageServiceMock = new MockLocalStorageService();
