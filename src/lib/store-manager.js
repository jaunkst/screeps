import {log} from 'lib';
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
    RawMemory.set(JSON.stringify(store));
}
