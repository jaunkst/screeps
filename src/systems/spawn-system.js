import {selectSpawns} from 'selectors';
import {log} from 'lib';

const responses = [
    {status: OK                   , message: 'The operation has been scheduled successfully.'},
    {status: ERR_NOT_OWNER        , message: 'You are not the owner of this spawn.'},
    {status: ERR_NAME_EXISTS      , message: 'There is a creep with the same name already.'},
    {status: ERR_BUSY             , message: 'The spawn is already in process of spawning another creep.'},
    {status: ERR_NOT_ENOUGH_ENERGY, message: 'The spawn and its extensions contain not enough energy to create a creep with the given body.'},
    {status: ERR_INVALID_ARGS     , message: 'Body is not properly described or name was not provided.'},
    {status: ERR_RCL_NOT_ENOUGH   , message: 'Your Room Controller level is insufficient to use this spawn.'},
];

// TODO: spawnSystem should determain what types of creeps to spawn.
// TODO: spawnSystem should control how much resouces to spend.

function spawnWorker(store, spawn){
    const status = spawn.spawnCreep(
        [WORK, CARRY, MOVE],
        `Creep0`
    );

    if(status === ERR_NAME_EXISTS){
        store.spawnCounter += 1;
    }

    return status;
}

export const spawnSystem = {
    name: 'spawnSystem',
    tick: (store) => {
        const spawns = selectSpawns();
        spawns.map((spawn) => {
            return spawnWorker(store, spawn);
        }).forEach((status) => {
            responses.forEach((response) => {
                if(status == response.status) {
                    log(response.message);
                }
            })
        })
    }
};
