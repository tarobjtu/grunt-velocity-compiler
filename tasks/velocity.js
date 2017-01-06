/*
 * grunt-velocity-compiler
 * https://github.com/tarobjtu/grunt-velocity-compiler
 *
 * Copyright (c) 2015 tarobjtu(导演)
 * Licensed under the MIT license.
 */

'use strict';

var nodePath = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('velocity', 'Grunt plugin to run velocity templates through a velocity engine in an un-opinionated way', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(),
    Engine = require('velocity').Engine,
      count = 0;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      if (typeof options.data == "string" && !grunt.file.exists(options.data)) {
        grunt.log.warn('Data file"' + options.data + '" not found.');
        return false;
      }

      f.src.forEach(function(file) {
        grunt.log.ok('Processing ' + file);

        if (!grunt.file.exists(file)) {
          grunt.log.warn('Source file "' + file + '" not found.');
          return false;
        }

        parseVelocity(file, f.dest, Engine, options.data);
        count++;
      });

      grunt.log.ok('Parsed ' + count + ' file(s)');
    });

    function parseVelocity(srcFile, dest, Engine, context) {

      // read the src file
      var src = grunt.file.read(srcFile);

      var engine = new Engine({
        template: src,
        root: nodePath.resolve(options.root) // 模版文件夹绝对路径
      });

      var output = engine.render(context);

      // screen文件平铺到dest目录下
      var destFile = nodePath.basename(srcFile).replace('.vm', '.htm');
      grunt.file.write(nodePath.join(dest, destFile), output);
    }
  });

};
