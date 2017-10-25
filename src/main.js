import {spawnSystem, moveSystem} from 'systems';
import {storeManager, objectEntries, benchmark} from 'lib';
import {systems} from 'selectors';

module.exports.loop = function () {
    benchmark(() => {
        storeManager((store) => {
            systems().forEach((system) => {
                system.tick(store);
            });
        });
    });
}
