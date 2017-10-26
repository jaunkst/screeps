import {objectEntries} from 'lib';

export const selectSpawns = function() {
    return objectEntries(Game.spawns);
}
