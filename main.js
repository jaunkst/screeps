(function () {
'use strict';

var log = function log() {
    {
        var _console;
        (_console = console).log.apply(_console, arguments);
    }
};

var benchmark = function benchmark(label, callback) {
    var start = Date.now();
    callback();
    log('[' + (Date.now() - start) + 'ms]', '' + label);
};

var objectEntries = function objectEntries(object) {
    return Object.keys(object).map(function (key) {
        return object[key];
    });
};

var selectCreeps = function selectCreeps() {
    return objectEntries(Game.creeps);
};

var selectSpawns = function selectSpawns() {
    return objectEntries(Game.spawns);
};

var selectSystems = function selectSystems() {
    return objectEntries(_systems);
};

var storeManager = function storeManager(callback) {
    var store = JSON.parse(RawMemory.get());
    Object.assign(store, {
        actions: [],
        worldStats: {}
    });
    store.dispatch = function (action) {
        store.actions.push(action);
    };
    callback(store);
    console.log(JSON.stringify(store));
    RawMemory.set(JSON.stringify(store));
};

var worldSystem = {
    name: 'worldSystem',
    tick: function tick(store) {
    }
};

var responses = [{ constant: OK, message: 'The operation has been scheduled successfully.' }, { constant: ERR_NOT_OWNER, message: 'You are not the owner of this spawn.' }, { constant: ERR_NAME_EXISTS, message: 'There is a creep with the same name already.' }, { constant: ERR_BUSY, message: 'The spawn is already in process of spawning another creep.' }, { constant: ERR_NOT_ENOUGH_ENERGY, message: 'The spawn and its extensions contain not enough energy to create a creep with the given body.' }, { constant: ERR_INVALID_ARGS, message: 'Body is not properly described or name was not provided.' }, { constant: ERR_RCL_NOT_ENOUGH, message: 'Your Room Controller level is insufficient to use this spawn.' }];
var spawnSystem = {
    name: 'spawnSystem',
    tick: function tick() {
        var spawns = selectSpawns();
        spawns.map(function (spawn) {
            var creep = spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker1');
            Game.creeps.Worker1.memory.drainOrGain = 0;
            return creep;
        }).forEach(function (response) {
            responses.forEach(function (entry) {
                if (response == entry.constant) {
                    log(entry.message);
                }
            });
        });
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var connections = 0;
var Connection = function () {
  function Connection(from, to, weight) {
    classCallCheck(this, Connection);
    if (!from || !to) throw new Error("Connection Error: Invalid neurons");
    this.ID = Connection.uid();
    this.from = from;
    this.to = to;
    this.weight = typeof weight == 'undefined' ? Math.random() * .2 - .1 : weight;
    this.gain = 1;
    this.gater = null;
  }
  createClass(Connection, null, [{
    key: "uid",
    value: function uid() {
      return connections++;
    }
  }]);
  return Connection;
}();

var neurons = 0;
var squash = {
  LOGISTIC: function LOGISTIC(x, derivate) {
    var fx = 1 / (1 + Math.exp(-x));
    if (!derivate) return fx;
    return fx * (1 - fx);
  },
  TANH: function TANH(x, derivate) {
    if (derivate) return 1 - Math.pow(Math.tanh(x), 2);
    return Math.tanh(x);
  },
  IDENTITY: function IDENTITY(x, derivate) {
    return derivate ? 1 : x;
  },
  HLIM: function HLIM(x, derivate) {
    return derivate ? 1 : x > 0 ? 1 : 0;
  },
  RELU: function RELU(x, derivate) {
    if (derivate) return x > 0 ? 1 : 0;
    return x > 0 ? x : 0;
  }
};
var Neuron = function () {
  function Neuron() {
    classCallCheck(this, Neuron);
    this.ID = Neuron.uid();
    this.connections = {
      inputs: {},
      projected: {},
      gated: {}
    };
    this.error = {
      responsibility: 0,
      projected: 0,
      gated: 0
    };
    this.trace = {
      elegibility: {},
      extended: {},
      influences: {}
    };
    this.state = 0;
    this.old = 0;
    this.activation = 0;
    this.selfconnection = new Connection(this, this, 0);
    this.squash = Neuron.squash.LOGISTIC;
    this.neighboors = {};
    this.bias = Math.random() * .2 - .1;
  }
  createClass(Neuron, [{
    key: 'activate',
    value: function activate(input) {
      if (typeof input != 'undefined') {
        this.activation = input;
        this.derivative = 0;
        this.bias = 0;
        return this.activation;
      }
      this.old = this.state;
      this.state = this.selfconnection.gain * this.selfconnection.weight * this.state + this.bias;
      for (var i in this.connections.inputs) {
        var input = this.connections.inputs[i];
        this.state += input.from.activation * input.weight * input.gain;
      }
      this.activation = this.squash(this.state);
      this.derivative = this.squash(this.state, true);
      var influences = [];
      for (var id in this.trace.extended) {
        var neuron = this.neighboors[id];
        var influence = neuron.selfconnection.gater == this ? neuron.old : 0;
        for (var incoming in this.trace.influences[neuron.ID]) {
          influence += this.trace.influences[neuron.ID][incoming].weight * this.trace.influences[neuron.ID][incoming].from.activation;
        }
        influences[neuron.ID] = influence;
      }
      for (var i in this.connections.inputs) {
        var input = this.connections.inputs[i];
        this.trace.elegibility[input.ID] = this.selfconnection.gain * this.selfconnection.weight * this.trace.elegibility[input.ID] + input.gain * input.from.activation;
        for (var id in this.trace.extended) {
          var xtrace = this.trace.extended[id];
          var neuron = this.neighboors[id];
          var influence = influences[neuron.ID];
          xtrace[input.ID] = neuron.selfconnection.gain * neuron.selfconnection.weight * xtrace[input.ID] + this.derivative * this.trace.elegibility[input.ID] * influence;
        }
      }
      for (var connection in this.connections.gated) {
        this.connections.gated[connection].gain = this.activation;
      }
      return this.activation;
    }
  }, {
    key: 'propagate',
    value: function propagate(rate, target) {
      var error = 0;
      var isOutput = typeof target != 'undefined';
      if (isOutput) this.error.responsibility = this.error.projected = target - this.activation;
      else
        {
          for (var id in this.connections.projected) {
            var connection = this.connections.projected[id];
            var neuron = connection.to;
            error += neuron.error.responsibility * connection.gain * connection.weight;
          }
          this.error.projected = this.derivative * error;
          error = 0;
          for (var id in this.trace.extended) {
            var neuron = this.neighboors[id];
            var influence = neuron.selfconnection.gater == this ? neuron.old : 0;
            for (var input in this.trace.influences[id]) {
              influence += this.trace.influences[id][input].weight * this.trace.influences[neuron.ID][input].from.activation;
            }
            error += neuron.error.responsibility * influence;
          }
          this.error.gated = this.derivative * error;
          this.error.responsibility = this.error.projected + this.error.gated;
        }
      rate = rate || .1;
      for (var id in this.connections.inputs) {
        var input = this.connections.inputs[id];
        var gradient = this.error.projected * this.trace.elegibility[input.ID];
        for (var id in this.trace.extended) {
          var neuron = this.neighboors[id];
          gradient += neuron.error.responsibility * this.trace.extended[neuron.ID][input.ID];
        }
        input.weight += rate * gradient;
      }
      this.bias += rate * this.error.responsibility;
    }
  }, {
    key: 'project',
    value: function project(neuron, weight) {
      if (neuron == this) {
        this.selfconnection.weight = 1;
        return this.selfconnection;
      }
      var connected = this.connected(neuron);
      if (connected && connected.type == 'projected') {
        if (typeof weight != 'undefined') connected.connection.weight = weight;
        return connected.connection;
      } else {
        var connection = new Connection(this, neuron, weight);
      }
      this.connections.projected[connection.ID] = connection;
      this.neighboors[neuron.ID] = neuron;
      neuron.connections.inputs[connection.ID] = connection;
      neuron.trace.elegibility[connection.ID] = 0;
      for (var id in neuron.trace.extended) {
        var trace = neuron.trace.extended[id];
        trace[connection.ID] = 0;
      }
      return connection;
    }
  }, {
    key: 'gate',
    value: function gate(connection) {
      this.connections.gated[connection.ID] = connection;
      var neuron = connection.to;
      if (!(neuron.ID in this.trace.extended)) {
        this.neighboors[neuron.ID] = neuron;
        var xtrace = this.trace.extended[neuron.ID] = {};
        for (var id in this.connections.inputs) {
          var input = this.connections.inputs[id];
          xtrace[input.ID] = 0;
        }
      }
      if (neuron.ID in this.trace.influences) this.trace.influences[neuron.ID].push(connection);else this.trace.influences[neuron.ID] = [connection];
      connection.gater = this;
    }
  }, {
    key: 'selfconnected',
    value: function selfconnected() {
      return this.selfconnection.weight !== 0;
    }
  }, {
    key: 'connected',
    value: function connected(neuron) {
      var result = {
        type: null,
        connection: false
      };
      if (this == neuron) {
        if (this.selfconnected()) {
          result.type = 'selfconnection';
          result.connection = this.selfconnection;
          return result;
        } else return false;
      }
      for (var type in this.connections) {
        for (var connection in this.connections[type]) {
          var connection = this.connections[type][connection];
          if (connection.to == neuron) {
            result.type = type;
            result.connection = connection;
            return result;
          } else if (connection.from == neuron) {
            result.type = type;
            result.connection = connection;
            return result;
          }
        }
      }
      return false;
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var trace in this.trace.elegibility) {
        this.trace.elegibility[trace] = 0;
      }
      for (var trace in this.trace.extended) {
        for (var extended in this.trace.extended[trace]) {
          this.trace.extended[trace][extended] = 0;
        }
      }
      this.error.responsibility = this.error.projected = this.error.gated = 0;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.clear();
      for (var type in this.connections) {
        for (var connection in this.connections[type]) {
          this.connections[type][connection].weight = Math.random() * .2 - .1;
        }
      }
      this.bias = Math.random() * .2 - .1;
      this.old = this.state = this.activation = 0;
    }
  }, {
    key: 'optimize',
    value: function optimize(optimized, layer) {
      optimized = optimized || {};
      var store_activation = [];
      var store_trace = [];
      var store_propagation = [];
      var varID = optimized.memory || 0;
      var neurons = optimized.neurons || 1;
      var inputs = optimized.inputs || [];
      var targets = optimized.targets || [];
      var outputs = optimized.outputs || [];
      var variables = optimized.variables || {};
      var activation_sentences = optimized.activation_sentences || [];
      var trace_sentences = optimized.trace_sentences || [];
      var propagation_sentences = optimized.propagation_sentences || [];
      var layers = optimized.layers || { __count: 0, __neuron: 0 };
      var allocate = function allocate(store) {
        var allocated = layer in layers && store[layers.__count];
        if (!allocated) {
          layers.__count = store.push([]) - 1;
          layers[layer] = layers.__count;
        }
      };
      allocate(activation_sentences);
      allocate(trace_sentences);
      allocate(propagation_sentences);
      var currentLayer = layers.__count;
      var getVar = function getVar() {
        var args = Array.prototype.slice.call(arguments);
        if (args.length == 1) {
          if (args[0] == 'target') {
            var id = 'target_' + targets.length;
            targets.push(varID);
          } else var id = args[0];
          if (id in variables) return variables[id];
          return variables[id] = {
            value: 0,
            id: varID++
          };
        } else {
          var extended = args.length > 2;
          if (extended) var value = args.pop();
          var unit = args.shift();
          var prop = args.pop();
          if (!extended) var value = unit[prop];
          var id = prop + '_';
          for (var i = 0; i < args.length; i++) {
            id += args[i] + '_';
          }id += unit.ID;
          if (id in variables) return variables[id];
          return variables[id] = {
            value: value,
            id: varID++
          };
        }
      };
      var buildSentence = function buildSentence() {
        var args = Array.prototype.slice.call(arguments);
        var store = args.pop();
        var sentence = '';
        for (var i = 0; i < args.length; i++) {
          if (typeof args[i] == 'string') sentence += args[i];else sentence += 'F[' + args[i].id + ']';
        }store.push(sentence + ';');
      };
      var isEmpty = function isEmpty(obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) return false;
        }
        return true;
      };
      var noProjections = isEmpty(this.connections.projected);
      var noGates = isEmpty(this.connections.gated);
      var isInput = layer == 'input' ? true : isEmpty(this.connections.inputs);
      var isOutput = layer == 'output' ? true : noProjections && noGates;
      var rate = getVar('rate');
      var activation = getVar(this, 'activation');
      if (isInput) inputs.push(activation.id);else {
        activation_sentences[currentLayer].push(store_activation);
        trace_sentences[currentLayer].push(store_trace);
        propagation_sentences[currentLayer].push(store_propagation);
        var old = getVar(this, 'old');
        var state = getVar(this, 'state');
        var bias = getVar(this, 'bias');
        if (this.selfconnection.gater) var self_gain = getVar(this.selfconnection, 'gain');
        if (this.selfconnected()) var self_weight = getVar(this.selfconnection, 'weight');
        buildSentence(old, ' = ', state, store_activation);
        if (this.selfconnected()) {
          if (this.selfconnection.gater) buildSentence(state, ' = ', self_gain, ' * ', self_weight, ' * ', state, ' + ', bias, store_activation);else buildSentence(state, ' = ', self_weight, ' * ', state, ' + ', bias, store_activation);
        } else buildSentence(state, ' = ', bias, store_activation);
        for (var i in this.connections.inputs) {
          var input = this.connections.inputs[i];
          var input_activation = getVar(input.from, 'activation');
          var input_weight = getVar(input, 'weight');
          if (input.gater) var input_gain = getVar(input, 'gain');
          if (this.connections.inputs[i].gater) buildSentence(state, ' += ', input_activation, ' * ', input_weight, ' * ', input_gain, store_activation);else buildSentence(state, ' += ', input_activation, ' * ', input_weight, store_activation);
        }
        var derivative = getVar(this, 'derivative');
        switch (this.squash) {
          case Neuron.squash.LOGISTIC:
            buildSentence(activation, ' = (1 / (1 + Math.exp(-', state, ')))', store_activation);
            buildSentence(derivative, ' = ', activation, ' * (1 - ', activation, ')', store_activation);
            break;
          case Neuron.squash.TANH:
            var eP = getVar('aux');
            var eN = getVar('aux_2');
            buildSentence(eP, ' = Math.exp(', state, ')', store_activation);
            buildSentence(eN, ' = 1 / ', eP, store_activation);
            buildSentence(activation, ' = (', eP, ' - ', eN, ') / (', eP, ' + ', eN, ')', store_activation);
            buildSentence(derivative, ' = 1 - (', activation, ' * ', activation, ')', store_activation);
            break;
          case Neuron.squash.IDENTITY:
            buildSentence(activation, ' = ', state, store_activation);
            buildSentence(derivative, ' = 1', store_activation);
            break;
          case Neuron.squash.HLIM:
            buildSentence(activation, ' = +(', state, ' > 0)', store_activation);
            buildSentence(derivative, ' = 1', store_activation);
            break;
          case Neuron.squash.RELU:
            buildSentence(activation, ' = ', state, ' > 0 ? ', state, ' : 0', store_activation);
            buildSentence(derivative, ' = ', state, ' > 0 ? 1 : 0', store_activation);
            break;
        }
        for (var id in this.trace.extended) {
          var neuron = this.neighboors[id];
          var influence = getVar('influences[' + neuron.ID + ']');
          var neuron_old = getVar(neuron, 'old');
          var initialized = false;
          if (neuron.selfconnection.gater == this) {
            buildSentence(influence, ' = ', neuron_old, store_trace);
            initialized = true;
          }
          for (var incoming in this.trace.influences[neuron.ID]) {
            var incoming_weight = getVar(this.trace.influences[neuron.ID][incoming], 'weight');
            var incoming_activation = getVar(this.trace.influences[neuron.ID][incoming].from, 'activation');
            if (initialized) buildSentence(influence, ' += ', incoming_weight, ' * ', incoming_activation, store_trace);else {
              buildSentence(influence, ' = ', incoming_weight, ' * ', incoming_activation, store_trace);
              initialized = true;
            }
          }
        }
        for (var i in this.connections.inputs) {
          var input = this.connections.inputs[i];
          if (input.gater) var input_gain = getVar(input, 'gain');
          var input_activation = getVar(input.from, 'activation');
          var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
          if (this.selfconnected()) {
            if (this.selfconnection.gater) {
              if (input.gater) buildSentence(trace, ' = ', self_gain, ' * ', self_weight, ' * ', trace, ' + ', input_gain, ' * ', input_activation, store_trace);else buildSentence(trace, ' = ', self_gain, ' * ', self_weight, ' * ', trace, ' + ', input_activation, store_trace);
            } else {
              if (input.gater) buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ', input_gain, ' * ', input_activation, store_trace);else buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ', input_activation, store_trace);
            }
          } else {
            if (input.gater) buildSentence(trace, ' = ', input_gain, ' * ', input_activation, store_trace);else buildSentence(trace, ' = ', input_activation, store_trace);
          }
          for (var id in this.trace.extended) {
            var neuron = this.neighboors[id];
            var influence = getVar('influences[' + neuron.ID + ']');
            var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
            var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID, this.trace.extended[neuron.ID][input.ID]);
            if (neuron.selfconnected()) var neuron_self_weight = getVar(neuron.selfconnection, 'weight');
            if (neuron.selfconnection.gater) var neuron_self_gain = getVar(neuron.selfconnection, 'gain');
            if (neuron.selfconnected()) {
              if (neuron.selfconnection.gater) buildSentence(xtrace, ' = ', neuron_self_gain, ' * ', neuron_self_weight, ' * ', xtrace, ' + ', derivative, ' * ', trace, ' * ', influence, store_trace);else buildSentence(xtrace, ' = ', neuron_self_weight, ' * ', xtrace, ' + ', derivative, ' * ', trace, ' * ', influence, store_trace);
            } else buildSentence(xtrace, ' = ', derivative, ' * ', trace, ' * ', influence, store_trace);
          }
        }
        for (var connection in this.connections.gated) {
          var gated_gain = getVar(this.connections.gated[connection], 'gain');
          buildSentence(gated_gain, ' = ', activation, store_activation);
        }
      }
      if (!isInput) {
        var responsibility = getVar(this, 'error', 'responsibility', this.error.responsibility);
        if (isOutput) {
          var target = getVar('target');
          buildSentence(responsibility, ' = ', target, ' - ', activation, store_propagation);
          for (var id in this.connections.inputs) {
            var input = this.connections.inputs[id];
            var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
            var input_weight = getVar(input, 'weight');
            buildSentence(input_weight, ' += ', rate, ' * (', responsibility, ' * ', trace, ')', store_propagation);
          }
          outputs.push(activation.id);
        } else {
          if (!noProjections && !noGates) {
            var error = getVar('aux');
            for (var id in this.connections.projected) {
              var connection = this.connections.projected[id];
              var neuron = connection.to;
              var connection_weight = getVar(connection, 'weight');
              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
              if (connection.gater) {
                var connection_gain = getVar(connection, 'gain');
                buildSentence(error, ' += ', neuron_responsibility, ' * ', connection_gain, ' * ', connection_weight, store_propagation);
              } else buildSentence(error, ' += ', neuron_responsibility, ' * ', connection_weight, store_propagation);
            }
            var projected = getVar(this, 'error', 'projected', this.error.projected);
            buildSentence(projected, ' = ', derivative, ' * ', error, store_propagation);
            buildSentence(error, ' = 0', store_propagation);
            for (var id in this.trace.extended) {
              var neuron = this.neighboors[id];
              var influence = getVar('aux_2');
              var neuron_old = getVar(neuron, 'old');
              if (neuron.selfconnection.gater == this) buildSentence(influence, ' = ', neuron_old, store_propagation);else buildSentence(influence, ' = 0', store_propagation);
              for (var input in this.trace.influences[neuron.ID]) {
                var connection = this.trace.influences[neuron.ID][input];
                var connection_weight = getVar(connection, 'weight');
                var neuron_activation = getVar(connection.from, 'activation');
                buildSentence(influence, ' += ', connection_weight, ' * ', neuron_activation, store_propagation);
              }
              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
              buildSentence(error, ' += ', neuron_responsibility, ' * ', influence, store_propagation);
            }
            var gated = getVar(this, 'error', 'gated', this.error.gated);
            buildSentence(gated, ' = ', derivative, ' * ', error, store_propagation);
            buildSentence(responsibility, ' = ', projected, ' + ', gated, store_propagation);
            for (var id in this.connections.inputs) {
              var input = this.connections.inputs[id];
              var gradient = getVar('aux');
              var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
              buildSentence(gradient, ' = ', projected, ' * ', trace, store_propagation);
              for (var id in this.trace.extended) {
                var neuron = this.neighboors[id];
                var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
                var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID, this.trace.extended[neuron.ID][input.ID]);
                buildSentence(gradient, ' += ', neuron_responsibility, ' * ', xtrace, store_propagation);
              }
              var input_weight = getVar(input, 'weight');
              buildSentence(input_weight, ' += ', rate, ' * ', gradient, store_propagation);
            }
          } else if (noGates) {
            buildSentence(responsibility, ' = 0', store_propagation);
            for (var id in this.connections.projected) {
              var connection = this.connections.projected[id];
              var neuron = connection.to;
              var connection_weight = getVar(connection, 'weight');
              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
              if (connection.gater) {
                var connection_gain = getVar(connection, 'gain');
                buildSentence(responsibility, ' += ', neuron_responsibility, ' * ', connection_gain, ' * ', connection_weight, store_propagation);
              } else buildSentence(responsibility, ' += ', neuron_responsibility, ' * ', connection_weight, store_propagation);
            }
            buildSentence(responsibility, ' *= ', derivative, store_propagation);
            for (var id in this.connections.inputs) {
              var input = this.connections.inputs[id];
              var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace.elegibility[input.ID]);
              var input_weight = getVar(input, 'weight');
              buildSentence(input_weight, ' += ', rate, ' * (', responsibility, ' * ', trace, ')', store_propagation);
            }
          } else if (noProjections) {
            buildSentence(responsibility, ' = 0', store_propagation);
            for (var id in this.trace.extended) {
              var neuron = this.neighboors[id];
              var influence = getVar('aux');
              var neuron_old = getVar(neuron, 'old');
              if (neuron.selfconnection.gater == this) buildSentence(influence, ' = ', neuron_old, store_propagation);else buildSentence(influence, ' = 0', store_propagation);
              for (var input in this.trace.influences[neuron.ID]) {
                var connection = this.trace.influences[neuron.ID][input];
                var connection_weight = getVar(connection, 'weight');
                var neuron_activation = getVar(connection.from, 'activation');
                buildSentence(influence, ' += ', connection_weight, ' * ', neuron_activation, store_propagation);
              }
              var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
              buildSentence(responsibility, ' += ', neuron_responsibility, ' * ', influence, store_propagation);
            }
            buildSentence(responsibility, ' *= ', derivative, store_propagation);
            for (var id in this.connections.inputs) {
              var input = this.connections.inputs[id];
              var gradient = getVar('aux');
              buildSentence(gradient, ' = 0', store_propagation);
              for (var id in this.trace.extended) {
                var neuron = this.neighboors[id];
                var neuron_responsibility = getVar(neuron, 'error', 'responsibility', neuron.error.responsibility);
                var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID, this.trace.extended[neuron.ID][input.ID]);
                buildSentence(gradient, ' += ', neuron_responsibility, ' * ', xtrace, store_propagation);
              }
              var input_weight = getVar(input, 'weight');
              buildSentence(input_weight, ' += ', rate, ' * ', gradient, store_propagation);
            }
          }
        }
        buildSentence(bias, ' += ', rate, ' * ', responsibility, store_propagation);
      }
      return {
        memory: varID,
        neurons: neurons + 1,
        inputs: inputs,
        outputs: outputs,
        targets: targets,
        variables: variables,
        activation_sentences: activation_sentences,
        trace_sentences: trace_sentences,
        propagation_sentences: propagation_sentences,
        layers: layers
      };
    }
  }], [{
    key: 'uid',
    value: function uid() {
      return neurons++;
    }
  }, {
    key: 'quantity',
    value: function quantity() {
      return {
        neurons: neurons,
        connections: connections
      };
    }
  }]);
  return Neuron;
}();
Neuron.squash = squash;

