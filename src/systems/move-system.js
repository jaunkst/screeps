import {selectCreeps} from 'selectors';
import {log} from 'lib';

export const moveSystem = {
    name: 'moveSystem',
    tick: () => {
        const creeps = selectCreeps();
        creeps.forEach((creep) => {
            // should move creep
        })
    }
};
