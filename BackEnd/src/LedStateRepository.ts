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
                STATE INT(1) NOT NULL,
                TIMESTAMP TEXT NOT NULL,
                PRIMARY KEY(STATE,TIMESTAMP)
            );
        `)
    }

    save(state : LedState) : void{
        const insert = this.db.prepare(`
            INSERT INTO LED_STATE
                (STATE, TIMESTAMP) VALUES (?, ?);
        `)
        insert.run(state.getState(), state.getTime());
        console.log("State saved into DB")
    }

    load() : LedStateEvent[]{

        const select = this.db.prepare(`
            SELECT STATE, TIMESTAMP
            FROM LED_STATE
            WHERE TIMESTAMP >= DATETIME('NOW', '-1 DAY')
            ORDER BY TIMESTAMP DESC;
        `);
        const rows = select.all() as { STATE: number; TIMESTAMP: string }[];

        return rows.map(row => ({
            state: row.STATE == 1,
            timestamp: row.TIMESTAMP
        }));
    }
}