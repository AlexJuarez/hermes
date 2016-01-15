
describe('Login to facebook.com', () => {
  it('should login as me', (done) => {
    browser
      .manage()
      .window()
      .maximize();
    browser
      .get('https://www.facebook.com/');
    browser
      .getTitle()
      .then((title) => {
        expect(title).toEqual('Facebook - Log In or Sign Up');
        browser
          .findElement(browser.select('#email'))
          .sendKeys('***REMOVED***');
        browser
          .findElement(browser.select('#pass'))
          .sendKeys('***REMOVED***');
        browser
          .findElement(browser.select('#loginbutton > input'))
          .sendKeys(browser.keys.ENTER);
        browser
          .get('https://www.facebook.com/?_rdr=p')
          .then(done);

        /*browser
          .getTitle()
          .then((title) => {
            expect(title).toEqual('Facebook');
          });*/
      });

  });
});
