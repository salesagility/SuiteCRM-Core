import { NavbarModel } from './navbar-model';
import { LogoAbstract } from '../logo/logo-abstract';

export class NavbarAbstract implements NavbarModel {
  authenticated = true;
  logo = new LogoAbstract();
  useGroupTabs = true;
  globalActions = [
    {
      'link': {
        'url': '',
        'label': 'Employees'
      }
    },
    {
      'link': {
        'url': '',
        'label': 'Admin'
      }
    },
    {
      'link': {
        'url': '',
        'label': 'Support Forums'
      }
    },
    {
      'link': {
        'url': '',
        'label': 'About'
      }
    }
  ];
  currentUser = {
    id: '1',
    name: 'Will Rennie',
  };
  all = {
    modules: [],
    extra: [],
  };
  menu = [
    {
      "link": {
        "label": "Accounts",
        "url": ''
      },
      "submenu":
        [
          {
            "link": {
              "label": "Create Account",
              "url": "",
              "iconRef": {"resolved": "home_page"}
            },
            "icon": "plus",
            "submenu": [],

          },
          {
            "link": {
              "label": "View Account", "url": "/#/Accounts/index"
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Accounts", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Contacts", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Contact",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Contact", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Contacts", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Opportunities", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Opportunity",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Opportunity", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Opportunities", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Leads", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Lead",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Lead", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Leads", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Quotes", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Quote",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Quote", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Quotes", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Calendar", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Calendar",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Calendar", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Calendars", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Documents", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Document",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Document", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Documents", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Emails", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Email",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Email", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Emails", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    },
    {
      "link": { "label": "Spots", "url": '' }, "icon": "home_page",
      "submenu":
        [
          {
            "link": {
              "label": "Create Spot",
              "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "View Spot", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
          {
            "link": {
              "label": "Import Spots", "url": ""
            },
            "icon": "plus",
            "submenu": []
          },
        ]
    }
  ];
}