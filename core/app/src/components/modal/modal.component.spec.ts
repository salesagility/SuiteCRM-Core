import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalUiComponent} from './modal.component';
import {ThemeImagesFacade} from '@store/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';

describe('ModalUiComponent', () => {
    let component: ModalUiComponent;
    let fixture: ComponentFixture<ModalUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalUiComponent],
            providers: [
                {
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
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
