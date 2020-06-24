import {ListViewStore, SearchCriteria} from '@store/list-view/list-view.store';
import {listviewMockData, listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {take} from 'rxjs/operators';
import {PageSelection} from '@components/pagination/pagination.model';
import {localStorageServiceMock} from '@services/local-storage/local-storage.service.spec.mock';

describe('Listview Store', () => {
    const service: ListViewStore = listviewStoreMock;

    beforeEach(() => {
    });

    it('#load', (done: DoneFn) => {
        service.updateSelection(SelectionStatus.NONE);
        service.init('accounts').subscribe(data => {
            expect(data.records).toEqual(jasmine.objectContaining(listviewMockData.listView.records));
            done();
        });
    });

    it('#updateSelection select all', () => {
        service.updateSelection(SelectionStatus.NONE);
        service.updateSelection(SelectionStatus.ALL);
        service.selection$.pipe(take(1)).subscribe(data => {
            expect(data.all).toEqual(true);
            expect(data.status).toEqual(SelectionStatus.ALL);
            expect(data.selected).toEqual({});
        }).unsubscribe();
    });

    it('#updateSelection select page', () => {
        service.updateSelection(SelectionStatus.NONE);
        service.init('accounts').subscribe(() => {
            service.updateSelection(SelectionStatus.PAGE);
            service.selection$.pipe(take(1)).subscribe(selection => {
                expect(selection.all).toEqual(false);
                expect(selection.status).toEqual(SelectionStatus.SOME);
                expect(selection.selected).toEqual({'29319818-dc26-f57d-03e1-5ed77dedd691': '29319818-dc26-f57d-03e1-5ed77dedd691'});
                expect(selection.count).toEqual(1);
            }).unsubscribe();
        }).unsubscribe();

    });

    it('#updateSelection deselect all', () => {
        service.updateSelection(SelectionStatus.NONE);
        service.selection$.pipe(take(1)).subscribe(data => {
            expect(data.all).toEqual(false);
            expect(data.status).toEqual(SelectionStatus.NONE);
            expect(data.selected).toEqual({});
            expect(data.count).toEqual(0);
        }).unsubscribe();
    });

    it('#updateSelection toggleSelection', () => {
        service.updateSelection(SelectionStatus.NONE);
        service.toggleSelection('ac319818-dc26-f57d-03e1-5ed77dedd691');

        service.selection$.pipe(take(1)).subscribe(data => {
            expect(data.status).toEqual(SelectionStatus.SOME);
            expect(data.selected).toEqual({
                'ac319818-dc26-f57d-03e1-5ed77dedd691': 'ac319818-dc26-f57d-03e1-5ed77dedd691',
            });

            expect(data.count).toEqual(1);

            service.toggleSelection('ac319818-dc26-f57d-03e1-5ed77dedd691');
            service.selection$.pipe(take(1)).subscribe(newData => {
                expect(newData.status).toEqual(SelectionStatus.NONE);
                expect(newData.selected).toEqual({});
                expect(newData.count).toEqual(0);
            }).unsubscribe();
        }).unsubscribe();


    });

    it('#changePage next', () => {
        service.init('accounts').pipe(take(1)).subscribe(() => {
            service.changePage(PageSelection.FIRST);
            const before = {...service.getPagination()};
            service.changePage(PageSelection.NEXT);
            const after = service.getPagination();

            expect(before.next).toEqual(after.current);
        });
    });

    it('#changePage previous', () => {
        service.init('accounts').pipe(take(1)).subscribe(() => {
            service.changePage(PageSelection.LAST);
            const before = {...service.getPagination()};
            service.changePage(PageSelection.PREVIOUS);
            const after = service.getPagination();

            expect(before.previous).toEqual(after.current);
        });
    });

    it('#updateCriteria with reload', () => {
        service.init('accounts').pipe(take(1)).subscribe(() => {

            const criteria = {
                filters: {
                    name: {
                        operator: '=',
                        values: ['test']
                    }
                }
            } as SearchCriteria;

            service.updateSearchCriteria(criteria);
            const savedCriteria = service.searchCriteria;
            const localStorageCriteria = localStorageServiceMock.get('search-criteria').accounts;

            expect(criteria).toEqual(savedCriteria);
            expect(criteria).toEqual(localStorageCriteria);
        });
    });

    it('#updateCriteria without reload', () => {
        service.init('accounts').pipe(take(1)).subscribe(() => {

            const criteria = {
                filters: {
                    name: {
                        operator: '=',
                        values: ['test 2']
                    }
                }
            } as SearchCriteria;

            service.updateSearchCriteria(criteria, false);
            const savedCriteria = service.searchCriteria;
            const localStorageCriteria = localStorageServiceMock.get('search-criteria').accounts;

            expect(criteria).toEqual(savedCriteria);
            expect(criteria).not.toEqual(localStorageCriteria);
        });
    });
});

