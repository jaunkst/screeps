import {Architect, Trainer} from 'synaptic';
import {selectCreeps} from 'selectors';
import {log} from 'lib';
import findClosest from 'find-closest';

const COLLECT_RESOURCES  = 'collect_resources';
const UPGRADE_CONTROLLER  = 'return_resources';

const weights = [
    {action: COLLECT_RESOURCES , weight: 0.00},
    {action: UPGRADE_CONTROLLER  , weight: 1.00}
]

const network = new Architect.Perceptron(3, 2, 1);

function getWeightForAction(action){
    return weights.find((entry) => {
        return entry.action === action;
    }).weight;
}

function getActionForWeight(weight){
    return findClosest(weights, weight, 'weight').action;
}

function getCreepState(creep) {
    return [
        creep.hits / creep.hitsMax,
        creep.carry.energy / creep.carryCapacity,
        creep.memory.drainOrGain
    ]
}

function getDistance(pos1, pos2) {
	let xs = pos2.x - pos1.x;
	let	ys = pos2.y - pos1.y;

	xs *= xs;
	ys *= ys;

	return Math.sqrt( xs + ys );
}

const trainer = new Trainer(network);

function trainNetwork(data, iterations){
    for(var i=0; i < iterations; i++){
        trainer.train(data);
    }
}

function findControllersForCreep(creep) {
    return creep.room.find(FIND_STRUCTURES, {
       filter: { my: true, structureType: STRUCTURE_CONTROLLER }
    }).map((source) => {
        return { pos: source.pos, range: 1 };
    })
}

trainNetwork([
    {
        input: [1, 0, 0],
        output: [getWeightForAction(COLLECT_RESOURCES)]
    },
    {
        input: [1, 1, 1],
        output: [getWeightForAction(UPGRADE_CONTROLLER)]
    }
], 1);

export const roleSystem = {
    name: 'roleSystem',
    tick: (store) => {
        const creeps = selectCreeps();
        creeps.forEach((creep) => {
            try {
                store.dispatch({
                    type: getActionForWeight(
                        network.activate(
                            getCreepState(creep)
                        )
                    ),
                    payload:{
                        creepId: creep.id
                    }
                });
            } catch(err) {
                log('ai:', 'failed to activate network');
            }
        })
    },
    onAction: (action) => {
        const creep = Game.getObjectById(action.payload.creepId);
        let goals = [];
        console.log('state', JSON.stringify(getCreepState(creep)))
        if(action.type === COLLECT_RESOURCES) {
            goals = creep.room.find(FIND_SOURCES).map((source) => {
                return { pos: source.pos, range: 1 };
            });
        }

        if(action.type === UPGRADE_CONTROLLER) {
            goals = creep.room.find(FIND_STRUCTURES, {
               filter: { my: true, structureType: STRUCTURE_CONTROLLER }
            }).map((source) => {
                return { pos: source.pos, range: 1 };
            });

            console.log('ret', JSON.stringify(goals));
        }

        let ret = PathFinder.search( creep.pos, goals );

        let pos = ret.path[0];
        creep.move(creep.pos.getDirectionTo(pos));

        if(action.type === COLLECT_RESOURCES) {
            const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(target) {
                creep.harvest(target)
            }
        }

        if(action.type === UPGRADE_CONTROLLER) {
            const status = creep.upgradeController(creep.room.controller);
            // if( status === ERR_NOT_ENOUGH_RESOURCES) {
            //     console.log('training', getCreepState(creep))
            //     trainNetwork([{
            //         input: getCreepState(creep),
            //         output: [getWeightForAction(COLLECT_RESOURCES)]
            //     }])
            // }
            // if( status === OK) {
            //     console.log('training', getCreepState(creep))
            //     trainNetwork([{
            //         input: getCreepState(creep),
            //         output: [getWeightForAction(UPGRADE_CONTROLLER)]
            //     }])
            // }
        }

        log('action:', JSON.stringify(action))
    }
};
