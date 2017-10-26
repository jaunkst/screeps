import {log} from 'lib';
import {selectCreeps} from 'selectors';

export const storeManager = function(callback){
    const store = JSON.parse(RawMemory.get());
    Object.assign(store, {
        actions: [],
        worldStats: {}
    });

    store.dispatch = (action) => {
        store.actions.push(action);
    };

    callback(store);
    console.log(JSON.stringify(store))
    RawMemory.set(JSON.stringify(store));
}
