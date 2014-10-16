(function() {
  var colors, exec, program, version,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  exec = require('child_process').exec;

  colors = require('colors');

  program = require('commander');

  version = require(__dirname + '/../package.json').version;

  module.exports = function() {
    program.version(version).parse(process.argv);
    return exec('brew list | xargs brew deps --tree', function(err, lines) {
      var current, deps, i, info, line, name, pkgs, tree, _deps, _i, _j, _len, _name, _ref, _ref1;
      tree = {};
      current = '';
      _ref = lines.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        line = String(line).trim();
        switch (true) {
          case line.length === 0:
            continue;
          case /^\|\-/.test(line):
            tree[current].push(line.replace(/^[\||\-|\s]+/, ''));
            break;
          case /^\|\s/.test(line):
            continue;
          default:
            tree[current = line] = [];
        }
      }
      pkgs = {};
      for (name in tree) {
        deps = tree[name];
        if (program.args.length) {
          if (__indexOf.call(program.args, name) < 0) {
            continue;
          }
        }
        pkgs[name] = {
          deps: deps,
          from: [],
          removable: false
        };
        for (_name in tree) {
          _deps = tree[_name];
          if (__indexOf.call(_deps, name) >= 0) {
            pkgs[name].from.push(_name);
          }
        }
        pkgs[name].removable = pkgs[name].from.length === 0;
      }
      if (Object.keys(pkgs).length === 0) {
        console.error("no such package installed: " + program.args);
        process.exit(1);
      }
      for (name in pkgs) {
        info = pkgs[name];
        process.stdout.write('\n');
        if (info.from.length) {
          console.log(colors.red(name));
        } else {
          console.log(colors.blue(name));
        }
        for (i = _j = 0, _ref1 = (name.length < 5 ? 5 : name.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          process.stdout.write('-');
        }
        process.stdout.write('\n');
        if (!!info.from.length) {
          console.log(colors.bold("packages require " + name + ":"));
          console.log(info.from.join(', '));
        }
        if (!!info.from.length && !!info.deps.length) {
          process.stdout.write('\n');
        }
        if (!!info.deps.length) {
          console.log(colors.bold("" + name + " requires:"));
          console.log(info.deps.join(', '));
        }
        process.stdout.write('\n');
      }
      return process.exit(0);
    });
  };

}).call(this);
