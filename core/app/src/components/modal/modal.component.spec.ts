import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalUiComponent} from './modal.component';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';

describe('ModalUiComponent', () => {
    let component: ModalUiComponent;
    let fixture: ComponentFixture<ModalUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModalUiComponent],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
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
