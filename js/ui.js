/*=========================================
            UI
=========================================*/

const UI = {

    showLoading() {
        document.getElementById("loadingSection").classList.remove("hidden");
    },

    hideLoading() {
        document.getElementById("loadingSection").classList.add("hidden");
    },

    showError() {
        document.getElementById("errorSection").classList.remove("hidden");
    },

    hideError() {
        document.getElementById("errorSection").classList.add("hidden");
    },

    setLeagueTitle(code) {
        const el = document.getElementById("leagueTitle");
        if (el) el.textContent = CONFIG.LEAGUES[code] || code;
    },

    setLastUpdate() {
        const el = document.getElementById("lastUpdate");
        if (!el) return;
        const now = new Date();
        el.textContent = `Actualizado ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.title = value;
        }
    },

    renderStats(matches, standings, scorers) {

        const liveStates = ["LIVE", "IN_PLAY", "PAUSED"];
        const list = (matches && matches.matches) || [];

        this.setText("statLive", String(list.filter(m => liveStates.includes(m.status)).length));

        const matchday = list.length && list[0].season ? list[0].season.currentMatchday : null;
        this.setText("statMatchday", matchday ? `#${matchday}` : "–");

        const total = standings && standings.standings
            ? standings.standings.find(s => s.type === "TOTAL")
            : null;
        const leader = total && total.table && total.table[0];
        this.setText("statLeader", leader ? (leader.team.shortName || leader.team.name) : "–");

        const top = scorers && scorers.scorers && scorers.scorers[0];
        this.setText("statScorer", top ? `${top.player.name} · ${top.goals}` : "–");
    },

    renderMatches(matches) {

        const calendarContainer = document.getElementById("matchesContainer");
        const liveContainer = document.getElementById("liveMatchesContainer");

        if (!matches || matches.length === 0) {
            calendarContainer.innerHTML = emptyState("fa-regular fa-calendar-xmark", "No hay partidos.");
            liveContainer.innerHTML = emptyState("fa-solid fa-tower-broadcast", "No hay partidos en vivo.");
            return;
        }

        const liveStates = ["LIVE", "IN_PLAY", "PAUSED"];

        const liveMatches = matches.filter(m => liveStates.includes(m.status));
        const otherMatches = matches.filter(m => !liveStates.includes(m.status));

        liveContainer.innerHTML = liveMatches.length === 0
            ? emptyState("fa-solid fa-tower-broadcast", "No hay partidos en vivo en este momento.")
            : liveMatches.map((m, i) => createMatchCard(m, i)).join("");

        calendarContainer.innerHTML = otherMatches.length === 0
            ? emptyState("fa-regular fa-calendar-xmark", "No hay partidos.")
            : otherMatches.map((m, i) => createMatchCard(m, i)).join("");
    },

    renderStandings(data) {

        const container = document.getElementById("standingsContainer");

        const table = data && data.standings
            ? data.standings.find(s => s.type === "TOTAL")
            : null;

        if (!table) {
            container.innerHTML = emptyState("fa-solid fa-list-ol", "Clasificación no disponible.");
            return;
        }

        container.innerHTML = `
<div class="table-container fade-in">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Equipo</th>
                <th>PTS</th>
                <th>PJ</th>
                <th>G</th>
                <th>E</th>
                <th>P</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
            </tr>
        </thead>
        <tbody>
            ${table.table.map(createStandingRow).join("")}
        </tbody>
    </table>
    <div class="legend">
        <span><i style="background:var(--info)"></i>Champions League</span>
        <span><i style="background:var(--warning)"></i>Europa League</span>
        <span><i style="background:var(--success)"></i>Conference League</span>
        <span><i style="background:var(--live)"></i>Descenso</span>
    </div>
</div>
`;
    },

    renderScorers(data) {

        const container = document.getElementById("scorersContainer");

        if (!data || !data.scorers || data.scorers.length === 0) {
            container.innerHTML = emptyState("fa-solid fa-futbol", "Goleadores no disponibles.");
            return;
        }

        container.innerHTML = `
<div class="table-container fade-in">
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Jugador</th>
                <th style="text-align:left">Equipo</th>
                <th>Goles</th>
            </tr>
        </thead>
        <tbody>
            ${data.scorers.map((p, i) => createScorerRow(p, i + 1)).join("")}
        </tbody>
    </table>
</div>
`;
    }

};
