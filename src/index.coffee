{exec} = require 'child_process'

colors = require 'colors'
program = require 'commander'
{version} = require __dirname + '/../package.json'

module.exports = ->

  program
    .version version
    .parse process.argv

  exec 'brew list | xargs brew deps --tree', (err, lines) ->
    tree = {}
    current = ''

    for line in lines.split '\n'
      line = String(line).trim()
      switch true
        when line.length is 0
          continue
        when /^\|\-/.test line
          tree[current].push line.replace /^[\||\-|\s]+/, ''
        when /^\|\s/.test line
          continue
        else
          tree[current = line] = []

    pkgs = {}
    for name, deps of tree
      if program.args.length
        continue unless name in program.args
      pkgs[name] = {deps, from: [], removable: false}
      pkgs[name].from.push _name for _name, _deps of tree when name in _deps
      pkgs[name].removable = pkgs[name].from.length is 0

    if Object.keys(pkgs).length is 0
      console.error "no such package installed: #{program.args}"
      process.exit 1

    for name, info of pkgs
      process.stdout.write '\n'
      if info.from.length
        console.log colors.red name
      else
        console.log colors.blue name
      for i in [0...(if name.length < 5 then 5 else name.length)]
        process.stdout.write '-'
      process.stdout.write '\n'
      if !!info.from.length
        console.log colors.bold "packages require #{name}:"
        console.log info.from.join ', '
      if !!info.from.length and !!info.deps.length
        process.stdout.write '\n'
      if !!info.deps.length
        console.log colors.bold "#{name} requires:"
        console.log info.deps.join ', '
      process.stdout.write '\n'

    process.exit 0

