import { AngularFire1Page } from './app.po';

describe('angular-fire1 App', function() {
  let page: AngularFire1Page;

  beforeEach(() => {
    page = new AngularFire1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
