import {getTestBed, TestBed} from '@angular/core/testing';
import {
    ApolloTestingModule,
    ApolloTestingController,
} from 'apollo-angular/testing';
import gql from 'graphql-tag';
import {NavigationMetadata} from '@services/metadata/navigation/navigation.metadata.service';

describe('Navigation Metadata Service', () => {
    let injector: TestBed;
    let service: NavigationMetadata;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });

        injector = getTestBed();
        controller = injector.get(ApolloTestingController);
        service = injector.get(NavigationMetadata);
    });

    afterEach(() => {
        controller.verify();
    });

    it('#fetch',
        (done: DoneFn) => {

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

            service.fetch().subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(navigationMockData.navbar));
                done();

            });

            const op = controller.expectOne(gql`
              query navbar($id: ID!) {
                navbar(id: $id) {
                  NonGroupedTabs
                  groupedTabs
                  userActionMenu
                }
              }
            `);

            // Assert that one of variables is Mr Apollo.
            expect(op.operation.variables.id).toEqual('/api/navbars/1');

            // Respond with mock data, causing Observable to resolve.
            op.flush({
                data: navigationMockData
            });

            // Finally, assert that there are no outstanding operations.
            controller.verify();
        });
});

