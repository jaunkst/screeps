const systems = [
    require('spawn-system'),
    require('move-system')
]

module.exports.loop = function () {
    systems.forEach((system) => {
        system.tick()
    })
}
