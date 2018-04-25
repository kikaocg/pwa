(function () {
    'use strict';
    let swPush;
    const applicationServerPublicKey = 'BH9adO8NxsP9AlP4L7T_qkabd1SVLJ4wznboOZ4t4pf0DfvoODcQ_P4ywE-wEJqJAJvXwJyHMONs8Esqx_ARfd8';
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if('serviceWorker' in navigator && 'PushManager' in window){
        window.addEventListener('load', function(){
            navigator.serviceWorker.register('sw-event-news.js').then(function(swRegister){
                swPush = swRegister;
                getSubscription();
            });
        });
    }

    function getSubscription() {
        if (swPush) {
            swPush.pushManager.getSubscription()
                .then(function (subscriptin) {
                    if (subscriptin) {
                        console.log('User is subscribed.');
                        console.log(JSON.stringify(subscriptin));
                    } else {
                        console.log("User is NOT subscribed.");
                        registerUser();
                    }
                });
        }
    }

    function registerUser() {
        swPush.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        }).then(function (subscriptin) {
            console.log(JSON.stringify(subscriptin));
        });
    }

})();