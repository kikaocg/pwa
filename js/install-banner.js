(function(){
    'use strict';

    let eventInstall;
    let btInstall = document.getElementById('btn-install');
    btInstall.style.display = "none";
    window.addEventListener('beforeinstallprompt', function(event){
        eventInstall = event;
        event.preventDefault();
        btInstall.style.display = "initial";
    });

    btInstall.onclick = function () {
        if (eventInstall){
            eventInstall.prompt();
            eventInstall.userChoice.then(function(choiceResult){
                if(choiceResult === "dismissed"){
                    alert("Quem sabe na próxima");
                } else {
                    alert("Aproveite os eventos!");
                }
            });

            eventInstall = null;
            btInstall.hide();
        }
    };
})();