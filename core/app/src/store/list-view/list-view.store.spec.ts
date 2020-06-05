import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewMockData, listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {SelectionStatus} from '@components/bulk-action-menu/bulk-action-menu.component';
import {take} from 'rxjs/operators';

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
});

