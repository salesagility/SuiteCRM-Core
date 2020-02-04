import {async, ComponentFixture, TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NavbarUiComponent} from './navbar.component';
import {of} from 'rxjs';
import {Metadata} from '@services/metadata/metadata.service';

describe('NavbarUiComponent', () => {



    describe('Test with mock service', () => {
        let component: NavbarUiComponent;
        let fixture: ComponentFixture<NavbarUiComponent>;
        let service: Metadata;

        const navigationMockData = {
            navbar: {
                NonGroupedTabs: {
                    contacts: 'Contacts',
                },
                groupedTabs: {
                    Sales: {
                        modules: {
                            Accounts: 'Accounts',
                        }
                    },
                },
                userActionMenu: [
                    {
                        label: 'Profile',
                        url: 'index.php?module=Users&action=EditView&record=1',
                        submenu: []
                    },
                    {
                        label: 'Employees',
                        url: 'index.php?module=Employees&action=index',
                        submenu: []
                    },
                ],
            }
        };

        // Create a fake TwainService object with a 'getQuote()' spy
        const metadata = jasmine.createSpyObj('Metadata', ['getNavigation']);
        // Make the spy return a synchronous Observable with the test data
        const getMetadata = metadata.getNavigation.and.returnValue(of(navigationMockData.navbar));


        beforeEach(() => {
            TestBed.configureTestingModule({
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                imports: [RouterTestingModule, HttpClientTestingModule, NgbModule],
                providers: [{provide: Metadata, useValue: metadata}],
                declarations: [NavbarUiComponent]
            }).compileComponents();
            service = TestBed.get(Metadata);
            fixture = TestBed.createComponent(NavbarUiComponent);
            component = fixture.componentInstance;
        });

        it('should create', () => {
            fixture.detectChanges(); // onInit()
            expect(component).toBeTruthy();
        });

        it('should get metadata', async (() => {
            fixture.detectChanges(); // onInit()

            fixture.whenStable().then(() => {
                expect(component.navigationMetadata).toEqual(jasmine.objectContaining(navigationMockData.navbar));
            });

            component.ngOnInit();
        }));
    });

});
