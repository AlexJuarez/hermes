
describe('Login to facebook.com', () => {
  it('should login as me', (done) => {
    Promise.all([
      browser
        .get('https://www.facebook.com/'),
      browser
        .getTitle()
        .then((title) => {
          expect(title).toEqual('Facebook - Log In or Sign Up');
          done();
        }),
      browser
        .findElement(browser.select('#email'))
        .sendKeys('***REMOVED***'),
      browser
        .findElement(browser.select('#pass'))
        .sendKeys('***REMOVED***'),
      browser
        .findElement(browser.select('#loginbutton > input'))
        .sendKeys(browser.keys.ENTER)
    ]).finally(done);
  });
});
