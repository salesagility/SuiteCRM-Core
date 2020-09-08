import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ColumnChooserComponent} from './columnchooser.component';

describe('ColumnChooserUiComponent', () => {
    let component: ColumnChooserComponent;
    let fixture: ComponentFixture<ColumnChooserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColumnChooserComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColumnChooserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
