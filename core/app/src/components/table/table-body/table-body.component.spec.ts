import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TablebodyUiComponent} from './table-body.component';
import {CdkTableModule} from '@angular/cdk/table';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {Component} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';

@Component({
    selector: 'tabke-body-ui-test-host-component',
    template: '<scrm-table-body-ui [module]="module"></scrm-table-body-ui>'
})
class TableBodyUITestHostComponent {
    module = 'accounts';
}

describe('TablebodyUiComponent', () => {
    let testHostComponent: TableBodyUITestHostComponent;
    let testHostFixture: ComponentFixture<TableBodyUITestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CdkTableModule,
                ApolloTestingModule,
            ],
            declarations: [TablebodyUiComponent, TableBodyUITestHostComponent],
            providers: [
                {
                    provide: ListViewStore, useValue: listviewStoreMock
                },
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TableBodyUITestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have table body', () => {
        const tableBodyElement = testHostFixture.nativeElement.querySelector('table');

        expect(testHostComponent).toBeTruthy();
        expect(tableBodyElement).toBeTruthy();
        expect(tableBodyElement.outerHTML).toContain('aria-describedby="table-body"');
    });
});
