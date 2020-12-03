import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ColumnChooserComponent} from './columnchooser.component';

describe('ColumnChooserUiComponent', () => {
    let component: ColumnChooserComponent;
    let fixture: ComponentFixture<ColumnChooserComponent>;

    beforeEach(waitForAsync(() => {
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
