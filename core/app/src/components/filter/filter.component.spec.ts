import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterUiComponent} from './filter.component';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';

describe('FilterUiComponent', () => {
    let component: FilterUiComponent;
    let fixture: ComponentFixture<FilterUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterUiComponent],
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
        fixture = TestBed.createComponent(FilterUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //   expect(component).toBeTruthy();
    // });
});
