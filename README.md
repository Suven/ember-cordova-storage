# ember-cordova-storage

Reads and writes appSettings with the most persistent and secure available
option in a promise-based manner.

In cordova-application it uses `cordova-plugin-nativestorage` to save data in
the platform-offered setting key/value-stores. In the browser it just stores
data in localStorage.

Do NOT use this if you wish to store huge amounts of data. Querying data isn't
supported. This service is particulary targeted against user-settings you wish
to carry over restarts/updates and not caching in general.

## Prerequisite

Although this does not rely on cordova at runtime and works fine in the browser,
the add-on assumes you are building your application with
[ember-cordova](https://github.com/isleofcode/ember-cordova).

## Installation

* `ember install ember-cordova-storage`

## Usage

TODO

## Thanks

Some parts of this plugin do use code from [ember-cordova-keyboard](https://github.com/isleofcode/ember-cordova-keyboard).
