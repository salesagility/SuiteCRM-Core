import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {ChartMessageAreaModule} from '@components/chart/components/chart-message-area/chart-message-area.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';


@Component({
    selector: 'chart-messages-area-host-component',
    template: '<scrm-chart-message-area [labelKey]="label"></scrm-chart-message-area>'
})
class ChartMessageAreaTestHostComponent {
    label = 'LBL_NO_DATA';
}


describe('ChartMessageAreaComponent', () => {
    let component: ChartMessageAreaTestHostComponent;
    let fixture: ComponentFixture<ChartMessageAreaTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChartMessageAreaTestHostComponent],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
            imports: [ChartMessageAreaModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartMessageAreaTestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have value', () => {
        expect(component).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('No Data');
    });
});
