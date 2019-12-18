import {Component, OnInit, HostListener} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {ApiService} from '../../services/api/api.service';
import {NavbarModel} from './navbar-model';
import {NavbarAbstract} from './navbar.abstract';
import {SvgFilenameMapModel} from '../svg-icon/svg-filename-map-model';

@Component({
  selector: 'scrm-navbar-ui',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarUiComponent implements OnInit {
  constructor(protected api: ApiService, protected router: Router) {
    NavbarUiComponent.instances.push(this);
  }

  protected static instances: NavbarUiComponent[] = [];

  loaded = true;

  mainNavCollapse = true;
  subItemCollapse = true;
  subNavCollapse = true;
  mobileNavbar = false;
  mobileSubNav = false;
  backLink = false;
  mainNavLink = true;
  parentNavLink: string = '';
  submenu: any = [];

  navbar: NavbarModel = new NavbarAbstract();

  public changeSubNav(event: Event, parentNavItem) {
    this.mobileSubNav = !this.mobileSubNav;
    this.backLink = !this.backLink;
    this.mainNavLink = !this.mainNavLink;
    this.submenu = parentNavItem.submenu;
  }

  public navBackLink(event: Event) {
    this.mobileSubNav = !this.mobileSubNav;
    this.backLink = !this.backLink;
    this.mainNavLink = !this.mainNavLink;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    event.target.innerWidth;
    if (innerWidth <= 768) {
      this.mobileNavbar = true;
    } else {
      this.mobileNavbar = false;
    }
  }

  static reset() {
    NavbarUiComponent.instances.forEach((navbarComponent: NavbarUiComponent) => {
      navbarComponent.loaded = false;
      navbarComponent.navbar = new NavbarAbstract();
    });
  }

  protected setNavbar(navbar: NavbarModel) {
    this.navbar = navbar;
    this.api.getSvgFilenameMap((svgFilenameMaps: SvgFilenameMapModel[]) => {
      this.navbar.svgFilenameMaps = svgFilenameMaps;
    });
    this.loaded = true;
  }

  protected isLoaded() {
    return this.loaded;
  }

  ngOnInit(): void {
    let navbar = new NavbarAbstract();
    this.setNavbar(navbar);
    window.dispatchEvent(new Event("resize"));
  }
}
