import {log} from 'lib';
import {selectCreeps} from 'selectors';

export const storeManager = function(callback){
    const store = JSON.parse(RawMemory.get());
    Object.assign(store, {
        actions: [],
        worldStats: {}
    });

    if(!store.spawnCounter){
        store.spawnCounter = 0;
    }

    store.dispatch = (action) => {
        store.actions.push(action);
    };

    callback(store);
    RawMemory.set(JSON.stringify(store));
}
