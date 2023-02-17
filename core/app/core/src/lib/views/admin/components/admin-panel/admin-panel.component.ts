/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component} from '@angular/core';
import {SystemConfigStore} from '../../../../store/system-config/system-config.store';


@Component({
    selector: 'scrm-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: [],
})
export class AdminPanelComponent {

    mockData:Array<any> = [
        {
            icon: 'icon_users_and_authentication',
            title: 'Users & Authentication',
            titleDesc: 'Create, edit, activate and deactivate users in SuiteCRM.',
            links: [
                {
                    title:'User Management',
                    titleDesc:'Manage user accounts and passwords',
                    path:'/'
                },
                {
                    title:'Role Management',
                    titleDesc:'Manage role membership and properties',
                    path:'/'
                },
                {
                    title:'Password Management',
                    titleDesc:'Manage password requirements and expiration',
                    path:'/'
                },
                {
                    title:'OAuth2 Clients and Tokens',
                    titleDesc:'Manage which clients have access to the OAuth2 Server and view session log and revoke active sessions',
                    path:'/'
                },
                {
                    title:'OAuth Keys',
                    titleDesc:'OAuth key management',
                    path:'/'
                },
                {
                    title:'Security Suite Group Management',
                    titleDesc:'Security Suite Group Editor',
                    path:'/'
                },
                {
                    title:'Security Suite Settings',
                    titleDesc:'Configure Security Suite settings such as group inheritance, additive security, etc',
                    path:'/'
                }
            ]
        },
        {
            icon: 'icon_system',
            title: 'System',
            titleDesc: 'Configure the system-wide settings according to the specifications of your organization. Users can override some of the default locale settings within their user settings page.',
            links: [
                {
                    title: 'System Settings',
                    titleDesc: 'Configure system-wide settings',
                    path:'/'
                },
                {
                    title: 'Currencies',
                    titleDesc: 'Set up currencies and conversion rates',
                    path:'/'
                },
                {
                    title: 'Languages',
                    titleDesc: 'Manage which languages are available for users',
                    path:'/'
                },
                {
                    title: 'Locale',
                    titleDesc: 'Set default localization settings for your system',
                    path:'/'
                },
                {
                    title: 'PDF Settings',
                    titleDesc: 'Change PDF Settings',
                    path:'/'
                },
                {
                    title: 'Search Settings',
                    titleDesc: 'Configure the global search preferences for the system',
                    path:'/'
                },
                {
                    title: 'Elasticsearch',
                    titleDesc: 'Configure Elasticsearch preferences',
                    path:'/'
                },
                {
                    title: 'Scheduler',
                    titleDesc: 'Set up scheduled events',
                    path:'/'
                },
                {
                    title: 'Themes',
                    titleDesc: 'Choose themes for users to be able to select',
                    path:'/'
                },
            ]
        },
        {
            icon: 'icon_module_settings',
            title: 'Module Settings',
            titleDesc: 'Configure Module specifics and settings',
            links: [
                {
                    title: 'Activity Stream Settings',
                    titleDesc: 'Enable the user feed and module feeds for the My Activity Stream dashlet',
                    path:'/'
                },
                {
                    title: 'Business hours',
                    titleDesc: 'Restrict Workflow & Case automations to certain days and times',
                    path:'/'
                },
                {
                    title: 'Case Module Settings',
                    titleDesc: 'Change settings for Cases and the Cases Portal',
                    path:'/'
                },
                {
                    title: 'Configure Module Menu Filters',
                    titleDesc: 'Create and edit module menu filters',
                    path:'/'
                },
                {
                    title: 'Connectors',
                    titleDesc: 'Manage connector settings',
                    path:'/'
                },
                {
                    title: 'Display Modules and Subpanels',
                    titleDesc: 'Choose which modules are displayed in the navigation bar and which subpanels are displayed system-wide',
                    path:'/'
                },
                {
                    title: 'History Subpanel',
                    titleDesc: 'Enable/Disable contacts\' emails in history',
                    path:'/'
                },
                {
                    title: 'Sales Module Settings',
                    titleDesc: 'Change settings for Quotes, Contracts and Invoices',
                    path:'/'
                },
                {
                    title: 'Releases',
                    titleDesc: 'Manage releases and versions',
                    path:'/'
                },
            ]
        },
        {
            icon: 'icon_email',
            title: 'Email',
            titleDesc: 'Manage outbound and inbound emails. The email settings must be configured in order to enable users to send out email and newsletter campaigns.',
            links: [
                {
                    title: 'Email Settings',
                    titleDesc: 'Configure email settings',
                    path:'/'
                },
                {
                    title: 'Inbound Email',
                    titleDesc: 'Set up group mail accounts for monitoring inbound email and manage personal inbound mail account information for users',
                    path:'/'
                },
                {
                    title: 'Outbound Email',
                    titleDesc: 'Configure outbound email settings',
                    path:'/'
                },
                {
                    title: 'External OAuth Connections',
                    titleDesc: 'Setup external OAuth connections',
                    path:'/'
                },
                {
                    title: 'Campaign Email Settings',
                    titleDesc: 'Configure email settings for campaigns',
                    path:'/'
                },
                {
                    title: 'Email Queue',
                    titleDesc: 'Manage the outbound email queue',
                    path:'/'
                },
            ]
        },
        {
            icon: 'icon_admin_tools',
            title: 'Admin Tools',
            titleDesc: 'Repair, backup and run diagnosis on your SuiteCRM instance',
            links: [
                {
                    title: 'Repair',
                    titleDesc: 'Check and repair SuiteCRM',
                    path:'/'
                },
                {
                    title: 'Backups',
                    titleDesc: 'Backup SuiteCRM files',
                    path:'/'
                },
                {
                    title: 'Diagnostic Tool',
                    titleDesc: 'Capture system configuration for diagnostics and analysis',
                    path:'/'
                },
                {
                    title: 'Import Wizard',
                    titleDesc: 'Use the import wizard to easily import records into the system',
                    path:'/'
                },
                {
                    title: 'Module Loader',
                    titleDesc: 'Add or remove SuiteCRM modules, themes, language packs and other extensions',
                    path:'/'
                },
            ]
        },
        {
            icon: 'icon_developer_tools',
            title: 'Developer Tools',
            titleDesc: 'Create and edit modules and module layouts, manage standard and custom fields and configure tabs.',
            links: [
                {
                    title: 'Studio',
                    titleDesc: 'Customize module fields, layouts and relationships',
                    path:'/'
                },
                {
                    title: 'Rename Modules',
                    titleDesc: 'Change the names of the modules appearing within the application',
                    path:'/'
                },
                {
                    title: 'Module Builder',
                    titleDesc: 'Build new modules to expand the functionality of SuiteCRM',
                    path:'/'
                },
                {
                    title: 'Dropdown Editor',
                    titleDesc: 'Add, delete, or change the dropdown lists',
                    path:'/'
                },
                {
                    title: 'Workflow Manager',
                    titleDesc: 'Manage, Add, delete or change Workflow processes',
                    path:'/'
                }
            ]
        },
        {
            icon: 'icon_google_suite',
            title: 'Google Suite',
            titleDesc: 'Manage your Google Suite Integration.',
            links: [
                {
                    title: 'Google Calendar Settings',
                    titleDesc: 'Configuration settings to adjust your Google Calendar',
                    path:'/'
                },
                {
                    title: 'Google Maps Settings',
                    titleDesc: 'Configuration settings to adjust your Google Maps',
                    path:'/'
                },
                {
                    title: 'Geocoded Counts',
                    titleDesc: 'Shows the number of module objects geocoded, grouped by geocoding response',
                    path:'/'
                },
                {
                    title: 'Geocoding Test',
                    titleDesc: 'Run a single geocoding test with detailed display results.',
                    path:'/'
                },
                {
                    title: 'Geocode Addresses',
                    titleDesc: 'Geocode your object addreses. This process may take a few minutes!',
                    path:'/'
                },
                {
                    title: 'Address Cache',
                    titleDesc: 'Provides access to Address Cache information. This is only cache.',
                    path:'/'
                },
            ]
        }
    ];

    constructor(protected configs: SystemConfigStore) {
    }

}
