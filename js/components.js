/*=========================================
            COMPONENTES
=========================================*/

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function emptyState(icon, text) {
    return `
<div class="empty-state">
    <i class="${icon}"></i>
    <span>${escapeHTML(text)}</span>
</div>`;
}

function createMatchCard(match, index = 0) {

    const hasScore =
        match.score &&
        match.score.fullTime &&
        match.score.fullTime.home !== null &&
        match.score.fullTime.away !== null;

    const score = hasScore
        ? `${match.score.fullTime.home} : ${match.score.fullTime.away}`
        : "VS";

    let badge = "";
    let isLive = false;

    switch (match.status) {

        case "LIVE":
        case "IN_PLAY":
            isLive = true;
            badge = `<span class="badge live"><span class="dot"></span>En vivo</span>`;
            break;

        case "PAUSED":
            isLive = true;
            badge = `<span class="badge paused"><i class="fa-solid fa-pause"></i>Descanso</span>`;
            break;

        case "FINISHED":
            badge = `<span class="badge finished"><i class="fa-solid fa-check"></i>Finalizado</span>`;
            break;

        default:
            badge = `<span class="badge scheduled"><i class="fa-regular fa-clock"></i>Programado</span>`;
    }

    const date = new Date(match.utcDate);

    const dateStr = date.toLocaleDateString([], {
        day: "2-digit",
        month: "short"
    });

    const timeStr = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    const delay = Math.min(index, 12) * 30;

    return `
<article class="match-card fade-in ${isLive ? "is-live" : ""}" style="animation-delay:${delay}ms">

    <div class="match-header">
        ${badge}
        <span class="match-time">${escapeHTML(dateStr)} · ${escapeHTML(timeStr)}</span>
    </div>

    <div class="match-body">

        <div class="team">
            <div class="crest">
                <img src="${escapeHTML(match.homeTeam.crest)}" alt="${escapeHTML(match.homeTeam.name)}" loading="lazy" onerror="this.style.visibility='hidden'">
            </div>
            <h3>${escapeHTML(match.homeTeam.shortName || match.homeTeam.name)}</h3>
        </div>

        <div class="score ${hasScore ? "" : "vs"}">${score}</div>

        <div class="team">
            <div class="crest">
                <img src="${escapeHTML(match.awayTeam.crest)}" alt="${escapeHTML(match.awayTeam.name)}" loading="lazy" onerror="this.style.visibility='hidden'">
            </div>
            <h3>${escapeHTML(match.awayTeam.shortName || match.awayTeam.name)}</h3>
        </div>

    </div>

    <div class="match-footer">
        <span><i class="fa-solid fa-layer-group"></i> Jornada ${escapeHTML(match.matchday ?? "-")}</span>
        <span><i class="fa-solid fa-trophy"></i> ${escapeHTML(match.competition.name)}</span>
    </div>

</article>
`;
}

function initializeTabs() {

    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tabContent");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");

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

    const dg = team.goalDifference;
    const dgClass = dg > 0 ? "dg-pos" : dg < 0 ? "dg-neg" : "";
    const dgText = dg > 0 ? `+${dg}` : dg;

    return `
<tr>
    <td><div class="position ${rowClass}">${team.position}</div></td>
    <td class="team-cell">
        <div class="team-cell-inner">
            <img class="team-logo" src="${escapeHTML(team.team.crest)}" alt="${escapeHTML(team.team.name)}" loading="lazy" onerror="this.style.visibility='hidden'">
            <span>${escapeHTML(team.team.shortName || team.team.name)}</span>
        </div>
    </td>
    <td><strong>${team.points}</strong></td>
    <td>${team.playedGames}</td>
    <td>${team.won}</td>
    <td>${team.draw}</td>
    <td>${team.lost}</td>
    <td>${team.goalsFor}</td>
    <td>${team.goalsAgainst}</td>
    <td class="${dgClass}">${dgText}</td>
</tr>
`;
}

function createScorerRow(player, pos) {

    const medal = pos === 1 ? "gold" : pos === 2 ? "silver" : pos === 3 ? "bronze" : "";

    return `
<tr>
    <td><div class="position ${medal}">${pos}</div></td>
    <td class="player-name">${escapeHTML(player.player.name)}</td>
    <td class="team-cell">
        <div class="team-cell-inner">
            <img class="team-logo-small" src="${escapeHTML(player.team.crest)}" alt="${escapeHTML(player.team.name)}" loading="lazy" onerror="this.style.display='none';">
            <span>${escapeHTML(player.team.shortName || player.team.name)}</span>
        </div>
    </td>
    <td><span class="goals-pill"><i class="fa-solid fa-futbol"></i>${player.goals}</span></td>
</tr>
`;
}
