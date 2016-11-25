import Ember from 'ember';

const { RSVP } = Ember;
const { Promise } = RSVP;

/**
 * Reads and writes appSettings with the most persistent and secure
 * available option in a promise-based manner.
 *
 * In cordova-application it uses `cordova-plugin-nativestorage` to save data in
 * the plattform-offered setting keyvalue/stores. In the browser it just stores
 * data in localStorage.
 *
 * Do NOT use this if you wish to store huge amounts of data. Querying data isn't
 * supported. This service is particulary targeted agains user-settings you wish
 * to carry over restarts/updates and not caching in general.
 *
 * @public
 * @extends Ember.Service
 */
export default Ember.Service.extend({

  /**
   * Indicates whether or not native storage is available.
   *
   * @property nativeStorageAvailable
   * @private
   * @type {Boolean}
   */
  nativeStorageAvailable: false,

  /**
   * @method init
   * @private
   */
  init() {
    this._super(...arguments);
    this.set('nativeStorageAvailable', window.cordova && window.NativeStorage && true);
  },

  /**
   * Receive the object with given key.
   *
   * If legacy is not set, the key is being searched in nativeStorage if
   * available, else it will always look that up in local storage.
   *
   * Returns a promise which fullfills to the stored value.
   *
   * If the given key does not exist, this will return `null`.
   *
   * @method read
   * @public
   * @param {String} key
   * @param {Boolean} legacy
   * @return {Promise} promise
   */
  read(key, legacy) {
    if (legacy || !this.get('nativeStorageAvailable')) {
      return Promise.resolve(JSON.parse(window.localStorage.getItem(key)));
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.getItem(key, resolve, (error) => {

        // To align the behaviour with localStorage
        if (error.code === window.NativeStorage.NATIVE_WRITE_FAILED) {
          return resolve(null);
        }

        return reject(error);
      });
    });
  },

  /**
   * Sets a given key to a given value.
   *
   * Returns the given value via a Promise for chaining-purposes.
   *
   * @method write
   * @public
   * @param {String} key
   * @param {Object} value
   * @return {Promise} promise
   */
  write(key, value) {
    if (!this.get('nativeStorageAvailable')) {
      window.localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve(value);
    }

    return new Promise((resolve, reject) => {
      window.NativeStorage.setItem(key, value, resolve, reject);
    });
  },

  /**
   * Delets a given key.
   *
   * @method remove
   * @public
   * @param {String} key
   */
  remove(key, legacy) {
    if (legacy || !this.get('nativeStorageAvailable')) {
      window.localStorage.removeItem(key);
      return;
    }

    window.NativeStorage.remove(key);
  },

  /**
   * Deletes all available keys.
   *
   * For.....*dramatic music*....ever!
   *
   * @method clear
   * @public
   */
  clear() {
    if (!this.get('nativeStorageAvailable')) {
      window.localStorage.clear();
      return;
    }

    window.NativeStorage.clear();
  }

});
