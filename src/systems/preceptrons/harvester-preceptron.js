const {flatten} = require('lodash');

import {COLLECT_RESOURCES, UPGRADE_CONTROLLER, AVOID_HOSTILE} from 'actions';

import {Architect, Trainer} from 'synaptic';
import findClosest from 'find-closest';

const COLLECT_RESOURCES_WEIGHT = 0;
const UPGRADE_CONTROLLER_WEIGHT = 0.5;
const AVOID_HOSTILE_WEIGHT = 1;

const NEED_ENERGY_WEIGHT = 0;
const DEPOSIT_ENERGY_WEIGHT = 1;

const TRUE_BINARY = 1;
const FALSE_BINARY = 0;

const CONTROLLER_NEAR_BINARY = 1;
const CONTROLLER_FAR_BINARY = 0;
const SOURCE_NEAR_BINARY = 1;
const SOURCE_FAR_BINARY = 0;

const COLLECT_SOURCE_SET_3 = [
    NEED_ENERGY_WEIGHT,
    CONTROLLER_FAR_BINARY,
    SOURCE_NEAR_BINARY
]

const HURT_SET = [1,0]
const HEALTY_SET = [0,1]

const UPGRADE_CONTROLLER_SET_3 = [
    DEPOSIT_ENERGY_WEIGHT,
    CONTROLLER_NEAR_BINARY,
    SOURCE_FAR_BINARY
]

export class HarvesterPreceptron {
    constructor(store){
        this.store = store;
        this.network = new Architect.Perceptron(5, 3, 1);
        this.weights = [
            {action: COLLECT_RESOURCES   , weight: COLLECT_RESOURCES_WEIGHT},
            {action: UPGRADE_CONTROLLER  , weight: UPGRADE_CONTROLLER_WEIGHT},
            {action: AVOID_HOSTILE       , weight: AVOID_HOSTILE_WEIGHT}
        ]

        this.trainer = new Trainer(this.network);
        this.trainer.train([
            {
                input: flatten([
                    HEALTY_SET,
                    COLLECT_SOURCE_SET_3
                ]),
                output: [this.getWeightForAction(COLLECT_RESOURCES)]
            },
            {
                input: flatten([
                    HEALTY_SET,
                    UPGRADE_CONTROLLER_SET_3
                ]),
                output: [this.getWeightForAction(UPGRADE_CONTROLLER)]
            },
            {
                input: flatten([
                    HURT_SET,
                    COLLECT_SOURCE_SET_3
                ]),
                output: [this.getWeightForAction(AVOID_HOSTILE)]
            },
            {
                input: flatten([
                    HURT_SET,
                    UPGRADE_CONTROLLER_SET_3
                ]),
                output: [this.getWeightForAction(AVOID_HOSTILE)]
            }
        ], {
            rate: .1,
            iterations: 500,
            error: .005,
        });
    }

    getWeightForAction(action){
        return this.weights.find((entry) => {
            return entry.action === action;
        }).weight;
    }

    getActionForWeight(weight){
        return findClosest(this.weights, weight, 'weight').action;
    }

    getControllerSet(creep) {
        return [
            creep.carry.energy / creep.carryCapacity,
            this.getControllerBinary(creep),
            this.getSourceBinary(creep)
        ]
    }

    getCreepBinaryState(creep) {
        console.log(this.getHealthBinary(creep))
        return flatten([
            this.getHealthBinary(creep),
            this.getControllerSet(creep)
        ])
    }

    getHealthBinary(creep){
        if(creep.hits === creep.hitsMax){
            return HEALTY_SET
        }
        return HURT_SET
    }

    getSourceBinary(creep){
        const creepPos = creep.pos;
        const sourcePos = creep.pos.findClosestByPath(FIND_SOURCES).pos;
        const creepEnergy = creep.carry.energy;
        const carryCapacity = creep.carryCapacity;
        const distance = this.getDistance(creepPos, sourcePos);
        if( distance < 6 && creepEnergy !== carryCapacity ){
            return 1;
        }
        return 0;
    }

    getControllerBinary(creep){
        const creepPos = creep.pos;
        const controllerPos = creep.room.controller.pos;
        const creepEnergy = creep.carry.energy;
        const distance = this.getDistance(creepPos, controllerPos);
        if( distance < 6 && creepEnergy !== 0 ){
            return 1;
        }
        return 0;
    }

    getDistance(pos1, pos2) {
        let xs = pos2.x - pos1.x;
        let	ys = pos2.y - pos1.y;
        xs *= xs;
        ys *= ys;
        return Math.sqrt( xs + ys );
    }

    getActionType(creep) {
        return this.getActionForWeight(
            this.network.activate(
                this.getCreepBinaryState(creep)
            )
        )
    }

    getActionForCreep(creep){
        return {
            type: this.getActionType(creep),
            payload:{ creepId: creep.id }
        }
    }
}
