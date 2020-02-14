import { NavbarModel } from './navbar-model';
import { LogoAbstract } from '../logo/logo-abstract';

export class NavbarAbstract implements NavbarModel {
  authenticated = true;
  logo = new LogoAbstract();
  useGroupTabs = true;
  globalActions = [
    {
      link: {
        url: '',
        label: 'Employees'
      }
    },
    {
      link: {
        url: '',
        label: 'Admin'
      }
    },
    {
      link: {
        url: '',
        label: 'Support Forums'
      }
    },
    {
      link: {
        url: '',
        label: 'About'
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
  menu = [];

  public buildMenu(items: {}, threshold: number): void {
    const navItems = [];
    const moreItems = [];

    if (!items || Object.keys(items).length === 0) {
      this.menu = navItems;
      this.all.extra = moreItems;
    }

    let count = 0;
    Object.keys(items).forEach(module => {

      if (count <= threshold) {
        navItems.push(this.buildMenuItem(module, items[module]));
      } else {
        moreItems.push(this.buildMenuItem(module, items[module]));
      }

      count++;
    });

    this.menu = navItems;
    this.all.modules = moreItems;
  }

  public buildMenuItem(module: string, label: string): any {

    return {
      link: { label, url: `./#/${module}/index` }, icon: 'home_page',
      submenu:
          [
            {
              link: {
                label: `Create ${label}`,
                url: `./#/${module}/edit`
              },
              icon: 'plus',
              submenu: []
            },
            {
              link: {
                label: `View ${label}`,
                url: `./#/${module}/list`
              },
              icon: 'view',
              submenu: []
            },
            {
              link: {
                label: `Import ${label}`,
                url: `./#/${module}/import`
              },
              icon: 'upload',
              submenu: []
            },
          ]
    };
  }

}
