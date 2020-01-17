import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ColumnChooserUiComponent} from './columnchooser.component';

describe('ColumnChooserUiComponent', () => {
    let component: ColumnChooserUiComponent;
    let fixture: ComponentFixture<ColumnChooserUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColumnChooserUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColumnChooserUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
