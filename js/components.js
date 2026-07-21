/*=========================================
            COMPONENTES
=========================================*/

function createMatchCard(match) {

    let score = "-";

    if (
        match.score &&
        match.score.fullTime &&
        match.score.fullTime.home !== null &&
        match.score.fullTime.away !== null
    ) {

        score = `${match.score.fullTime.home} - ${match.score.fullTime.away}`;

    }

    let badge = "";

    switch (match.status) {

        case "LIVE":
        case "IN_PLAY":
            badge = `<span class="badge live">🔴 EN VIVO</span>`;
            break;

        case "PAUSED":
            badge = `<span class="badge live">⏸ DESCANSO</span>`;
            break;

        case "FINISHED":
            badge = `<span class="badge finished">✔ FINALIZADO</span>`;
            break;

        default:
            badge = `<span class="badge scheduled">📅 PROGRAMADO</span>`;
    }

    const date = new Date(match.utcDate);

    return `

<div class="match-card fade-in">

    <div class="match-header">

        ${badge}

        <span class="match-time">

            ${date.toLocaleDateString()}<br>

            ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}

        </span>

    </div>

    <div class="match-body">

        <div class="team">

            <img
                src="${match.homeTeam.crest}"
                alt="${match.homeTeam.name}"
                class="team-logo">

            <h3>${match.homeTeam.name}</h3>

        </div>

        <div class="score">

            ${score}

        </div>

        <div class="team">

            <img
                src="${match.awayTeam.crest}"
                alt="${match.awayTeam.name}"
                class="team-logo">

            <h3>${match.awayTeam.name}</h3>

        </div>

    </div>

    <div class="match-footer">

        <strong>

            Jornada:

        </strong>

        ${match.matchday ?? "-"}

        <br>

        <strong>

            Competición:

        </strong>

        ${match.competition.name}

    </div>

</div>

`;

}
function initializeTabs(){

const tabs=

document.querySelectorAll(".tab");

const contents=

document.querySelectorAll(".tabContent");

tabs.forEach(tab=>{

tab.addEventListener("click",()=>{

tabs.forEach(t=>

t.classList.remove("active"));

contents.forEach(c=>

c.classList.remove("active"));

tab.classList.add("active");

document

.getElementById(

tab.dataset.tab

)

.classList.add("active");

});

});

}
function createStandingRow(team) {

    let rowClass = "";

    // Colores según la posición
    if (team.position <= 4) {

        rowClass = "champions";

    } else if (team.position <= 6) {

        rowClass = "europa";

    } else if (team.position === 7) {

        rowClass = "conference";

    } else if (team.position >= 18) {

        rowClass = "relegation";

    }

    return `

<tr>

<td>

<div class="position ${rowClass}">

${team.position}

</div>

</td>

<td class="team-cell">

<img
class="team-logo"
src="${team.team.crest}"
alt="${team.team.name}"
loading="lazy">

<span>

${team.team.name}

</span>

</td>

<td><strong>${team.points}</strong></td>

<td>${team.playedGames}</td>

<td>${team.won}</td>

<td>${team.draw}</td>

<td>${team.lost}</td>

<td>${team.goalsFor}</td>

<td>${team.goalsAgainst}</td>

<td>${team.goalDifference}</td>

</tr>

`;

}
function createScorerRow(player,pos){

return`

<tr>

<td>

${pos}

</td>

<td>

${player.player.name}

</td>

<td>

${player.team.name}

</td>

<td>

<b>

${player.goals}

</b>

</td>

</tr>

`;

}