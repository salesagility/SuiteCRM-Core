import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloadListFieldsComponent} from './download.component';

describe('DownloadListFieldsComponent', () => {
    let component: DownloadListFieldsComponent;
    let fixture: ComponentFixture<DownloadListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DownloadListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DownloadListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
