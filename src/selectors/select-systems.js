import {objectEntries} from 'lib';
import * as _systems from 'systems';

export const selectSystems = function() {
    return objectEntries(_systems);
}
