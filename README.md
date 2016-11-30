# ember-cordova-storage

Reads and writes appSettings with the most persistent and secure available
option in a promise-based manner.

In cordova-application it uses `cordova-plugin-nativestorage` to save data in
the platform-offered setting key/value-stores. In the browser it just stores
data in localStorage.

## Things you need to be aware of

Do **NOT** use this if you wish to store huge amounts of data. Querying data isn't
supported. This service is particulary targeted against user-settings you wish
to carry over restarts/updates and not caching in general.

Also make sure you are **not** using the service before `deviceReady`, or else
you will end up using localStorage only (since that is the only thing available)
before `deviceReady`.

## Prerequisite

Although this does not rely on cordova at runtime and works fine in the browser,
the add-on assumes you are building your application with
[ember-cordova](https://github.com/isleofcode/ember-cordova).

## Installation

* `ember install ember-cordova-storage`

## Usage

Just inject the service and you are ready to start:

```
export default Ember.Route.extend({
  storage: Ember.inject.service('cordova/storage'),

  setupController() {
    this.get('storage')
      .write('pogchamp', Date.now())
      .then(() => this.get('storage').read('pogchamp'))
      .then((val) => Ember.debug(`Read ${val} for key pogchamp. That was ${Date.now() - val}ms ago`))
      .catch(console.log);
  }
});
```

#### write(key, value)

Writes a given `value` to a `key` and returns the written value as soon as writing
finished via a `Promise`.

You are free to store strings, ints, objects, booleans, arrays and so on. But be
aware that some object-attributes might get missing as the actually stored value
will `JSON.strinfify`ed.

#### read(key, legacy = false)

Reads a given `key` (always a string) and returns its value inside a `Promise`.

With `legacy` you can toggle if you always wish to use localStorage, even if
nativeStorage would be available.

If `legacy` is set, the value will also be returned as is and not tried to be
`JSON.parse`ed. This is because we can not safely make the assumption that legacy
values were `JSON.strinfify`ed in the first place.

If a key did not yet exist, this will return `null`.

#### clear()

Removes all keys from the storage. Like.. all of them.. Forever.. No turning back.

#### remove(key, legacy = false)

Removes the given `key` from the storage.

With `legacy` you can toggle if you always wish to clear in localStorage, even if
nativeStorage would be available.

## Thanks

Some parts of this plugin do use code from [ember-cordova-keyboard](https://github.com/isleofcode/ember-cordova-keyboard).
