export const log = function(...args){
    if(DEBUG){
        console.log('[info]', ...args);
    }
}
