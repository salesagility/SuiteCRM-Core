import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RecordContentComponent, RecordContentConfig, RecordContentDataSource} from './record-content.component';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {Component} from '@angular/core';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {ButtonModule} from '@components/button/button.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {MetadataStore, TabDefinitions} from '@store/metadata/metadata.store.service';
import {PanelModule} from '@components/panel/panel.module';
import {CloseButtonModule} from '@components/close-button/close-button.module';
import {MinimiseButtonModule} from '@components/minimise-button/minimise-button.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';

const dataSource: RecordContentDataSource = {
    getDisplayConfig: (): Observable<RecordContentConfig> => of({
        layout: 'panels',
        mode: 'detail',
        maxColumns: 2,
        tabDefs: {
            LBL_ACCOUNT_INFORMATION: {newTab: true, panelDefault: 'expanded'},
            LBL_PANEL_ADVANCED: {newTab: true, panelDefault: 'expanded'},
            LBL_PANEL_ASSIGNMENT: {newTab: true, panelDefault: 'expanded'}
        } as TabDefinitions
    } as RecordContentConfig).pipe(shareReplay(1)),
    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    getPanels: () => of([
        {
            label: 'OVERVIEW',
            key: 'lbl_account_information',
            rows: [{
                cols: [{
                    name: 'name',
                    label: 'LBL_NAME',
                    comment: 'Name of the Company',
                    fieldDefinition: {
                        name: 'name',
                        type: 'name',
                        dbType: 'varchar',
                        vname: 'LBL_NAME',
                        len: 150,
                        comment: 'Name of the Company',
                        unified_search: true,
                        full_text_search: {boost: 3},
                        audited: true,
                        required: true,
                        importable: 'required',
                        merge_filter: 'selected'
                    },
                    type: 'name'
                }, {
                    name: 'phone_office',
                    label: 'LBL_PHONE_OFFICE',
                    comment: 'The office phone number',
                    fieldDefinition: {
                        name: 'phone_office',
                        vname: 'LBL_PHONE_OFFICE',
                        type: 'phone',
                        dbType: 'varchar',
                        len: 100,
                        audited: true,
                        unified_search: true,
                        full_text_search: {boost: 1},
                        comment: 'The office phone number',
                        merge_filter: 'enabled',
                        required: false
                    },
                    type: 'phone'
                }]
            }, {
                cols: [{
                    name: 'website',
                    label: 'LBL_WEBSITE',
                    type: 'link',
                    displayParams: {link_target: '_blank'},
                    fieldDefinition: {
                        name: 'website',
                        vname: 'LBL_WEBSITE',
                        type: 'url',
                        dbType: 'varchar',
                        len: 255,
                        comment: 'URL of website for the company',
                        required: false
                    }
                }, {
                    name: 'phone_fax',
                    label: 'LBL_FAX',
                    comment: 'The fax phone number of this company',
                    fieldDefinition: {
                        name: 'phone_fax',
                        vname: 'LBL_FAX',
                        type: 'phone',
                        dbType: 'varchar',
                        len: 100,
                        unified_search: true,
                        full_text_search: {boost: 1},
                        comment: 'The fax phone number of this company',
                        required: false
                    },
                    type: 'phone'
                }]
            }, {
                cols: [{
                    name: 'email1',
                    label: 'LBL_EMAIL',
                    studio: 'false',
                    fieldDefinition: {
                        name: 'email1',
                        vname: 'LBL_EMAIL',
                        group: 'email1',
                        type: 'varchar',
                        function: {name: 'getEmailAddressWidget', returns: 'html'},
                        source: 'non-db',
                        studio: {editField: true, searchview: false},
                        full_text_search: {boost: 3, analyzer: 'whitespace'},
                        required: false
                    },
                    type: 'varchar'
                }]
            }, {
                cols: [{
                    name: 'billing_address_street',
                    label: 'LBL_BILLING_ADDRESS',
                    type: 'address',
                    displayParams: {key: 'billing'},
                    fieldDefinition: {
                        name: 'billing_address_street',
                        vname: 'LBL_BILLING_ADDRESS_STREET',
                        type: 'varchar',
                        len: '150',
                        comment: 'The street address used for billing address',
                        group: 'billing_address',
                        merge_filter: 'enabled',
                        required: false
                    }
                }, {
                    name: 'shipping_address_street',
                    label: 'LBL_SHIPPING_ADDRESS',
                    type: 'address',
                    displayParams: {key: 'shipping'},
                    fieldDefinition: {
                        name: 'shipping_address_street',
                        vname: 'LBL_SHIPPING_ADDRESS_STREET',
                        type: 'varchar',
                        len: 150,
                        group: 'shipping_address',
                        comment: 'The street address used for for shipping purposes',
                        merge_filter: 'enabled',
                        required: false
                    }
                }]
            }, {
                cols: [{
                    name: 'description',
                    label: 'LBL_DESCRIPTION',
                    comment: 'Full text of the note',
                    fieldDefinition: {
                        name: 'description',
                        vname: 'LBL_DESCRIPTION',
                        type: 'text',
                        comment: 'Full text of the note',
                        rows: 6,
                        cols: 80,
                        required: false
                    },
                    type: 'text'
                }]
            }, {
                cols: [{
                    name: 'assigned_user_name',
                    label: 'LBL_ASSIGNED_TO',
                    fieldDefinition: {
                        name: 'assigned_user_name',
                        link: 'assigned_user_link',
                        vname: 'LBL_ASSIGNED_TO_NAME',
                        rname: 'user_name',
                        type: 'relate',
                        reportable: false,
                        source: 'non-db',
                        table: 'users',
                        id_name: 'assigned_user_id',
                        module: 'Users',
                        duplicate_merge: 'disabled',
                        required: false
                    },
                    type: 'relate'
                }]
            }]
        },
        {
            label: 'MORE INFORMATION',
            key: 'LBL_PANEL_ADVANCED',
            rows: [{
                cols: [{
                    name: 'account_type',
                    label: 'LBL_TYPE',
                    comment: 'The Company is of this type',
                    fieldDefinition: {
                        name: 'account_type',
                        vname: 'LBL_TYPE',
                        type: 'enum',
                        options: 'account_type_dom',
                        len: 50,
                        comment: 'The Company is of this type',
                        required: false
                    },
                    type: 'enum'
                }, {
                    name: 'industry',
                    label: 'LBL_INDUSTRY',
                    comment: 'The company belongs in this industry',
                    fieldDefinition: {
                        name: 'industry',
                        vname: 'LBL_INDUSTRY',
                        type: 'enum',
                        options: 'industry_dom',
                        len: 50,
                        comment: 'The company belongs in this industry',
                        merge_filter: 'enabled',
                        required: false
                    },
                    type: 'enum'
                }]
            }, {
                cols: [{
                    name: 'annual_revenue',
                    label: 'LBL_ANNUAL_REVENUE',
                    comment: 'Annual revenue for this company',
                    fieldDefinition: {
                        name: 'annual_revenue',
                        vname: 'LBL_ANNUAL_REVENUE',
                        type: 'varchar',
                        len: 100,
                        comment: 'Annual revenue for this company',
                        merge_filter: 'enabled',
                        required: false
                    },
                    type: 'varchar'
                }, {
                    name: 'employees',
                    label: 'LBL_EMPLOYEES',
                    comment: 'Number of employees, varchar to accomodate for both number (100) or range (50-100)',
                    fieldDefinition: {
                        name: 'employees',
                        vname: 'LBL_EMPLOYEES',
                        type: 'varchar',
                        len: 10,
                        comment: 'Number of employees, varchar to accomodate for both number (100) or range (50-100)',
                        required: false
                    },
                    type: 'varchar'
                }]
            }, {
                cols: [{
                    name: 'parent_name',
                    label: 'LBL_MEMBER_OF',
                    fieldDefinition: {
                        name: 'parent_name',
                        rname: 'name',
                        id_name: 'parent_id',
                        vname: 'LBL_MEMBER_OF',
                        type: 'relate',
                        isnull: 'true',
                        module: 'Accounts',
                        table: 'accounts',
                        massupdate: false,
                        source: 'non-db',
                        len: 36,
                        link: 'member_of',
                        unified_search: true,
                        importable: 'true',
                        required: false
                    },
                    type: 'relate'
                }]
            }, {
                cols: [{
                    name: 'campaign_name',
                    label: 'LBL_CAMPAIGN',
                    fieldDefinition: {
                        name: 'campaign_name',
                        rname: 'name',
                        vname: 'LBL_CAMPAIGN',
                        type: 'relate',
                        reportable: false,
                        source: 'non-db',
                        table: 'campaigns',
                        id_name: 'campaign_id',
                        link: 'campaign_accounts',
                        module: 'Campaigns',
                        duplicate_merge: 'disabled',
                        comment: 'The first campaign name for Account (Meta-data only)',
                        required: false
                    },
                    type: 'relate'
                }]
            }]
        },
        {
            label: 'OTHER',
            key: 'LBL_PANEL_ASSIGNMENT', rows: [{
                cols: [{
                    name: 'date_entered',
                    label: 'LBL_DATE_ENTERED',
                    customCode: '{$fields.date_entered.value} {$APP.LBL_BY} {$fields.created_by_name.value}',
                    fieldDefinition: {
                        name: 'date_entered',
                        vname: 'LBL_DATE_ENTERED',
                        type: 'datetime',
                        group: 'created_by_name',
                        comment: 'Date record created',
                        enable_range_search: true,
                        options: 'date_range_search_dom',
                        inline_edit: false,
                        required: false
                    },
                    type: 'datetime'
                }, {
                    name: 'date_modified',
                    label: 'LBL_DATE_MODIFIED',
                    customCode: '{$fields.date_modified.value} {$APP.LBL_BY} {$fields.modified_by_name.value}',
                    fieldDefinition: {
                        name: 'date_modified',
                        vname: 'LBL_DATE_MODIFIED',
                        type: 'datetime',
                        group: 'modified_by_name',
                        comment: 'Date record last modified',
                        enable_range_search: true,
                        options: 'date_range_search_dom', inline_edit: false, required: false
                    },
                    type: 'datetime'
                }]
            }]
        }]).pipe(shareReplay(1)),
} as RecordContentDataSource;

