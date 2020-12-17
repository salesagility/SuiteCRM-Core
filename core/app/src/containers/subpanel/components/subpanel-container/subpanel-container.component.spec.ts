import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {SubpanelContainerComponent} from './subpanel-container.component';
import {ModuleTitleModule} from '@components/module-title/module-title.module';
import {ActionMenuModule} from '@views/list/components/action-menu/action-menu.module';
import {SettingsMenuModule} from '@views/list/components/settings-menu/settings-menu.module';
import {ImageModule} from '@components/image/image.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ButtonModule} from '@components/button/button.module';
import {ListFilterModule} from '@components/list-filter/list-filter.module';

@Component({
    selector: 'subpanel-test-host-component',
    template: '<scrm-subpanel></scrm-subpanel>'
})
class SubpanelContainerComponentTestHostComponent {
}

describe('SubpanelContainerComponent', () => {
    let testHostComponent: SubpanelContainerComponentTestHostComponent;
    let testHostFixture: ComponentFixture<SubpanelContainerComponentTestHostComponent>;

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
            declarations: [SubpanelContainerComponent, SubpanelContainerComponentTestHostComponent],
            providers: [
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(SubpanelContainerComponentTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });
});
