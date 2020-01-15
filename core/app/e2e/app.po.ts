import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getLoginForm() {
    return element(by.css('app-root scrm-login-ui form')).getAttribute('name');
  }
}