/* eslint-enable camelcase, @typescript-eslint/camelcase */

@Component({
    selector: 'record-content-test-host-component',
    template: '<scrm-record-content [dataSource]="state"></scrm-record-content>'
})
class RecordContentComponentTestHostComponent {
    state = dataSource;
}

describe('RecordContentComponent', () => {
    let testHostComponent: RecordContentComponentTestHostComponent;
    let testHostFixture: ComponentFixture<RecordContentComponentTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RecordContentComponentTestHostComponent,
                RecordContentComponent,
            ],
            imports: [
                DropdownButtonModule,
                ButtonModule,
                NgbDropdownModule,
                PanelModule,
                CloseButtonModule,
                MinimiseButtonModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: ThemeImagesStore, useValue: themeImagesStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(RecordContentComponentTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have panels', () => {

        expect(testHostComponent).toBeTruthy();
        const panels = testHostFixture.nativeElement.getElementsByClassName('panel-card');

        expect(panels).toBeTruthy();
        expect(panels.length).toEqual(3);
    });

    it('should have correct panel titles', () => {

        expect(testHostComponent).toBeTruthy();
        const panels = testHostFixture.nativeElement.getElementsByClassName('panel-card');

        expect(panels).toBeTruthy();
        expect(panels.length).toEqual(3);

        const accountInfoPanel = panels.item(0);
        const accountInfoPanelHeader = accountInfoPanel.getElementsByClassName('card-header').item(0);
        const advancedPanel = panels.item(1);
        const advancedPanelHeader = advancedPanel.getElementsByClassName('card-header').item(0);
        const assignmentPanel = panels.item(2);
        const assignmentPanelHeader = assignmentPanel.getElementsByClassName('card-header').item(0);

        expect(accountInfoPanelHeader).toBeTruthy();
        expect(accountInfoPanelHeader.textContent).toContain('OVERVIEW');
        expect(advancedPanelHeader).toBeTruthy();
        expect(advancedPanelHeader.textContent).toContain('MORE INFORMATION');
        expect(assignmentPanelHeader).toBeTruthy();
        expect(assignmentPanelHeader.textContent).toContain('OTHER');
    });

    it('panels should be collapsible', () => {

        expect(testHostComponent).toBeTruthy();
        const panels = testHostFixture.nativeElement.getElementsByClassName('panel-card');

        expect(panels).toBeTruthy();
        expect(panels.length).toEqual(3);

        const accountInfoPanel = panels.item(0);
        const accountInfoPanelButton = accountInfoPanel.getElementsByClassName('minimise-button').item(0);
        const advancedPanel = panels.item(1);
        const advancedPanelButton = advancedPanel.getElementsByClassName('minimise-button').item(0);
        const assignmentPanel = panels.item(2);
        const assignmentPanelButton = assignmentPanel.getElementsByClassName('minimise-button').item(0);

        expect(accountInfoPanelButton).toBeTruthy();
        expect(advancedPanelButton).toBeTruthy();
        expect(assignmentPanelButton).toBeTruthy();

        accountInfoPanelButton.click();
        advancedPanelButton.click();
        assignmentPanelButton.click();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            const accountInfoPanelBody = accountInfoPanel.getElementsByClassName('card-body').item(0);
            const advancedPanelBody = advancedPanel.getElementsByClassName('card-body').item(0);
            const assignmentPanelBody = assignmentPanel.getElementsByClassName('card-body').item(0);

            expect(accountInfoPanelBody).toBeTruthy();
            expect(accountInfoPanelBody.className).not.toContain('show');
            expect(advancedPanelBody).toBeTruthy();
            expect(advancedPanelBody.className).not.toContain('show');
            expect(assignmentPanelBody).toBeTruthy();
            expect(assignmentPanelBody.className).not.toContain('show');
        });
    });
});
