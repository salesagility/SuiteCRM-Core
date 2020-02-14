import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalUiComponent} from './modal.component';

describe('ModalUiComponent', () => {
    let component: ModalUiComponent;
    let fixture: ComponentFixture<ModalUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
