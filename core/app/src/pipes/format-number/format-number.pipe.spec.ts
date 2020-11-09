import {FormatNumberPipe} from './format-number.pipe';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {BehaviorSubject} from 'rxjs';
import {UserPreferenceMockStore} from '@store/user-preference/user-preference.store.spec.mock';

@Component({
    selector: 'format-number-pipe-test-host-component',
    template: '{{value | formatNumber}}'
})
class FormatNumberPipeTestHostComponent {
    value = '10';
}

describe('FormatNumberPipe', () => {
    let testHostComponent: FormatNumberPipeTestHostComponent;
    let testHostFixture: ComponentFixture<FormatNumberPipeTestHostComponent>;

    /* eslint-disable camelcase,@typescript-eslint/camelcase */
    const preferences = new BehaviorSubject<any>({
        num_grp_sep: ',',
        dec_sep: '.',
    });

    const mockStore = new UserPreferenceMockStore(preferences);
    /* eslint-enable camelcase,@typescript-eslint/camelcase */

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FormatNumberPipeTestHostComponent,
                FormatNumberPipe,
            ],
            imports: [],
            providers: [
                {
                    provide: UserPreferenceStore, useValue: mockStore
                },
                {
                    provide: NumberFormatter, useValue: new NumberFormatter(mockStore, 'en_us')
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(FormatNumberPipeTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain(10);
    });

    it('should have en_us formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase,@typescript-eslint/camelcase */
        preferences.next(
            {
                num_grp_sep: ',',
                dec_sep: '.',
            }
        );
        /* eslint-enable camelcase,@typescript-eslint/camelcase */

        testHostComponent.value = '10.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('10.5');
    });

    it('should have custom formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase,@typescript-eslint/camelcase */
        preferences.next(
            {
                num_grp_sep: '.',
                dec_sep: ',',
            }
        );
        /* eslint-enable camelcase,@typescript-eslint/camelcase */

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('1.000,5');
    });
});
