export default function registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
        if (navigator.serviceWorker.controller) {
            console.log('Active service worker found, no need to register');
        } else {
            navigator.serviceWorker
                .register('sw.js')
                .then((reg) => {
                    console.log('Service worker has been registered, scope: ' + reg.scope);
                    return navigator.serviceWorker.ready;
                })
                .catch(err => console.log(err));
        }
    }
}
