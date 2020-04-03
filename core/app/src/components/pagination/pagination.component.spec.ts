import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AngularSvgIconModule} from 'angular-svg-icon';
import {PaginationUiComponent} from './pagination.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';
import {ImageModule} from '@components/image/image.module';

describe('PaginationUiComponent', () => {
    let component: PaginationUiComponent;
    let fixture: ComponentFixture<PaginationUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularSvgIconModule,
                HttpClientTestingModule,
                ImageModule
            ],
            declarations: [PaginationUiComponent],
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
        fixture = TestBed.createComponent(PaginationUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
