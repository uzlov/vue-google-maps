import lazy from '../utils/lazy-value'

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function (loadGmapApi, GmapApi) {
  return function promiseLazyCreator (options) {
    // Things to do once the API is loaded
    function onApiLoaded () {
      GmapApi.gmapApi = {}
      return window.google
    }

    if (options.load) { // If library should load the API
      return lazy(() => { // Load the
        // This will only be evaluated once
        if (typeof window === 'undefined') { // server side -- never resolve this promise
          return new Promise(() => {}).then(onApiLoaded)
        } else {
          const nonceCookie = options.nonceCookie ? getCookie(options.nonceCookie) : undefined
          return new Promise((resolve, reject) => {
            try {
              window.vueGoogleMapsInit = resolve
              loadGmapApi(options.load, options.loadCn, nonceCookie)
            } catch (err) {
              reject(err)
            }
          }).then(onApiLoaded)
        }
      })
    } else { // If library should not handle API, provide
      // end-users with the global `vueGoogleMapsInit: () => undefined`
      // when the Google Maps API has been loaded
      const promise = new Promise((resolve) => {
        if (typeof window === 'undefined') {
          // Do nothing if run from server-side
          return
        }
        window.vueGoogleMapsInit = resolve
      }).then(onApiLoaded)

      return lazy(() => promise)
    }
  }
}
