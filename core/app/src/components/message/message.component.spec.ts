import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageUiComponent} from './message.component';

describe('MessageComponent', () => {
    let component: MessageUiComponent;
    let fixture: ComponentFixture<MessageUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MessageUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
