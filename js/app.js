/*=========================================
    Football Europe Live
    app.js
=========================================*/

let currentLeague = CONFIG.DEFAULT_LEAGUE;

let refreshTimer = null;


/*=========================================
            INICIO
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    init();

});


/*=========================================
            INICIALIZAR
=========================================*/

async function init(){

    initializeTabs();

    initializeEvents();

    await loadLeague(currentLeague);

    startAutoRefresh();

}


/*=========================================
            EVENTOS
=========================================*/

function initializeEvents(){

    document
    .querySelectorAll(".league-item")
    .forEach(btn => {

        btn.addEventListener("click", async () => {

            document
            .querySelectorAll(".league-item")
            .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            currentLeague = btn.dataset.league;

            await loadLeague(currentLeague);

        });

    });

}
/*=========================================
        AUTO REFRESH
=========================================*/

function startAutoRefresh(){

    if(refreshTimer){

        clearInterval(refreshTimer);

    }

    refreshTimer = setInterval(()=>{

        loadLeague(currentLeague, true);

    }, CONFIG.AUTO_REFRESH);

}
/*=========================================
        CARGAR INFORMACIÓN
=========================================*/

async function loadLeague(code, silent = false){

    try{

        if(!silent){
            UI.showLoading();
        }

        UI.hideError();

        const [

            matches,

            standings,

            scorers

        ] = await Promise.all([

            footballAPI.matches(code),

            footballAPI.standings(code),

            footballAPI.scorers(code)

        ]);

        UI.renderMatches(matches.matches);

        UI.renderStandings(standings);

        UI.renderScorers(scorers);

        if(!silent){
            UI.hideLoading();
        }

    }

    catch(error){

        console.error(error);

        if(!silent){
            UI.hideLoading();
        }

        UI.showError();

    }

}