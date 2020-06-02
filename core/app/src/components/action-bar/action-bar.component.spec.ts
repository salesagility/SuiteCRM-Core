import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActionBarUiComponent} from './action-bar.component';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {GlobalSearch} from '@services/navigation/global-search/global-search.service';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';


describe('ActionBarUiComponent', () => {
    let component: ActionBarUiComponent;
    let fixture: ComponentFixture<ActionBarUiComponent>;

    let navigateCounter = 0;
    let lastSearchTerm = '';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {
                    provide: LanguageStore, useValue: {
                        vm$: of(languageStoreMock).pipe(take(1))
                    }
                },
                {
                    provide: GlobalSearch, useValue: {
                        navigateToSearch: (searchTerm: string): Promise<boolean> => {
                            navigateCounter++;
                            lastSearchTerm = searchTerm;
                            return of(true).toPromise();
                        }
                    }
                },
            ],
            declarations: [ActionBarUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(ActionBarUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have global search', () => {

        const input = fixture.debugElement.query(By.css('.global-search .global-search-term')).nativeElement;
        const button = fixture.debugElement.query(By.css('.global-search .search-button')).nativeElement;

        expect(input).toBeTruthy();
        expect(button).toBeTruthy();
    });

    it('should navigate to global search on click', async(() => {

        const global = fixture.nativeElement.getElementsByClassName('global-search')[0];
        const input = global.querySelector('input');
        const button = global.querySelector('button');

        navigateCounter = 0;
        lastSearchTerm = '';

        expect(input).toBeTruthy();
        expect(input.className).toContain('global-search-term');
        expect(button).toBeTruthy();
        expect(button.className).toContain('search-button');

        const term = 'search query term';
        input.value = term;

        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        fixture.whenStable().then(() => {

            button.click();
            fixture.detectChanges();

            expect(navigateCounter).toEqual(1);
            expect(lastSearchTerm).toEqual(term);
        });
    }));
});
