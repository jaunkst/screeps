import {log} from 'lib';

export const benchmark = function(label, callback){
    const start = Date.now();
    callback();
    log(`[${Date.now() - start}ms]`, `${label}`);
}
