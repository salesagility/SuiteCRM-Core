import {ButtonLoadingDirective} from './button-loading.directive';
import {AppStateFacade} from '@store/app-state/app-state.facade';
import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

@Component({
    selector: 'host-component',
    template: '<button [scrm-button-loading]="loading"></button>'
})
class TestHostComponent {
    private loading = false;

    setLoading(loading: boolean): void {
        this.loading = loading;
    }
}

describe('ButtonLoadingDirective', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;
    const appState = new AppStateFacade();

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ButtonLoadingDirective, TestHostComponent],
            imports: [],
            providers: [
                {
                    provide: AppStateFacade, useValue: appState
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('button should get disabled when app loading is active', () => {

        expect(testHostComponent).toBeTruthy();
        appState.updateLoading('button-loading',true);
        testHostFixture.detectChanges();
        let button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.disabled).toEqual(true);

        appState.updateLoading('button-loading',false);

        testHostFixture.detectChanges();
        button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.disabled).toEqual(false);
    });

    it('button should get disabled when loading input is active', () => {

        expect(testHostComponent).toBeTruthy();
        appState.updateLoading('button-loading',false);
        testHostComponent.setLoading(true);
        testHostFixture.detectChanges();
        let button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.disabled).toEqual(true);

        testHostComponent.setLoading(false);
        testHostFixture.detectChanges();
        button = testHostFixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        expect(button.disabled).toEqual(false);
    });
});
