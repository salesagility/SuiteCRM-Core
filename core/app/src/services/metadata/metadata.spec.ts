import {async, ComponentFixture, getTestBed, inject, TestBed} from '@angular/core/testing';
import {Metadata} from '@services/metadata/metadata.service';
import {NavigationMetadata} from '@services/metadata/navigation/navigation.metadata.service';
import {of} from 'rxjs';

describe('Metadata Service', () => {
    let injector: TestBed;
    let service: Metadata;

    describe('Navigation Metadata', () => {

        const navigationMockData = {
            navbar: {
                NonGroupedTabs: {
                    Contacts: 'Contacts',
                    Accounts: 'Accounts'
                },
                groupedTabs: {
                    Sales: {
                        modules: {
                            Accounts: 'Accounts',
                            Contacts: 'Contacts',
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

        /*
        const navigationMetadata = ({
            fetch() {
                return of(navigationMockData.navbar);
            }
        } as any) as NavigationMetadata;
         */

        // Create a fake TwainService object with a `getQuote()` spy
        const navigationMetadata = jasmine.createSpyObj('NavigationMetadata', ['fetch']);
        // Make the spy return a synchronous Observable with the test data
        navigationMetadata.fetch.and.returnValue( of(navigationMockData.navbar) );

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [{provide: NavigationMetadata, useValue: navigationMetadata}],
            });

            injector = getTestBed();
            service = injector.get(Metadata);
        });


        it('#getNavigation', (done: DoneFn) => {
            service.getNavigation().subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(navigationMockData.navbar));
                done();
            });
        });

    });

});

