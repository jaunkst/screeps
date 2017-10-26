import {Architect, Trainer} from 'synaptic';
import {selectCreeps} from 'selectors';
import {log} from 'lib';
import findClosest from 'find-closest';

const FIND_RESOURCES    = 'find_resources';
const MINE_RESOURCES    = 'mine_resources';
const RETURN_RESOURCES  = 'return_resources';
const DEPOSIT_RESOURCES = 'deposit_resources';

const weights = [
    {action: FIND_RESOURCES     , weight: 0.00},
    {action: MINE_RESOURCES     , weight: 0.25},
    {action: RETURN_RESOURCES   , weight: 0.75},
    {action: DEPOSIT_RESOURCES  , weight: 1.00}
]

function getWeightForAction(action){
    return weights.find((entry) => {
        return entry.action === action;
    }).weight;
}

function getActionForWeight(weight){
    return findClosest(weights, weight, 'weight').action;
}

const network = new Architect.Perceptron(2, 4, 4, 1);
const trainer = new Trainer(network);

trainer.train([
    {
        input: [0,0],
        output: [getWeightForAction(FIND_RESOURCES)]
    },
    {
        input: [0,1],
        output: [getWeightForAction(MINE_RESOURCES)]
    },
    {
        input: [1,0],
        output: [getWeightForAction(RETURN_RESOURCES)]
    },
    {
        input: [1,1],
        output: [getWeightForAction(DEPOSIT_RESOURCES)]
    },
]);

export const roleSystem = {
    name: 'roleSystem',
    tick: (store) => {
        const creeps = selectCreeps();
        creeps.forEach((creep) => {
            store.dispatch({
                type: getActionForWeight(
                    network.activate([0,0])
                ),
                payload:{
                    creepId: creep.id
                }
            });
        })
    },
    onAction: (action) => {
        log('action:', JSON.stringify(action))
    }
};