var connections$1 = 0;
var LayerConnection = function () {
  function LayerConnection(fromLayer, toLayer, type, weights) {
    classCallCheck(this, LayerConnection);
    this.ID = LayerConnection.uid();
    this.from = fromLayer;
    this.to = toLayer;
    this.selfconnection = toLayer == fromLayer;
    this.type = type;
    this.connections = {};
    this.list = [];
    this.size = 0;
    this.gatedfrom = [];
    if (typeof this.type == 'undefined') {
      if (fromLayer == toLayer) this.type = Layer.connectionType.ONE_TO_ONE;else this.type = Layer.connectionType.ALL_TO_ALL;
    }
    if (this.type == Layer.connectionType.ALL_TO_ALL || this.type == Layer.connectionType.ALL_TO_ELSE) {
      for (var here in this.from.list) {
        for (var there in this.to.list) {
          var from = this.from.list[here];
          var to = this.to.list[there];
          if (this.type == Layer.connectionType.ALL_TO_ELSE && from == to) continue;
          var connection = from.project(to, weights);
          this.connections[connection.ID] = connection;
          this.size = this.list.push(connection);
        }
      }
    } else if (this.type == Layer.connectionType.ONE_TO_ONE) {
      for (var neuron in this.from.list) {
        var from = this.from.list[neuron];
        var to = this.to.list[neuron];
        var connection = from.project(to, weights);
        this.connections[connection.ID] = connection;
        this.size = this.list.push(connection);
      }
    }
    fromLayer.connectedTo.push(this);
  }
  createClass(LayerConnection, null, [{
    key: 'uid',
    value: function uid() {
      return connections$1++;
    }
  }]);
  return LayerConnection;
}();

