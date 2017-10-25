import {log} from 'lib';

export const benchmark = function(callback){
    const start = Date.now();
    callback();
    log('cpu:', Date.now() - start);
}
