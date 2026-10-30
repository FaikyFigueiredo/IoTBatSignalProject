export type LedStateEvent = {
    state : boolean;
    timestamp : String;
}

export class LedState{
    private state : Number; //1 = on, 0 = off
    private timestamp : String; //time to be stored in the DB
    constructor(state : Number){
        this.state = state;
        this.timestamp = new Date().toLocaleString('sv-SE', {
            timeZone: 'America/Sao_Paulo'
        }).replace(' ', 'T') + 'Z';
    }

    getState() : Number{
        return this.state;
    }

    getTime() : String{
        return this.timestamp;
    }
}