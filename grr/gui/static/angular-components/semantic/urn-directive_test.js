'use strict';

goog.require('grrUi.semantic.module');
goog.require('grrUi.tests.browserTrigger');
goog.require('grrUi.tests.module');

var browserTrigger = grrUi.tests.browserTrigger;

describe('urn directive', function() {
  var $compile, $rootScope, grrRoutingService;

  beforeEach(module('/static/angular-components/semantic/urn.html'));
  beforeEach(module(grrUi.semantic.module.name));
  beforeEach(module(grrUi.tests.module.name));

  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    grrRoutingService = $injector.get('grrRoutingService');
  }));

  var renderTestTemplate = function(value) {
    $rootScope.value = value;

    var template = '<grr-urn value="value" />';
    var element = $compile(template)($rootScope);
    $rootScope.$apply();

    return element;
  };

  it('does not show anything when value is empty', function() {
    var element = renderTestTemplate(null);
    expect(element.text().trim()).toBe('');
  });

  it('shows non-client-scoped string value as plain string', function() {
    var element = renderTestTemplate('aff4:/foo/bar');
    expect(element.text().trim()).toBe('aff4:/foo/bar');
    expect(element.find('a').length).toBe(0);
  });

  it('shows non-client-scoped typed value as plain string', function() {
    var element = renderTestTemplate({
      type: 'RDFURN',
      value: 'aff4:/foo/bar'
    });
    expect(element.text().trim()).toBe('aff4:/foo/bar');
    expect(element.find('a').length).toBe(0);
  });

  it('shows client-scoped string value as link', function() {
    var element = renderTestTemplate('aff4:/C.0001000200030004/foo/bar');
    expect(element.find('a').text().trim()).toBe(
        'aff4:/C.0001000200030004/foo/bar');
  });

  it('shows client-scoped typed value as link', function() {
    var element = renderTestTemplate({
      type: 'RDFURN',
      value: 'aff4:/C.0001000200030004/foo/bar'
    });

    expect(element.find('a').text().trim()).toBe(
        'aff4:/C.0001000200030004/foo/bar');
  });

  it('client-scoped link points to virtual filesystem browser', function() {
    spyOn(grrRoutingService, 'href').and.returnValue('#foobar');

    var element = renderTestTemplate('aff4:/C.0001000200030004/foo/bar');
    expect(element.find('a').attr('href')).toBe('#foobar');
    expect(grrRoutingService.href).toHaveBeenCalledWith(
        'client.vfs',
        {clientId: 'C.0001000200030004', path: 'foo/bar'});
  });

  it('client-scoped links handle non-URL friendly characters', function() {
    spyOn(grrRoutingService, 'href').and.returnValue('#foobar');

    var element = renderTestTemplate('aff4:/C.0001000200030004/_f$o/bA%');
    expect(element.find('a').attr('href')).toBe(
        '#foobar');
    expect(grrRoutingService.href).toHaveBeenCalledWith(
        'client.vfs',
        {clientId: 'C.0001000200030004', path: '_f$o/bA%'});
  });
});
