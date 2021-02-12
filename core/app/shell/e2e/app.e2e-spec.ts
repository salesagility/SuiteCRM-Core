import {AppPage} from './app.po';

describe('SuiteCRM App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display login form', () => {
    page.navigateTo();
    expect(page.getLoginForm()).toEqual('login');
  });
});
