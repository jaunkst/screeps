import {spawnSystem, moveSystem} from 'systems';

const systems = [
    spawnSystem,
    moveSystem
]

module.exports.loop = function () {
    const start = Date.now()
    systems.forEach((system) => {
        system.tick()
    })
    console.log('cpu:', start - Date.now())
}
