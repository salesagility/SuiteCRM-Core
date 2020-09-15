import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {PanelComponent} from './panel.component';
import {By} from '@angular/platform-browser';
import {CloseButtonModule} from '@components/close-button/close-button.module';
import {ButtonModule} from '@components/button/button.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';
import {MinimiseButtonModule} from '@components/minimise-button/minimise-button.module';

@Component({
    selector: 'panel-test-host-component',
    template: `
        <scrm-panel [title]="title" [close]="close">
            <span panel-header-button>
                <scrm-button *ngIf="button1" [config]="button1"></scrm-button>
                <scrm-button *ngIf="button2" [config]="button2"></scrm-button>
                <scrm-dropdown-button *ngIf="dropdown" [config]="dropdown"></scrm-dropdown-button>
            </span>
            <h1 panel-body>test panel body</h1>
        </scrm-panel>
    `
})
class PanelTestHostComponent {
    closeClicked = 0;
    button1Clicked = 0;
    button2Clicked = 0;
    title = 'Test Title';
    button1 = {
        label: 'Test button 1',
        onClick: (): void => {
            this.button1Clicked++;
        }
    };

    button2 = {
        label: 'Test button 2',
        onClick: (): void => {
            this.button2Clicked++;
        }
    };

    dropdown: DropdownButtonInterface = {
        klass: {'some-class': true},
        label: 'Test Label',
        items: []
    };

    close = {
        onClick: (): void => {
            this.closeClicked++;
        }
    };
}

describe('PanelComponent', () => {
    let testHostComponent: PanelTestHostComponent;
    let testHostFixture: ComponentFixture<PanelTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PanelTestHostComponent,
                PanelComponent,
            ],
            imports: [
                CloseButtonModule,
                ButtonModule,
                DropdownButtonModule,
                MinimiseButtonModule
            ],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(PanelTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have header', () => {
        expect(testHostFixture.debugElement.query(By.css('.card-header')).nativeElement).toBeTruthy();
    });

    it('should have body', () => {
        expect(testHostFixture.debugElement.query(By.css('.card-body')).nativeElement).toBeTruthy();
    });

    it('should have header title', () => {

        const element = testHostFixture.debugElement.query(By.css('.card-header'));

        expect(element.nativeElement.textContent).toContain(('Test Title'));
    });

    it('should have close icon', async(() => {
        testHostComponent.closeClicked = 0;

        expect(testHostComponent).toBeTruthy();
        const element = testHostFixture.debugElement.query(By.css('.card-header'));
        const button = element.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
        button.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent.closeClicked).toEqual(1);
        });
    }));

    it('should have configurable buttons', async(() => {
        testHostComponent.closeClicked = 0;
        testHostComponent.button1Clicked = 0;
        testHostComponent.button2Clicked = 0;

        expect(testHostComponent).toBeTruthy();
        const element = testHostFixture.debugElement.query(By.css('.panel-buttons'));
        const buttons = element.nativeElement.querySelectorAll('button');

        expect(buttons).toBeTruthy();
        expect(buttons.length).toEqual(3);

        buttons.forEach((btn) => {
            btn.click();
        });
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent.button1Clicked).toEqual(1);
            expect(testHostComponent.button2Clicked).toEqual(1);
        });


    }));

    it('should have projected body', () => {
        expect(testHostComponent).toBeTruthy();
        const element = testHostFixture.debugElement.query(By.css('.card-body'));

        expect(element.nativeElement).toBeTruthy();

        const body = element.nativeElement.querySelector('h1');

        expect(body).toBeTruthy();
        expect(body.textContent).toContain('test panel body');
    });

});
