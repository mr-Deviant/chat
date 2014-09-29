'use strict';

describe('Service: login', function () {

  // load the service's module
  beforeEach(module('chatApp'));

  // instantiate service
  var loginFactory;
  beforeEach(inject(function (_loginFactory_) {
    loginFactory = _loginFactory_;
  }));

  it('should do something', function () {
    expect(!!loginFactory).toBe(true);
  });

});
