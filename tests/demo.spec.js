
var creds = require('.creds.json');

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
          .sendKeys(creds.username);
        browser
          .findElement(browser.select('#pass'))
          .sendKeys(creds.password);
        browser
          .findElement(browser.select('#loginbutton > input'))
          .sendKeys(browser.keys.ENTER);
        browser
          .get('https://www.facebook.com/')
          .then(() => {
            browser
              .getTitle()
              .then((title) => {
                expect(title).toEqual('Facebook');
                done();
              });
          });
      });

  });
});
