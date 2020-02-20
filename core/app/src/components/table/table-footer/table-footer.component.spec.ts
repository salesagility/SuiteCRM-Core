import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TablefooterUiComponent} from './table-footer.component';
import {PaginationUiModule} from '@components/pagination/pagination.module';
import {BulkactionmenuUiModule} from '@components/bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TablefooterUiComponent', () => {
    let component: TablefooterUiComponent;
    let fixture: ComponentFixture<TablefooterUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                PaginationUiModule,
                BulkactionmenuUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            declarations: [TablefooterUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TablefooterUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
