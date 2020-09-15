import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {SubpanelComponent} from './subpanel.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ActionMenuModule} from '@components/action-menu/action-menu.module';
import {SettingsMenuModule} from '@components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {ListFilterModule} from '@components/list-filter/list-filter.module';

@Component({
    selector: 'subpanel-test-host-component',
    template: '<scrm-subpanel></scrm-subpanel>'
})
class SubpanelComponentTestHostComponent {
}

describe('SubpanelComponent', () => {
    let testHostComponent: SubpanelComponentTestHostComponent;
    let testHostFixture: ComponentFixture<SubpanelComponentTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ModuleTitleModule,
                ActionMenuModule,
                ButtonModule,
                SettingsMenuModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                ImageModule,
                ListFilterModule,
                RouterTestingModule
            ],
            declarations: [SubpanelComponent, SubpanelComponentTestHostComponent],
            providers: [
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(SubpanelComponentTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
