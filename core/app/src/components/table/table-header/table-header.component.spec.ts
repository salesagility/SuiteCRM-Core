import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableheaderUiComponent} from './table-header.component';
import {PaginationUiModule} from '@components/pagination/pagination.module';
import {BulkactionmenuUiModule} from '@components/bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TableheaderUiComponent', () => {
    let component: TableheaderUiComponent;
    let fixture: ComponentFixture<TableheaderUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                PaginationUiModule,
                BulkactionmenuUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            declarations: [TableheaderUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableheaderUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
