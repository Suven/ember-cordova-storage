import { moduleFor, test } from 'ember-qunit';

moduleFor('service:cordova/storage', 'Unit | Service | cordova/storage', { });

test('service exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});


test('read and write different datatypes', function(assert) {
  let service = this.subject();

  service.write('foo', '123')
    .then(() => service.read('foo'))
    .then((value) => assert.equal(value, '123', 'string'));

  service.write('bar', 123)
    .then(() => service.read('bar'))
    .then((value) => assert.equal(value, 123, 'int'));

  service.write('kappa', [ 1,2,3 ])
    .then(() => service.read('kappa'))
    .then((value) => assert.deepEqual(value, [ 1,2,3 ], 'array'));

  service.write('pogchamp', { andNowImA: 'believer' })
    .then(() => service.read('pogchamp'))
    .then((value) => assert.deepEqual(value, { andNowImA: 'believer' }, 'object'));

});

test('not existing keys return null', function(assert) {
  let service = this.subject();

  // Make sure we are starting fresh
  service.clear();

  // Access smth invalid
  service.read('foo').then((value) => {
    assert.equal(value, null, 'never existed');
  });

  // Write smth and remove it
  service.write('bar', 123)
    .then(() => service.read('bar'))
    .then((value) => {
      assert.equal(value, 123, 'could write once');

      // Then delete the key
      service.remove('bar');

      // Then try to read it again
      return service.read('bar');
    })
    .then((value) => assert.equal(value, null, 'was deleted before'));

  // Clear everything
  service.write('kappa', 123)
    .then(() => {
      service.clear();
      return service.read('kappa');
    })
    .then((value) => assert.equal(value, null, 'clear was invoked'));
});