function shuffleInplace(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
  return o;
}
var cost = {
  CROSS_ENTROPY: function CROSS_ENTROPY(target, output) {
    var crossentropy = 0;
    for (var i in output) {
      crossentropy -= target[i] * Math.log(output[i] + 1e-15) + (1 - target[i]) * Math.log(1 + 1e-15 - output[i]);
    }
    return crossentropy;
  },
  MSE: function MSE(target, output) {
    var mse = 0;
    for (var i = 0; i < output.length; i++) {
      mse += Math.pow(target[i] - output[i], 2);
    }return mse / output.length;
  },
  BINARY: function BINARY(target, output) {
    var misses = 0;
    for (var i = 0; i < output.length; i++) {
      misses += Math.round(target[i] * 2) != Math.round(output[i] * 2);
    }return misses;
  }
};
var Trainer = function () {
  function Trainer(network, options) {
    classCallCheck(this, Trainer);
    options = options || {};
    this.network = network;
    this.rate = options.rate || .2;
    this.iterations = options.iterations || 100000;
    this.error = options.error || .005;
    this.cost = options.cost || null;
    this.crossValidate = options.crossValidate || null;
  }
  createClass(Trainer, [{
    key: 'train',
    value: function train(set$$1, options) {
      var error = 1;
      var iterations = bucketSize = 0;
      var abort = false;
      var currentRate;
      var cost = options && options.cost || this.cost || Trainer.cost.MSE;
      var crossValidate = false,
          testSet,
          trainSet;
      var start = Date.now();
      if (options) {
        if (options.iterations) this.iterations = options.iterations;
        if (options.error) this.error = options.error;
        if (options.rate) this.rate = options.rate;
        if (options.cost) this.cost = options.cost;
        if (options.schedule) this.schedule = options.schedule;
        if (options.customLog) {
          console.log('Deprecated: use schedule instead of customLog');
          this.schedule = options.customLog;
        }
        if (this.crossValidate || options.crossValidate) {
          if (!this.crossValidate) this.crossValidate = {};
          crossValidate = true;
          if (options.crossValidate.testSize) this.crossValidate.testSize = options.crossValidate.testSize;
          if (options.crossValidate.testError) this.crossValidate.testError = options.crossValidate.testError;
        }
      }
      currentRate = this.rate;
      if (Array.isArray(this.rate)) {
        var bucketSize = Math.floor(this.iterations / this.rate.length);
      }
      if (crossValidate) {
        var numTrain = Math.ceil((1 - this.crossValidate.testSize) * set$$1.length);
        trainSet = set$$1.slice(0, numTrain);
        testSet = set$$1.slice(numTrain);
      }
      var lastError = 0;
      while (!abort && iterations < this.iterations && error > this.error) {
        if (crossValidate && error <= this.crossValidate.testError) {
          break;
        }
        var currentSetSize = set$$1.length;
        error = 0;
        iterations++;
        if (bucketSize > 0) {
          var currentBucket = Math.floor(iterations / bucketSize);
          currentRate = this.rate[currentBucket] || currentRate;
        }
        if (typeof this.rate === 'function') {
          currentRate = this.rate(iterations, lastError);
        }
        if (crossValidate) {
          this._trainSet(trainSet, currentRate, cost);
          error += this.test(testSet).error;
          currentSetSize = 1;
        } else {
          error += this._trainSet(set$$1, currentRate, cost);
          currentSetSize = set$$1.length;
        }
        error /= currentSetSize;
        lastError = error;
        if (options) {
          if (this.schedule && this.schedule.every && iterations % this.schedule.every == 0) abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate });else if (options.log && iterations % options.log == 0) {
            console.log('iterations', iterations, 'error', error, 'rate', currentRate);
          }
          
          if (options.shuffle) shuffleInplace(set$$1);
        }
      }
      var results = {
        error: error,
        iterations: iterations,
        time: Date.now() - start
      };
      return results;
    }
  }, {
    key: 'trainAsync',
    value: function trainAsync(set$$1, options) {
      var train = this.workerTrain.bind(this);
      return new Promise(function (resolve, reject) {
        try {
          train(set$$1, resolve, options, true);
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: '_trainSet',
    value: function _trainSet(set$$1, currentRate, costFunction) {
      var errorSum = 0;
      for (var i = 0; i < set$$1.length; i++) {
        var input = set$$1[i].input;
        var target = set$$1[i].output;
        var output = this.network.activate(input);
        this.network.propagate(currentRate, target);
        errorSum += costFunction(target, output);
      }
      return errorSum;
    }
  }, {
    key: 'test',
    value: function test(set$$1, options) {
      var error = 0;
      var input, output, target;
      var cost = options && options.cost || this.cost || Trainer.cost.MSE;
      var start = Date.now();
      for (var i = 0; i < set$$1.length; i++) {
        input = set$$1[i].input;
        target = set$$1[i].output;
        output = this.network.activate(input);
        error += cost(target, output);
      }
      error /= set$$1.length;
      var results = {
        error: error,
        time: Date.now() - start
      };
      return results;
    }
  }, {
    key: 'workerTrain',
    value: function workerTrain(set$$1, callback, options, suppressWarning) {
      if (!suppressWarning) {
        console.warn('Deprecated: do not use `workerTrain`, use `trainAsync` instead.');
      }
      var that = this;
      if (!this.network.optimized) this.network.optimize();
      var worker = this.network.worker(this.network.optimized.memory, set$$1, options);
      worker.onmessage = function (e) {
        switch (e.data.action) {
          case 'done':
            var iterations = e.data.message.iterations;
            var error = e.data.message.error;
            var time = e.data.message.time;
            that.network.optimized.ownership(e.data.memoryBuffer);
            callback({
              error: error,
              iterations: iterations,
              time: time
            });
            worker.terminate();
            break;
          case 'log':
            console.log(e.data.message);
          case 'schedule':
            if (options && options.schedule && typeof options.schedule.do === 'function') {
              var scheduled = options.schedule.do;
              scheduled(e.data.message);
            }
            break;
        }
      };
      worker.postMessage({ action: 'startTraining' });
    }
  }, {
    key: 'XOR',
    value: function XOR(options) {
      if (this.network.inputs() != 2 || this.network.outputs() != 1) throw new Error('Incompatible network (2 inputs, 1 output)');
      var defaults$$1 = {
        iterations: 100000,
        log: false,
        shuffle: true,
        cost: Trainer.cost.MSE
      };
      if (options) for (var i in options) {
        defaults$$1[i] = options[i];
      }return this.train([{
        input: [0, 0],
        output: [0]
      }, {
        input: [1, 0],
        output: [1]
      }, {
        input: [0, 1],
        output: [1]
      }, {
        input: [1, 1],
        output: [0]
      }], defaults$$1);
    }
  }, {
    key: 'DSR',
    value: function DSR(options) {
      options = options || {};
      var targets = options.targets || [2, 4, 7, 8];
      var distractors = options.distractors || [3, 5, 6, 9];
      var prompts = options.prompts || [0, 1];
      var length = options.length || 24;
      var criterion = options.success || 0.95;
      var iterations = options.iterations || 100000;
      var rate = options.rate || .1;
      var log = options.log || 0;
      var schedule = options.schedule || {};
      var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;
      var trial, correct, i, j, success;
      trial = correct = i = j = success = 0;
      var error = 1,
          symbols = targets.length + distractors.length + prompts.length;
      var noRepeat = function noRepeat(range, avoid) {
        var number = Math.random() * range | 0;
        var used = false;
        for (var i in avoid) {
          if (number == avoid[i]) used = true;
        }return used ? noRepeat(range, avoid) : number;
      };
      var equal = function equal(prediction, output) {
        for (var i in prediction) {
          if (Math.round(prediction[i]) != output[i]) return false;
        }return true;
      };
      var start = Date.now();
      while (trial < iterations && (success < criterion || trial % 1000 != 0)) {
        var sequence = [],
            sequenceLength = length - prompts.length;
        for (i = 0; i < sequenceLength; i++) {
          var any = Math.random() * distractors.length | 0;
          sequence.push(distractors[any]);
        }
        var indexes = [],
            positions = [];
        for (i = 0; i < prompts.length; i++) {
          indexes.push(Math.random() * targets.length | 0);
          positions.push(noRepeat(sequenceLength, positions));
        }
        positions = positions.sort();
        for (i = 0; i < prompts.length; i++) {
          sequence[positions[i]] = targets[indexes[i]];
          sequence.push(prompts[i]);
        }
        var distractorsCorrect;
        var targetsCorrect = distractorsCorrect = 0;
        error = 0;
        for (i = 0; i < length; i++) {
          var input = [];
          for (j = 0; j < symbols; j++) {
            input[j] = 0;
          }input[sequence[i]] = 1;
          var output = [];
          for (j = 0; j < targets.length; j++) {
            output[j] = 0;
          }if (i >= sequenceLength) {
            var index = i - sequenceLength;
            output[indexes[index]] = 1;
          }
          var prediction = this.network.activate(input);
          if (equal(prediction, output)) {
            if (i < sequenceLength) distractorsCorrect++;else targetsCorrect++;
          } else {
            this.network.propagate(rate, output);
          }
          error += cost(output, prediction);
          if (distractorsCorrect + targetsCorrect == length) correct++;
        }
        if (trial % 1000 == 0) correct = 0;
        trial++;
        var divideError = trial % 1000;
        divideError = divideError == 0 ? 1000 : divideError;
        success = correct / divideError;
        error /= length;
        if (log && trial % log == 0) console.log('iterations:', trial, ' success:', success, ' correct:', correct, ' time:', Date.now() - start, ' error:', error);
        if (schedule.do && schedule.every && trial % schedule.every == 0) schedule.do({
          iterations: trial,
          success: success,
          error: error,
          time: Date.now() - start,
          correct: correct
        });
      }
      return {
        iterations: trial,
        success: success,
        error: error,
        time: Date.now() - start
      };
    }
  }, {
    key: 'ERG',
    value: function ERG(options) {
      options = options || {};
      var iterations = options.iterations || 150000;
      var criterion = options.error || .05;
      var rate = options.rate || .1;
      var log = options.log || 500;
      var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;
      var Node = function Node() {
        this.paths = [];
      };
      Node.prototype = {
        connect: function connect(node, value) {
          this.paths.push({
            node: node,
            value: value
          });
          return this;
        },
        any: function any() {
          if (this.paths.length == 0) return false;
          var index = Math.random() * this.paths.length | 0;
          return this.paths[index];
        },
        test: function test(value) {
          for (var i in this.paths) {
            if (this.paths[i].value == value) return this.paths[i];
          }return false;
        }
      };
      var reberGrammar = function reberGrammar() {
        var output = new Node();
        var n1 = new Node().connect(output, 'E');
        var n2 = new Node().connect(n1, 'S');
        var n3 = new Node().connect(n1, 'V').connect(n2, 'P');
        var n4 = new Node().connect(n2, 'X');
        n4.connect(n4, 'S');
        var n5 = new Node().connect(n3, 'V');
        n5.connect(n5, 'T');
        n2.connect(n5, 'X');
        var n6 = new Node().connect(n4, 'T').connect(n5, 'P');
        var input = new Node().connect(n6, 'B');
        return {
          input: input,
          output: output
        };
      };
      var embededReberGrammar = function embededReberGrammar() {
        var reber1 = reberGrammar();
        var reber2 = reberGrammar();
        var output = new Node();
        var n1 = new Node().connect(output, 'E');
        reber1.output.connect(n1, 'T');
        reber2.output.connect(n1, 'P');
        var n2 = new Node().connect(reber1.input, 'P').connect(reber2.input, 'T');
        var input = new Node().connect(n2, 'B');
        return {
          input: input,
          output: output
        };
      };
      var generate = function generate() {
        var node = embededReberGrammar().input;
        var next = node.any();
        var str = '';
        while (next) {
          str += next.value;
          next = next.node.any();
        }
        return str;
      };
      var test = function test(str) {
        var node = embededReberGrammar().input;
        var i = 0;
        var ch = str.charAt(i);
        while (i < str.length) {
          var next = node.test(ch);
          if (!next) return false;
          node = next.node;
          ch = str.charAt(++i);
        }
        return true;
      };
      var different = function different(array1, array2) {
        var max1 = 0;
        var i1 = -1;
        var max2 = 0;
        var i2 = -1;
        for (var i in array1) {
          if (array1[i] > max1) {
            max1 = array1[i];
            i1 = i;
          }
          if (array2[i] > max2) {
            max2 = array2[i];
            i2 = i;
          }
        }
        return i1 != i2;
      };
      var iteration = 0;
      var error = 1;
      var table = {
        'B': 0,
        'P': 1,
        'T': 2,
        'X': 3,
        'S': 4,
        'E': 5
      };
      var start = Date.now();
      while (iteration < iterations && error > criterion) {
        var i = 0;
        error = 0;
        var sequence = generate();
        var read = sequence.charAt(i);
        var predict = sequence.charAt(i + 1);
        while (i < sequence.length - 1) {
          var input = [];
          var target = [];
          for (var j = 0; j < 6; j++) {
            input[j] = 0;
            target[j] = 0;
          }
          input[table[read]] = 1;
          target[table[predict]] = 1;
          var output = this.network.activate(input);
          if (different(output, target)) this.network.propagate(rate, target);
          read = sequence.charAt(++i);
          predict = sequence.charAt(i + 1);
          error += cost(target, output);
        }
        error /= sequence.length;
        iteration++;
        if (iteration % log == 0) {
          console.log('iterations:', iteration, ' time:', Date.now() - start, ' error:', error);
        }
      }
      return {
        iterations: iteration,
        error: error,
        time: Date.now() - start,
        test: test,
        generate: generate
      };
    }
  }, {
    key: 'timingTask',
    value: function timingTask(options) {
      if (this.network.inputs() != 2 || this.network.outputs() != 1) throw new Error('Invalid Network: must have 2 inputs and one output');
      if (typeof options == 'undefined') options = {};
      function getSamples(trainingSize, testSize) {
        var size = trainingSize + testSize;
        var t = 0;
        var set$$1 = [];
        for (var i = 0; i < size; i++) {
          set$$1.push({ input: [0, 0], output: [0] });
        }
        while (t < size - 20) {
          var n = Math.round(Math.random() * 20);
          set$$1[t].input[0] = 1;
          for (var j = t; j <= t + n; j++) {
            set$$1[j].input[1] = n / 20;
            set$$1[j].output[0] = 0.5;
          }
          t += n;
          n = Math.round(Math.random() * 20);
          for (var k = t + 1; k <= t + n && k < size; k++) {
            set$$1[k].input[1] = set$$1[t].input[1];
          }t += n;
        }
        var trainingSet = [];
        var testSet = [];
        for (var l = 0; l < size; l++) {
          (l < trainingSize ? trainingSet : testSet).push(set$$1[l]);
        }
        return {
          train: trainingSet,
          test: testSet
        };
      }
      var iterations = options.iterations || 200;
      var error = options.error || .005;
      var rate = options.rate || [.03, .02];
      var log = options.log === false ? false : options.log || 10;
      var cost = options.cost || this.cost || Trainer.cost.MSE;
      var trainingSamples = options.trainSamples || 7000;
      var testSamples = options.trainSamples || 1000;
      var samples = getSamples(trainingSamples, testSamples);
      var result = this.train(samples.train, {
        rate: rate,
        log: log,
        iterations: iterations,
        error: error,
        cost: cost
      });
      return {
        train: result,
        test: this.test(samples.test)
      };
    }
  }]);
  return Trainer;
}();
Trainer.cost = cost;

var Network = function () {
  function Network(layers) {
    classCallCheck(this, Network);
    if (typeof layers != 'undefined') {
      this.layers = {
        input: layers.input || null,
        hidden: layers.hidden || [],
        output: layers.output || null
      };
      this.optimized = null;
    }
  }
  createClass(Network, [{
    key: 'activate',
    value: function activate(input) {
      if (this.optimized === false) {
        this.layers.input.activate(input);
        for (var i = 0; i < this.layers.hidden.length; i++) {
          this.layers.hidden[i].activate();
        }return this.layers.output.activate();
      } else {
        if (this.optimized == null) this.optimize();
        return this.optimized.activate(input);
      }
    }
  }, {
    key: 'propagate',
    value: function propagate(rate, target) {
      if (this.optimized === false) {
        this.layers.output.propagate(rate, target);
        for (var i = this.layers.hidden.length - 1; i >= 0; i--) {
          this.layers.hidden[i].propagate(rate);
        }
      } else {
        if (this.optimized == null) this.optimize();
        this.optimized.propagate(rate, target);
      }
    }
  }, {
    key: 'project',
    value: function project(unit, type, weights) {
      if (this.optimized) this.optimized.reset();
      if (unit instanceof Network) return this.layers.output.project(unit.layers.input, type, weights);
      if (unit instanceof Layer) return this.layers.output.project(unit, type, weights);
      throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
    }
  }, {
    key: 'gate',
    value: function gate(connection, type) {
      if (this.optimized) this.optimized.reset();
      this.layers.output.gate(connection, type);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.restore();
      var inputLayer = this.layers.input,
          outputLayer = this.layers.output;
      inputLayer.clear();
      for (var i = 0; i < this.layers.hidden.length; i++) {
        this.layers.hidden[i].clear();
      }
      outputLayer.clear();
      if (this.optimized) this.optimized.reset();
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.restore();
      var inputLayer = this.layers.input,
          outputLayer = this.layers.output;
      inputLayer.reset();
      for (var i = 0; i < this.layers.hidden.length; i++) {
        this.layers.hidden[i].reset();
      }
      outputLayer.reset();
      if (this.optimized) this.optimized.reset();
    }
  }, {
    key: 'optimize',
    value: function optimize() {
      var that = this;
      var optimized = {};
      var neurons = this.neurons();
      for (var i = 0; i < neurons.length; i++) {
        var neuron = neurons[i].neuron;
        var layer = neurons[i].layer;
        while (neuron.neuron) {
          neuron = neuron.neuron;
        }optimized = neuron.optimize(optimized, layer);
      }
      for (var i = 0; i < optimized.propagation_sentences.length; i++) {
        optimized.propagation_sentences[i].reverse();
      }optimized.propagation_sentences.reverse();
      var hardcode = '';
      hardcode += 'var F = Float64Array ? new Float64Array(' + optimized.memory + ') : []; ';
      for (var i in optimized.variables) {
        hardcode += 'F[' + optimized.variables[i].id + '] = ' + (optimized.variables[i].value || 0) + '; ';
      }hardcode += 'var activate = function(input){\n';
      for (var i = 0; i < optimized.inputs.length; i++) {
        hardcode += 'F[' + optimized.inputs[i] + '] = input[' + i + ']; ';
      }for (var i = 0; i < optimized.activation_sentences.length; i++) {
        if (optimized.activation_sentences[i].length > 0) {
          for (var j = 0; j < optimized.activation_sentences[i].length; j++) {
            hardcode += optimized.activation_sentences[i][j].join(' ');
            hardcode += optimized.trace_sentences[i][j].join(' ');
          }
        }
      }
      hardcode += ' var output = []; ';
      for (var i = 0; i < optimized.outputs.length; i++) {
        hardcode += 'output[' + i + '] = F[' + optimized.outputs[i] + ']; ';
      }hardcode += 'return output; }; ';
      hardcode += 'var propagate = function(rate, target){\n';
      hardcode += 'F[' + optimized.variables.rate.id + '] = rate; ';
      for (var i = 0; i < optimized.targets.length; i++) {
        hardcode += 'F[' + optimized.targets[i] + '] = target[' + i + ']; ';
      }for (var i = 0; i < optimized.propagation_sentences.length; i++) {
        for (var j = 0; j < optimized.propagation_sentences[i].length; j++) {
          hardcode += optimized.propagation_sentences[i][j].join(' ') + ' ';
        }
      }hardcode += ' };\n';
      hardcode += 'var ownership = function(memoryBuffer){\nF = memoryBuffer;\nthis.memory = F;\n};\n';
      hardcode += 'return {\nmemory: F,\nactivate: activate,\npropagate: propagate,\nownership: ownership\n};';
      hardcode = hardcode.split(';').join(';\n');
      var constructor = new Function(hardcode);
      var network = constructor();
      network.data = {
        variables: optimized.variables,
        activate: optimized.activation_sentences,
        propagate: optimized.propagation_sentences,
        trace: optimized.trace_sentences,
        inputs: optimized.inputs,
        outputs: optimized.outputs,
        check_activation: this.activate,
        check_propagation: this.propagate
      };
      network.reset = function () {
        if (that.optimized) {
          that.optimized = null;
          that.activate = network.data.check_activation;
          that.propagate = network.data.check_propagation;
        }
      };
      this.optimized = network;
      this.activate = network.activate;
      this.propagate = network.propagate;
    }
  }, {
    key: 'restore',
    value: function restore() {
      if (!this.optimized) return;
      var optimized = this.optimized;
      var getValue = function getValue() {
        var args = Array.prototype.slice.call(arguments);
        var unit = args.shift();
        var prop = args.pop();
        var id = prop + '_';
        for (var property in args) {
          id += args[property] + '_';
        }id += unit.ID;
        var memory = optimized.memory;
        var variables = optimized.data.variables;
        if (id in variables) return memory[variables[id].id];
        return 0;
      };
      var list = this.neurons();
      for (var i = 0; i < list.length; i++) {
        var neuron = list[i].neuron;
        while (neuron.neuron) {
          neuron = neuron.neuron;
        }neuron.state = getValue(neuron, 'state');
        neuron.old = getValue(neuron, 'old');
        neuron.activation = getValue(neuron, 'activation');
        neuron.bias = getValue(neuron, 'bias');
        for (var input in neuron.trace.elegibility) {
          neuron.trace.elegibility[input] = getValue(neuron, 'trace', 'elegibility', input);
        }for (var gated in neuron.trace.extended) {
          for (var input in neuron.trace.extended[gated]) {
            neuron.trace.extended[gated][input] = getValue(neuron, 'trace', 'extended', gated, input);
          }
        }
        for (var j in neuron.connections.projected) {
          var connection = neuron.connections.projected[j];
          connection.weight = getValue(connection, 'weight');
          connection.gain = getValue(connection, 'gain');
        }
      }
    }
  }, {
    key: 'neurons',
    value: function neurons() {
      var neurons = [];
      var inputLayer = this.layers.input.neurons(),
          outputLayer = this.layers.output.neurons();
      for (var i = 0; i < inputLayer.length; i++) {
        neurons.push({
          neuron: inputLayer[i],
          layer: 'input'
        });
      }
      for (var i = 0; i < this.layers.hidden.length; i++) {
        var hiddenLayer = this.layers.hidden[i].neurons();
        for (var j = 0; j < hiddenLayer.length; j++) {
          neurons.push({
            neuron: hiddenLayer[j],
            layer: i
          });
        }
      }
      for (var i = 0; i < outputLayer.length; i++) {
        neurons.push({
          neuron: outputLayer[i],
          layer: 'output'
        });
      }
      return neurons;
    }
  }, {
    key: 'inputs',
    value: function inputs() {
      return this.layers.input.size;
    }
  }, {
    key: 'outputs',
    value: function outputs() {
      return this.layers.output.size;
    }
  }, {
    key: 'set',
    value: function set$$1(layers) {
      this.layers = {
        input: layers.input || null,
        hidden: layers.hidden || [],
        output: layers.output || null
      };
      if (this.optimized) this.optimized.reset();
    }
  }, {
    key: 'setOptimize',
    value: function setOptimize(bool) {
      this.restore();
      if (this.optimized) this.optimized.reset();
      this.optimized = bool ? null : false;
    }
  }, {
    key: 'toJSON',
    value: function toJSON(ignoreTraces) {
      this.restore();
      var list = this.neurons();
      var neurons = [];
      var connections = [];
      var ids = {};
      for (var i = 0; i < list.length; i++) {
        var neuron = list[i].neuron;
        while (neuron.neuron) {
          neuron = neuron.neuron;
        }ids[neuron.ID] = i;
        var copy = {
          trace: {
            elegibility: {},
            extended: {}
          },
          state: neuron.state,
          old: neuron.old,
          activation: neuron.activation,
          bias: neuron.bias,
          layer: list[i].layer
        };
        copy.squash = neuron.squash == Neuron.squash.LOGISTIC ? 'LOGISTIC' : neuron.squash == Neuron.squash.TANH ? 'TANH' : neuron.squash == Neuron.squash.IDENTITY ? 'IDENTITY' : neuron.squash == Neuron.squash.HLIM ? 'HLIM' : neuron.squash == Neuron.squash.RELU ? 'RELU' : null;
        neurons.push(copy);
      }
      for (var i = 0; i < list.length; i++) {
        var neuron = list[i].neuron;
        while (neuron.neuron) {
          neuron = neuron.neuron;
        }for (var j in neuron.connections.projected) {
          var connection = neuron.connections.projected[j];
          connections.push({
            from: ids[connection.from.ID],
            to: ids[connection.to.ID],
            weight: connection.weight,
            gater: connection.gater ? ids[connection.gater.ID] : null
          });
        }
        if (neuron.selfconnected()) {
          connections.push({
            from: ids[neuron.ID],
            to: ids[neuron.ID],
            weight: neuron.selfconnection.weight,
            gater: neuron.selfconnection.gater ? ids[neuron.selfconnection.gater.ID] : null
          });
        }
      }
      return {
        neurons: neurons,
        connections: connections
      };
    }
  }, {
    key: 'toDot',
    value: function toDot(edgeConnection) {
      if (!(typeof edgeConnection === 'undefined' ? 'undefined' : _typeof(edgeConnection))) edgeConnection = false;
      var code = 'digraph nn {\n    rankdir = BT\n';
      var layers = [this.layers.input].concat(this.layers.hidden, this.layers.output);
      for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < layers[i].connectedTo.length; j++) {
          var connection = layers[i].connectedTo[j];
          var layerTo = connection.to;
          var size = connection.size;
          var layerID = layers.indexOf(layers[i]);
          var layerToID = layers.indexOf(layerTo);
          if (edgeConnection) {
            if (connection.gatedfrom.length) {
              var fakeNode = 'fake' + layerID + '_' + layerToID;
              code += '    ' + fakeNode + ' [label = "", shape = point, width = 0.01, height = 0.01]\n';
              code += '    ' + layerID + ' -> ' + fakeNode + ' [label = ' + size + ', arrowhead = none]\n';
              code += '    ' + fakeNode + ' -> ' + layerToID + '\n';
            } else code += '    ' + layerID + ' -> ' + layerToID + ' [label = ' + size + ']\n';
            for (var from in connection.gatedfrom) {
              var layerfrom = connection.gatedfrom[from].layer;
              var layerfromID = layers.indexOf(layerfrom);
              code += '    ' + layerfromID + ' -> ' + fakeNode + ' [color = blue]\n';
            }
          } else {
            code += '    ' + layerID + ' -> ' + layerToID + ' [label = ' + size + ']\n';
            for (var from in connection.gatedfrom) {
              var layerfrom = connection.gatedfrom[from].layer;
              var layerfromID = layers.indexOf(layerfrom);
              code += '    ' + layerfromID + ' -> ' + layerToID + ' [color = blue]\n';
            }
          }
        }
      }
      code += '}\n';
      return {
        code: code,
        link: 'https://chart.googleapis.com/chart?chl=' + escape(code.replace('/ /g', '+')) + '&cht=gv'
      };
    }
  }, {
    key: 'standalone',
    value: function standalone() {
      if (!this.optimized) this.optimize();
      var data = this.optimized.data;
      var activation = 'function (input) {\n';
      for (var i = 0; i < data.inputs.length; i++) {
        activation += 'F[' + data.inputs[i] + '] = input[' + i + '];\n';
      }
      for (var i = 0; i < data.activate.length; i++) {
        for (var j = 0; j < data.activate[i].length; j++) {
          activation += data.activate[i][j].join('') + '\n';
        }
      }
      activation += 'var output = [];\n';
      for (var i = 0; i < data.outputs.length; i++) {
        activation += 'output[' + i + '] = F[' + data.outputs[i] + '];\n';
      }activation += 'return output;\n}';
      var memory = activation.match(/F\[(\d+)\]/g);
      var dimension = 0;
      var ids = {};
      for (var i = 0; i < memory.length; i++) {
        var tmp = memory[i].match(/\d+/)[0];
        if (!(tmp in ids)) {
          ids[tmp] = dimension++;
        }
      }
      var hardcode = 'F = {\n';
      for (var i in ids) {
        hardcode += ids[i] + ': ' + this.optimized.memory[i] + ',\n';
      }hardcode = hardcode.substring(0, hardcode.length - 2) + '\n};\n';
      hardcode = 'var run = ' + activation.replace(/F\[(\d+)]/g, function (index) {
        return 'F[' + ids[index.match(/\d+/)[0]] + ']';
      }).replace('{\n', '{\n' + hardcode + '') + ';\n';
      hardcode += 'return run';
      return new Function(hardcode)();
    }
  }, {
    key: 'worker',
    value: function worker(memory, set$$1, options) {
      var workerOptions = {};
      if (options) workerOptions = options;
      workerOptions.rate = workerOptions.rate || .2;
      workerOptions.iterations = workerOptions.iterations || 100000;
      workerOptions.error = workerOptions.error || .005;
      workerOptions.cost = workerOptions.cost || null;
      workerOptions.crossValidate = workerOptions.crossValidate || null;
      var costFunction = '// REPLACED BY WORKER\nvar cost = ' + (options && options.cost || this.cost || Trainer.cost.MSE) + ';\n';
      var workerFunction = Network.getWorkerSharedFunctions();
      workerFunction = workerFunction.replace(/var cost = options && options\.cost \|\| this\.cost \|\| Trainer\.cost\.MSE;/g, costFunction);
      workerFunction = workerFunction.replace('return results;', 'postMessage({action: "done", message: results, memoryBuffer: F}, [F.buffer]);');
      workerFunction = workerFunction.replace('console.log(\'iterations\', iterations, \'error\', error, \'rate\', currentRate)', 'postMessage({action: \'log\', message: {\n' + 'iterations: iterations,\n' + 'error: error,\n' + 'rate: currentRate\n' + '}\n' + '})');
      workerFunction = workerFunction.replace('abort = this.schedule.do({ error: error, iterations: iterations, rate: currentRate })', 'postMessage({action: \'schedule\', message: {\n' + 'iterations: iterations,\n' + 'error: error,\n' + 'rate: currentRate\n' + '}\n' + '})');
      if (!this.optimized) this.optimize();
      var hardcode = 'var inputs = ' + this.optimized.data.inputs.length + ';\n';
      hardcode += 'var outputs = ' + this.optimized.data.outputs.length + ';\n';
      hardcode += 'var F =  new Float64Array([' + this.optimized.memory.toString() + ']);\n';
      hardcode += 'var activate = ' + this.optimized.activate.toString() + ';\n';
      hardcode += 'var propagate = ' + this.optimized.propagate.toString() + ';\n';
      hardcode += 'onmessage = function(e) {\n' + 'if (e.data.action == \'startTraining\') {\n' + 'train(' + JSON.stringify(set$$1) + ',' + JSON.stringify(workerOptions) + ');\n' + '}\n' + '}';
      var workerSourceCode = workerFunction + '\n' + hardcode;
      var blob = new Blob([workerSourceCode]);
      var blobURL = window.URL.createObjectURL(blob);
      return new Worker(blobURL);
    }
  }, {
    key: 'clone',
    value: function clone() {
      return Network.fromJSON(this.toJSON());
    }
  }], [{
    key: 'getWorkerSharedFunctions',
    value: function getWorkerSharedFunctions() {
      if (typeof Network._SHARED_WORKER_FUNCTIONS !== 'undefined') return Network._SHARED_WORKER_FUNCTIONS;
      var train_f = Trainer.prototype.train.toString();
      train_f = train_f.replace(/this._trainSet/g, '_trainSet');
      train_f = train_f.replace(/this.test/g, 'test');
      train_f = train_f.replace(/this.crossValidate/g, 'crossValidate');
      train_f = train_f.replace('crossValidate = true', '// REMOVED BY WORKER');
      var _trainSet_f = Trainer.prototype._trainSet.toString().replace(/this.network./g, '');
      var test_f = Trainer.prototype.test.toString().replace(/this.network./g, '');
      return Network._SHARED_WORKER_FUNCTIONS = train_f + '\n' + _trainSet_f + '\n' + test_f;
    }
  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      var neurons = [];
      var layers = {
        input: new Layer(),
        hidden: [],
        output: new Layer()
      };
      for (var i = 0; i < json.neurons.length; i++) {
        var config = json.neurons[i];
        var neuron = new Neuron();
        neuron.trace.elegibility = {};
        neuron.trace.extended = {};
        neuron.state = config.state;
        neuron.old = config.old;
        neuron.activation = config.activation;
        neuron.bias = config.bias;
        neuron.squash = config.squash in Neuron.squash ? Neuron.squash[config.squash] : Neuron.squash.LOGISTIC;
        neurons.push(neuron);
        if (config.layer == 'input') layers.input.add(neuron);else if (config.layer == 'output') layers.output.add(neuron);else {
          if (typeof layers.hidden[config.layer] == 'undefined') layers.hidden[config.layer] = new Layer();
          layers.hidden[config.layer].add(neuron);
        }
      }
      for (var i = 0; i < json.connections.length; i++) {
        var config = json.connections[i];
        var from = neurons[config.from];
        var to = neurons[config.to];
        var weight = config.weight;
        var gater = neurons[config.gater];
        var connection = from.project(to, weight);
        if (gater) gater.gate(connection);
      }
      return new Network(layers);
    }
  }]);
  return Network;
}();

