import {objectEntries} from 'lib';

export const creeps = function() {
    return objectEntries(Game.creeps);
}
