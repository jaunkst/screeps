export const objectEntries = function(object){
    return Object.keys(object).map((key) => {
        return object[key];
    })
}
