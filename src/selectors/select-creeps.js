function objectEntries(object){
    return Object.keys(object).map((key) => {
        return object[key];
    })
}

export const creeps = function() {
    return objectEntries(Game.creeps)
}
