import { BrowninglogicNgModalDemoPage } from './app.po';

describe('@browninglogic/ng-modal-demo App', () => {
  let page: BrowninglogicNgModalDemoPage;

  beforeEach(() => {
    page = new BrowninglogicNgModalDemoPage ();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
