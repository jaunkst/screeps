import {COLLECT_RESOURCES, UPGRADE_CONTROLLER} from 'actions';

import { HarvesterPreceptron } from './preceptrons/harvester-preceptron';

import {selectCreeps} from 'selectors';
import {log} from 'lib';

const harvesterPreceptron = new HarvesterPreceptron();

function collectResources(creep, payload){
    let goals = [];
    goals = creep.room.find(FIND_SOURCES).map((source) => {
        return { pos: source.pos, range: 1 };
    });
    let ret = PathFinder.search( creep.pos, goals );
    let pos = ret.path[0];
    creep.move(creep.pos.getDirectionTo(pos));
    const target = creep.pos.findClosestByRange(FIND_SOURCES);
    if(target) {
        creep.harvest(target)
    }
}

function upgradeController(creep, payload){
    let goals = [];
    goals = creep.room.find(FIND_STRUCTURES, {
        filter: { my: true, structureType: STRUCTURE_CONTROLLER }
    }).map((source) => {
        return { pos: source.pos, range: 1 };
    });
    let ret = PathFinder.search( creep.pos, goals );
    let pos = ret.path[0];
    creep.move(creep.pos.getDirectionTo(pos));
    creep.upgradeController(creep.room.controller)
}

export const roleSystem = {
    name: 'harvesterSystem',
    tick: (store) => {
        selectCreeps().forEach((creep) => {
            try {
                store.dispatch(harvesterPreceptron.getActionForCreep(creep));
            } catch(err) {
                log('ai:', 'failed to activate network.', err);
            }
        })
    },
    onAction: (action) => {
        const creep = Game.getObjectById(action.payload.creepId);
        switch (action.type) {
            case COLLECT_RESOURCES:
            collectResources(creep, action.payload);
            break;
            case UPGRADE_CONTROLLER:
            upgradeController(creep, action.payload);
            break;
        }
    }
};