var connectionType = {
  ALL_TO_ALL: "ALL TO ALL",
  ONE_TO_ONE: "ONE TO ONE",
  ALL_TO_ELSE: "ALL TO ELSE"
};
var gateType = {
  INPUT: "INPUT",
  OUTPUT: "OUTPUT",
  ONE_TO_ONE: "ONE TO ONE"
};
var Layer = function () {
  function Layer(size) {
    classCallCheck(this, Layer);
    this.size = size | 0;
    this.list = [];
    this.connectedTo = [];
    while (size--) {
      var neuron = new Neuron();
      this.list.push(neuron);
    }
  }
  createClass(Layer, [{
    key: 'activate',
    value: function activate(input) {
      var activations = [];
      if (typeof input != 'undefined') {
        if (input.length != this.size) throw new Error('INPUT size and LAYER size must be the same to activate!');
        for (var id in this.list) {
          var neuron = this.list[id];
          var activation = neuron.activate(input[id]);
          activations.push(activation);
        }
      } else {
        for (var id in this.list) {
          var neuron = this.list[id];
          var activation = neuron.activate();
          activations.push(activation);
        }
      }
      return activations;
    }
  }, {
    key: 'propagate',
    value: function propagate(rate, target) {
      if (typeof target != 'undefined') {
        if (target.length != this.size) throw new Error('TARGET size and LAYER size must be the same to propagate!');
        for (var id = this.list.length - 1; id >= 0; id--) {
          var neuron = this.list[id];
          neuron.propagate(rate, target[id]);
        }
      } else {
        for (var id = this.list.length - 1; id >= 0; id--) {
          var neuron = this.list[id];
          neuron.propagate(rate);
        }
      }
    }
  }, {
    key: 'project',
    value: function project(layer, type, weights) {
      if (layer instanceof Network) layer = layer.layers.input;
      if (layer instanceof Layer) {
        if (!this.connected(layer)) return new LayerConnection(this, layer, type, weights);
      } else throw new Error('Invalid argument, you can only project connections to LAYERS and NETWORKS!');
    }
  }, {
    key: 'gate',
    value: function gate(connection, type) {
      if (type == Layer.gateType.INPUT) {
        if (connection.to.size != this.size) throw new Error('GATER layer and CONNECTION.TO layer must be the same size in order to gate!');
        for (var id in connection.to.list) {
          var neuron = connection.to.list[id];
          var gater = this.list[id];
          for (var input in neuron.connections.inputs) {
            var gated = neuron.connections.inputs[input];
            if (gated.ID in connection.connections) gater.gate(gated);
          }
        }
      } else if (type == Layer.gateType.OUTPUT) {
        if (connection.from.size != this.size) throw new Error('GATER layer and CONNECTION.FROM layer must be the same size in order to gate!');
        for (var id in connection.from.list) {
          var neuron = connection.from.list[id];
          var gater = this.list[id];
          for (var projected in neuron.connections.projected) {
            var gated = neuron.connections.projected[projected];
            if (gated.ID in connection.connections) gater.gate(gated);
          }
        }
      } else if (type == Layer.gateType.ONE_TO_ONE) {
        if (connection.size != this.size) throw new Error('The number of GATER UNITS must be the same as the number of CONNECTIONS to gate!');
        for (var id in connection.list) {
          var gater = this.list[id];
          var gated = connection.list[id];
          gater.gate(gated);
        }
      }
      connection.gatedfrom.push({ layer: this, type: type });
    }
  }, {
    key: 'selfconnected',
    value: function selfconnected() {
      for (var id in this.list) {
        var neuron = this.list[id];
        if (!neuron.selfconnected()) return false;
      }
      return true;
    }
  }, {
    key: 'connected',
    value: function connected(layer) {
      var connections = 0;
      for (var here in this.list) {
        for (var there in layer.list) {
          var from = this.list[here];
          var to = layer.list[there];
          var connected = from.connected(to);
          if (connected.type == 'projected') connections++;
        }
      }
      if (connections == this.size * layer.size) return Layer.connectionType.ALL_TO_ALL;
      connections = 0;
      for (var neuron in this.list) {
        var from = this.list[neuron];
        var to = layer.list[neuron];
        var connected = from.connected(to);
        if (connected.type == 'projected') connections++;
      }
      if (connections == this.size) return Layer.connectionType.ONE_TO_ONE;
    }
  }, {
    key: 'clear',
    value: function clear() {
      for (var id in this.list) {
        var neuron = this.list[id];
        neuron.clear();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      for (var id in this.list) {
        var neuron = this.list[id];
        neuron.reset();
      }
    }
  }, {
    key: 'neurons',
    value: function neurons() {
      return this.list;
    }
  }, {
    key: 'add',
    value: function add(neuron) {
      neuron = neuron || new Neuron();
      this.list.push(neuron);
      this.size++;
    }
  }, {
    key: 'set',
    value: function set$$1(options) {
      options = options || {};
      for (var i in this.list) {
        var neuron = this.list[i];
        if (options.label) neuron.label = options.label + '_' + neuron.ID;
        if (options.squash) neuron.squash = options.squash;
        if (options.bias) neuron.bias = options.bias;
      }
      return this;
    }
  }]);
  return Layer;
}();
Layer.connectionType = connectionType;
Layer.gateType = gateType;

var Perceptron = function (_Network) {
  inherits(Perceptron, _Network);
  function Perceptron() {
    classCallCheck(this, Perceptron);
    var _this = possibleConstructorReturn(this, (Perceptron.__proto__ || Object.getPrototypeOf(Perceptron)).call(this));
    var args = Array.prototype.slice.call(arguments);
    if (args.length < 3) throw new Error('not enough layers (minimum 3) !!');
    var inputs = args.shift();
    var outputs = args.pop();
    var layers = args;
    var input = new Layer(inputs);
    var hidden = [];
    var output = new Layer(outputs);
    var previous = input;
    for (var i = 0; i < layers.length; i++) {
      var size = layers[i];
      var layer = new Layer(size);
      hidden.push(layer);
      previous.project(layer);
      previous = layer;
    }
    previous.project(output);
    _this.set({
      input: input,
      hidden: hidden,
      output: output
    });
    return _this;
  }
  return Perceptron;
}(Network);

var LSTM = function (_Network) {
  inherits(LSTM, _Network);
  function LSTM() {
    classCallCheck(this, LSTM);
    var _this = possibleConstructorReturn(this, (LSTM.__proto__ || Object.getPrototypeOf(LSTM)).call(this));
    var args = Array.prototype.slice.call(arguments);
    if (args.length < 3) throw new Error("not enough layers (minimum 3) !!");
    var last = args.pop();
    var option = {
      peepholes: Layer.connectionType.ALL_TO_ALL,
      hiddenToHidden: false,
      outputToHidden: false,
      outputToGates: false,
      inputToOutput: true
    };
    if (typeof last != 'number') {
      var outputs = args.pop();
      if (last.hasOwnProperty('peepholes')) option.peepholes = last.peepholes;
      if (last.hasOwnProperty('hiddenToHidden')) option.hiddenToHidden = last.hiddenToHidden;
      if (last.hasOwnProperty('outputToHidden')) option.outputToHidden = last.outputToHidden;
      if (last.hasOwnProperty('outputToGates')) option.outputToGates = last.outputToGates;
      if (last.hasOwnProperty('inputToOutput')) option.inputToOutput = last.inputToOutput;
    } else {
      var outputs = last;
    }
    var inputs = args.shift();
    var layers = args;
    var inputLayer = new Layer(inputs);
    var hiddenLayers = [];
    var outputLayer = new Layer(outputs);
    var previous = null;
    for (var i = 0; i < layers.length; i++) {
      var size = layers[i];
      var inputGate = new Layer(size).set({
        bias: 1
      });
      var forgetGate = new Layer(size).set({
        bias: 1
      });
      var memoryCell = new Layer(size);
      var outputGate = new Layer(size).set({
        bias: 1
      });
      hiddenLayers.push(inputGate);
      hiddenLayers.push(forgetGate);
      hiddenLayers.push(memoryCell);
      hiddenLayers.push(outputGate);
      var input = inputLayer.project(memoryCell);
      inputLayer.project(inputGate);
      inputLayer.project(forgetGate);
      inputLayer.project(outputGate);
      if (previous != null) {
        var cell = previous.project(memoryCell);
        previous.project(inputGate);
        previous.project(forgetGate);
        previous.project(outputGate);
      }
      var output = memoryCell.project(outputLayer);
      var self = memoryCell.project(memoryCell);
      if (option.hiddenToHidden) memoryCell.project(memoryCell, Layer.connectionType.ALL_TO_ELSE);
      if (option.outputToHidden) outputLayer.project(memoryCell);
      if (option.outputToGates) {
        outputLayer.project(inputGate);
        outputLayer.project(outputGate);
        outputLayer.project(forgetGate);
      }
      memoryCell.project(inputGate, option.peepholes);
      memoryCell.project(forgetGate, option.peepholes);
      memoryCell.project(outputGate, option.peepholes);
      inputGate.gate(input, Layer.gateType.INPUT);
      forgetGate.gate(self, Layer.gateType.ONE_TO_ONE);
      outputGate.gate(output, Layer.gateType.OUTPUT);
      if (previous != null) inputGate.gate(cell, Layer.gateType.INPUT);
      previous = memoryCell;
    }
    if (option.inputToOutput) inputLayer.project(outputLayer);
    _this.set({
      input: inputLayer,
      hidden: hiddenLayers,
      output: outputLayer
    });
    return _this;
  }
  return LSTM;
}(Network);

var Liquid = function (_Network) {
  inherits(Liquid, _Network);
  function Liquid(inputs, hidden, outputs, connections, gates) {
    classCallCheck(this, Liquid);
    var _this = possibleConstructorReturn(this, (Liquid.__proto__ || Object.getPrototypeOf(Liquid)).call(this));
    var inputLayer = new Layer(inputs);
    var hiddenLayer = new Layer(hidden);
    var outputLayer = new Layer(outputs);
    var neurons = hiddenLayer.neurons();
    var connectionList = [];
    for (var i = 0; i < connections; i++) {
      var from = Math.random() * neurons.length | 0;
      var to = Math.random() * neurons.length | 0;
      var connection = neurons[from].project(neurons[to]);
      connectionList.push(connection);
    }
    for (var j = 0; j < gates; j++) {
      var gater = Math.random() * neurons.length | 0;
      var connection = Math.random() * connectionList.length | 0;
      neurons[gater].gate(connectionList[connection]);
    }
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);
    _this.set({
      input: inputLayer,
      hidden: [hiddenLayer],
      output: outputLayer
    });
    return _this;
  }
  return Liquid;
}(Network);

