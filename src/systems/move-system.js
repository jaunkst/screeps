import {creeps} from 'selectors';

export const moveSystem = {
    tick: () => {
        console.log('tick')
        creeps().forEach((creep) => {
            console.log(creep);
        })
    }
};
