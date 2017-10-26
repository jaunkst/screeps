import {objectEntries} from 'lib';

export const selectCreeps = function() {
    return objectEntries(Game.creeps);
}