var Hopfield = function (_Network) {
  inherits(Hopfield, _Network);
  function Hopfield(size) {
    classCallCheck(this, Hopfield);
    var _this = possibleConstructorReturn(this, (Hopfield.__proto__ || Object.getPrototypeOf(Hopfield)).call(this));
    var inputLayer = new Layer(size);
    var outputLayer = new Layer(size);
    inputLayer.project(outputLayer, Layer.connectionType.ALL_TO_ALL);
    _this.set({
      input: inputLayer,
      hidden: [],
      output: outputLayer
    });
    _this.trainer = new Trainer(_this);
    return _this;
  }
  createClass(Hopfield, [{
    key: 'learn',
    value: function learn(patterns) {
      var set$$1 = [];
      for (var p in patterns) {
        set$$1.push({
          input: patterns[p],
          output: patterns[p]
        });
      }return this.trainer.train(set$$1, {
        iterations: 500000,
        error: .00005,
        rate: 1
      });
    }
  }, {
    key: 'feed',
    value: function feed(pattern) {
      var output = this.activate(pattern);
      var pattern = [];
      for (var i in output) {
        pattern[i] = output[i] > .5 ? 1 : 0;
      }return pattern;
    }
  }]);
  return Hopfield;
}(Network);

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var FUNC_ERROR_TEXT = 'Expected a function';
var HASH_UNDEFINED = '__lodash_hash_undefined__';
var INFINITY = 1 / 0;
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var symbolTag = '[object Symbol]';
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reEscapeChar = /\\(\\)?/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();
function getValue(object, key) {
  return object == null ? undefined : object[key];
}
function isHostObject(value) {
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}
var arrayProto = Array.prototype;
var funcProto = Function.prototype;
var objectProto = Object.prototype;
var coreJsData = root['__core-js_shared__'];
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var objectToString = objectProto.toString;
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);
var Symbol$1 = root.Symbol;
var splice = arrayProto.splice;
var Map = getNative(root, 'Map');
var nativeCreate = getNative(Object, 'create');
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function listCacheClear() {
  this.__data__ = [];
}
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);
  var index = 0,
      length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}
