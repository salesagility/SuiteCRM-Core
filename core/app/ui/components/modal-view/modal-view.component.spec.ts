import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalViewComponent} from './modal-view.component';

describe('ModalViewComponent', () => {
    let component: ModalViewComponent;
    let fixture: ComponentFixture<ModalViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
