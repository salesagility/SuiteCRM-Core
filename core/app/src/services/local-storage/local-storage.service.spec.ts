import {TestBed} from '@angular/core/testing';

import {LocalStorageService} from './local-storage.service';
import {
    localStorageServiceMock,
    MockLocalStorageService
} from '@services/local-storage/local-storage.service.spec.mock';

describe('LocalStorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: LocalStorageService = TestBed.inject(LocalStorageService);

        expect(service).toBeTruthy();
    });

    it('should store items', () => {
        const mockService: MockLocalStorageService = localStorageServiceMock;

        expect(mockService).toBeTruthy();

        const criteria = {filters: {name: {values: ['test']}}};
        mockService.clear();
        mockService.set('criteria', criteria);
        const store = mockService.getStore();
        const internalItem = store.getItem('scrm-session-storage');

        expect(internalItem).toBeTruthy();
        expect(internalItem).toEqual(JSON.stringify({criteria}));

        const retrievedCriteria = mockService.get('criteria');

        expect(retrievedCriteria).toBeTruthy();
        expect(retrievedCriteria).toEqual(criteria);
    });

    it('should allow to remove items', () => {
        const mockService: MockLocalStorageService = localStorageServiceMock;

        expect(mockService).toBeTruthy();

        const criteria = {filters: {name: {values: ['test']}}};
        mockService.clear();
        mockService.set('criteria', criteria);
        let store = mockService.getStore();
        let internalItem = store.getItem('scrm-session-storage');

        expect(internalItem).toBeTruthy();
        expect(internalItem).toEqual(JSON.stringify({criteria}));

        mockService.clear();

        store = mockService.getStore();
        internalItem = store.getItem('scrm-session-storage');

        expect(internalItem).not.toBeTruthy();
    });
});
