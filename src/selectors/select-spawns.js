function objectEntries(object){
    return Object.keys(object).map((key) => {
        return object[key];
    })
}

export const spawns = function() {
    return objectEntries(Game.spawns);
}
