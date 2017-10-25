export const storeManager = function(callback){
    const store = JSON.parse(RawMemory.get());
    callback(store);
    // garbage collect store
    RawMemory.set(JSON.stringify(store));
}
