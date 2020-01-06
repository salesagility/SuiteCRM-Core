import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FileListFieldsComponent} from './file.component';

describe('FileListFieldsComponent', () => {
    let component: FileListFieldsComponent;
    let fixture: ComponentFixture<FileListFieldsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FileListFieldsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileListFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