var stringToPath = memoize(function(string) {
  string = toString(string);
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}
memoize.Cache = MapCache;
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}
var isArray = Array.isArray;
function isFunction(value) {
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}
function toString(value) {
  return value == null ? '' : baseToString(value);
}
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}
var lodash_get = get$1;

var findClosest_1 = createCommonjsModule(function (module) {
const defaultCompare = (n1, n2) => Math.abs(n1 - n2);
const createComparerForProperty = (property) => (n1Object, n2) =>
	defaultCompare(lodash_get(n1Object, property), n2);
const findClosestIndex = (haystack, needle, comparer = defaultCompare) => {
	if (typeof comparer !== 'function') {
		comparer = createComparerForProperty(comparer);
	}
	let closest = {
		index: -1,
		distance: Number.POSITIVE_INFINITY
	};
	for (let i = 0; i < haystack.length; i++) {
		const distance = comparer(haystack[i], needle);
		if (distance === 0) {
			return i;
		}
		if (distance < closest.distance) {
			closest = {index: i, distance};
		}
	}
	return closest.index;
};
const findClosest = (array, needle, comparer) =>
	array[findClosestIndex(array, needle, comparer)];
module.exports = findClosest;
module.exports.findClosest = findClosest;
module.exports.findClosestIndex = findClosestIndex;
module.exports.defaultCompare = defaultCompare;
});

