import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageUiComponent} from './message.component';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

describe('MessageComponent', () => {
    let component: MessageUiComponent;
    let fixture: ComponentFixture<MessageUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MessageUiComponent],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
            ]
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
