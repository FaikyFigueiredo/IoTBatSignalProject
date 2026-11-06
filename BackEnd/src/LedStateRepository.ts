import Database from "better-sqlite3";
import { LedState, LedStateEvent } from "./LedStateClass";

export class LedStateRepository{

    private static repository : LedStateRepository;

    private db : Database.Database;

    private constructor(){
        this.db = new Database("LEDB.sqlite");
        this.init();
    }
    public static getDB() : LedStateRepository{
        const toReturn : LedStateRepository =
            this.repository != null? this.repository : new LedStateRepository;
        return toReturn;
    }
    private init() : void{
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS LED_STATE(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                STATION TEXT NOT NULL,
                STATE INT(1) NOT NULL,
                TIMESTAMP TEXT NOT NULL
            );
        `)
    }

    save(state : LedState) : void{
        const insert = this.db.prepare(`
            INSERT INTO LED_STATE
                (STATION, STATE, TIMESTAMP) VALUES (?, ?, ?);
        `)
        insert.run(state.getStation(), state.getState(), state.getTime());
        console.log("State saved into DB")
    }

    load() : LedStateEvent[]{

        const select = this.db.prepare(`
            SELECT STATION, STATE, TIMESTAMP
            FROM LED_STATE
            WHERE TIMESTAMP >= DATETIME('NOW', '-1 DAY')
            ORDER BY TIMESTAMP DESC;
        `);
        const rows = select.all() as { STATION : String; STATE: number; TIMESTAMP: string }[];

        return rows.map(row => ({
            station : row.STATION,
            state: row.STATE == 1,
            timestamp: row.TIMESTAMP
        }));
    }
}