var COLLECT_RESOURCES = 'collect_resources';
var UPGRADE_CONTROLLER = 'return_resources';
var weights = [{ action: COLLECT_RESOURCES, weight: 0.00 }, { action: UPGRADE_CONTROLLER, weight: 1.00 }];
var network = new Perceptron(3, 2, 1);
function getWeightForAction(action) {
    return weights.find(function (entry) {
        return entry.action === action;
    }).weight;
}
function getActionForWeight(weight) {
    return findClosest_1(weights, weight, 'weight').action;
}
function getCreepState(creep) {
    return [creep.hits / creep.hitsMax, creep.carry.energy / creep.carryCapacity, creep.memory.drainOrGain];
}
var trainer = new Trainer(network);
function trainNetwork(data, iterations) {
    for (var i = 0; i < iterations; i++) {
        trainer.train(data);
    }
}
trainNetwork([{
    input: [1, 0, 0],
    output: [getWeightForAction(COLLECT_RESOURCES)]
}, {
    input: [1, 1, 1],
    output: [getWeightForAction(UPGRADE_CONTROLLER)]
}], 1);
var roleSystem = {
    name: 'roleSystem',
    tick: function tick(store) {
        var creeps = selectCreeps();
        creeps.forEach(function (creep) {
            try {
                store.dispatch({
                    type: getActionForWeight(network.activate(getCreepState(creep))),
                    payload: {
                        creepId: creep.id
                    }
                });
            } catch (err) {
                log('ai:', 'failed to activate network');
            }
        });
    },
    onAction: function onAction(action) {
        var creep = Game.getObjectById(action.payload.creepId);
        var goals = [];
        console.log('state', JSON.stringify(getCreepState(creep)));
        if (action.type === COLLECT_RESOURCES) {
            goals = creep.room.find(FIND_SOURCES).map(function (source) {
                return { pos: source.pos, range: 1 };
            });
        }
        if (action.type === UPGRADE_CONTROLLER) {
            goals = creep.room.find(FIND_STRUCTURES, {
                filter: { my: true, structureType: STRUCTURE_CONTROLLER }
            }).map(function (source) {
                return { pos: source.pos, range: 1 };
            });
            console.log('ret', JSON.stringify(goals));
        }
        var ret = PathFinder.search(creep.pos, goals);
        var pos = ret.path[0];
        creep.move(creep.pos.getDirectionTo(pos));
        if (action.type === COLLECT_RESOURCES) {
            var target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (target) {
                creep.harvest(target);
            }
        }
        if (action.type === UPGRADE_CONTROLLER) {
            var status = creep.upgradeController(creep.room.controller);
        }
        log('action:', JSON.stringify(action));
    }
};

var moveSystem = {
    name: 'moveSystem',
    tick: function tick() {
        var creeps = selectCreeps();
        creeps.forEach(function (creep) {
        });
    }
};



var _systems = Object.freeze({
	worldSystem: worldSystem,
	spawnSystem: spawnSystem,
	roleSystem: roleSystem,
	moveSystem: moveSystem
});

function doTicksForSystems(options) {
    var systems = options.systems,
        store = options.store;
    systems.forEach(function (system) {
        if (system.tick) {
            benchmark(system.name + ' tick', function () {
                system.tick(store);
            });
        }
    });
}
function doActionsForSytems(options) {
    var systems = options.systems,
        store = options.store;
    systems.forEach(function (system) {
        if (system.onAction) {
            benchmark(system.name + ' actions', function () {
                store.actions.forEach(function (action) {
                    system.onAction(action);
                });
            });
        }
    });
}
module.exports.loop = function () {
    benchmark('main', function () {
        storeManager(function (store) {
            var systems = selectSystems();
            doTicksForSystems({ systems: systems, store: store });
            doActionsForSytems({ systems: systems, store: store });
        });
    });
};

}());
