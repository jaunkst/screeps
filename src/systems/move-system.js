import {creeps} from 'selectors';
import {log} from 'lib';

export const moveSystem = {
    tick: () => {
        creeps().forEach((creep) => {
            // should move creep
        })
    }
};
