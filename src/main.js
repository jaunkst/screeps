import {spawnSystem, moveSystem} from 'systems';
import {log, storeManager, benchmark} from 'lib';
import {selectSystems} from 'selectors';

function doTicksForSystems(options) {
    const {systems, store} = options;
    systems.forEach((system) => {
        if(system.tick){
            benchmark(`${system.name} tick`, () => {
                system.tick(store);
            });
        }
    })
}

function doActionsForSytems(options) {
    const {systems, store} = options;
    systems.forEach((system) => {
        if(system.onAction){
            benchmark(`${system.name} actions`, () => {
                store.actions.forEach((action) => {
                    system.onAction(action);
                })
            });
        }
    })
}

module.exports.loop = function () {
    benchmark('main', () => {
        storeManager((store) => {
            const systems = selectSystems();
            doTicksForSystems({systems, store});
            doActionsForSytems({systems, store});
        });
    });
}
