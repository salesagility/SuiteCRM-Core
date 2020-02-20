import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularSvgIconModule} from 'angular-svg-icon';
import {PaginationUiComponent} from './pagination.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PaginationUiComponent', () => {
    let component: PaginationUiComponent;
    let fixture: ComponentFixture<PaginationUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            declarations: [PaginationUiComponent, ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
