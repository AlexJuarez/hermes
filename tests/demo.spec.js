
describe('Login to facebook.com', () => {
  it('should login as me', (done) => {
    browser
      .get('https://www.facebook.com');
    browser
      .getTitle()
      .then((title) => {
        expect(title).toEqual('Facebook');
        done();
      });
  });
});
