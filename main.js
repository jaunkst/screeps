(function () {
'use strict';

var log = function log() {
    {
        var _console;

        (_console = console).log.apply(_console, arguments);
    }
};

var benchmark = function benchmark(callback) {
    var start = Date.now();
    callback();
    log('cpu:', Date.now() - start);
};

var objectEntries = function objectEntries(object) {
    return Object.keys(object).map(function (key) {
        return object[key];
    });
};

var storeManager = function storeManager(callback) {
    var store = JSON.parse(RawMemory.get());
    callback(store);
    // garbage collect store
    RawMemory.set(JSON.stringify(store));
};

var creeps = function creeps() {
    return objectEntries(Game.creeps);
};

var spawns = function spawns() {
    return objectEntries(Game.spawns);
};

var systems = function systems() {
    return objectEntries(_systems);
};

var moveSystem = {
    tick: function tick() {
        creeps().forEach(function (creep) {
            // should move creep
        });
    }
};

var responses = [{ constant: OK, message: 'The operation has been scheduled successfully.' }, { constant: ERR_NOT_OWNER, message: 'You are not the owner of this spawn.' }, { constant: ERR_NAME_EXISTS, message: 'There is a creep with the same name already.' }, { constant: ERR_BUSY, message: 'The spawn is already in process of spawning another creep.' }, { constant: ERR_NOT_ENOUGH_ENERGY, message: 'The spawn and its extensions contain not enough energy to create a creep with the given body.' }, { constant: ERR_INVALID_ARGS, message: 'Body is not properly described or name was not provided.' }, { constant: ERR_RCL_NOT_ENOUGH, message: 'Your Room Controller level is insufficient to use this spawn.' }];

var spawnSystem = {
    tick: function tick() {
        spawns().map(function (spawn) {
            return spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker1');
        }).forEach(function (response) {
            responses.forEach(function (entry) {
                if (response == entry.constant) {
                    log(entry.message);
                }
            });
        });
    }
};



var _systems = Object.freeze({
	moveSystem: moveSystem,
	spawnSystem: spawnSystem
});

module.exports.loop = function () {
    benchmark(function () {
        storeManager(function (store) {
            systems().forEach(function (system) {
                system.tick(store);
            });
        });
    });
};

}());
