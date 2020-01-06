import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SvgIconUiComponent} from './svg-icon.component';

describe('SvgiconComponent', () => {
    let component: SvgIconUiComponent;
    let fixture: ComponentFixture<SvgIconUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SvgIconUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SvgIconUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
