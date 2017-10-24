const {creeps} = require('selectors');

module.exports = {
    tick: () => {
        console.log('tick')
        creeps.forEach((creep) => {
            console.log(creep);
        })
    }
};
