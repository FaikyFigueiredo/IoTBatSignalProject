import { LedState } from "./LedStateClass";
import { LedStateRepository } from "./LedStateRepository";

const db = LedStateRepository.getDB();

export const addState = (state : LedState) =>
    db.save(state);

export const getStates = (station : String) =>
    db.load(station);