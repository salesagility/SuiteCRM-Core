import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalViewUiComponent} from './modal-view.component';

describe('ModalViewUiComponent', () => {
    let component: ModalViewUiComponent;
    let fixture: ComponentFixture<ModalViewUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalViewUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalViewUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
