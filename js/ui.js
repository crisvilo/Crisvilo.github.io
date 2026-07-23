/*=========================================
            UI
=========================================*/

const UI = {

    showLoading() {

        document
            .getElementById("loadingSection")
            .classList.remove("hidden");

    },

    hideLoading() {

        document
            .getElementById("loadingSection")
            .classList.add("hidden");

    },

    showError() {

        document
            .getElementById("errorSection")
            .classList.remove("hidden");

    },

    hideError() {

        document
            .getElementById("errorSection")
            .classList.add("hidden");

    },

      renderMatches(matches) {

    const calendarContainer = document.getElementById("matchesContainer");
    const liveContainer = document.getElementById("liveMatchesContainer");

    calendarContainer.innerHTML = "";
    liveContainer.innerHTML = "";

    if (!matches || matches.length === 0) {

        calendarContainer.innerHTML = `<h2>No hay partidos.</h2>`;
        liveContainer.innerHTML = `<h2>No hay partidos en vivo.</h2>`;

        return;

    }

    const liveStates = ["LIVE", "IN_PLAY", "PAUSED"];

    const liveMatches = matches.filter(m => liveStates.includes(m.status));
    const otherMatches = matches.filter(m => !liveStates.includes(m.status));

    if (liveMatches.length === 0) {

        liveContainer.innerHTML = `<h2>No hay partidos en vivo en este momento.</h2>`;

    } else {

        liveMatches.forEach(match => {
            liveContainer.innerHTML += createMatchCard(match);
        });

    }

    if (otherMatches.length === 0) {

        calendarContainer.innerHTML = `<h2>No hay partidos.</h2>`;

    } else {

        otherMatches.forEach(match => {
            calendarContainer.innerHTML += createMatchCard(match);
        });

    }

},
renderStandings(data) {

    const container = document.getElementById("standingsContainer");

    container.innerHTML = "";

    if (!data.standings) {
        container.innerHTML = "<h2>No disponible</h2>";
        return;
    }

    const table = data.standings.find(s => s.type === "TOTAL");

    if (!table) {
        container.innerHTML = "<h2>No disponible</h2>";
        return;
    }

    let html = `
<div class="table-container">

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
`;

    table.table.forEach(team => {
        html += createStandingRow(team);
    });

    html += `
</tbody>

</table>

</div>
`;

    container.innerHTML = html;

},
    renderScorers(data) {

        const container = document.getElementById("scorersContainer");

        container.innerHTML = "";

        if (!data.scorers) {

            container.innerHTML = "<h2>No disponible</h2>";

            return;

        }

        let html = `
<div class="table-container">

<table>

<thead>

<tr>

<th>#</th>
<th>Jugador</th>
<th>Equipo</th>
<th>Goles</th>

</tr>

</thead>

<tbody>
`;

        data.scorers.forEach((player, index) => {

            html += createScorerRow(player, index + 1);

        });

        html += `
</tbody>

</table>

</div>
`;

        container.innerHTML = html;

    }

};