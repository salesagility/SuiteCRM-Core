import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonUiComponent} from './button.component';

describe('ButtonUiComponent', () => {
    let component: ButtonUiComponent;
    let fixture: ComponentFixture<ButtonUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ButtonUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonUiComponent);
        component = fixture.componentInstance;

        component.buttonConfig = {
            text: 'NEW',
            buttonClass: 'action-button'
        };

        fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
