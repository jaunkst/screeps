import {spawns} from 'selectors';
import {log} from 'lib';

const responses = [
    {constant: OK, message: 'The operation has been scheduled successfully.'},
    {constant: ERR_NOT_OWNER, message: 'You are not the owner of this spawn.'},
    {constant: ERR_NAME_EXISTS, message: 'There is a creep with the same name already.'},
    {constant: ERR_BUSY, message: 'The spawn is already in process of spawning another creep.'},
    {constant: ERR_NOT_ENOUGH_ENERGY, message: 'The spawn and its extensions contain not enough energy to create a creep with the given body.'},
    {constant: ERR_INVALID_ARGS, message: 'Body is not properly described or name was not provided.'},
    {constant: ERR_RCL_NOT_ENOUGH, message: 'Your Room Controller level is insufficient to use this spawn.'},
];

export const spawnSystem = {
    tick: () => {
        spawns().map((spawn) => {
            return spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker1');
        }).forEach((response) => {
            responses.forEach((entry) => {
                if(response == entry.constant) {
                    log(entry.message);
                }
            })
        })
    }
};
