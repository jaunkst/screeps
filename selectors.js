function objectEntries(object){
    return Object.keys(object).map((key) => {
        return object[key];
    })
}

module.exports = {
    spawns: objectEntries(Game.spawns),
    creeps: objectEntries(Game.creeps)
};
