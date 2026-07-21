class FootballAPI {

    constructor(){
        this.base = CONFIG.API_URL;
    }

    async request(endpoint){
        const response = await fetch(`${this.base}?endpoint=${encodeURIComponent(endpoint)}`);
        if(!response.ok){
            throw new Error("API Error");
        }
        return response.json();
    }

    matches(league){
        return this.request(`competitions/${league}/matches`);
    }

    standings(league){
        return this.request(`competitions/${league}/standings`);
    }

    scorers(league){
        return this.request(`competitions/${league}/scorers`);
    }
}

const footballAPI = new FootballAPI();