module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  var banner = '/*! <%= pkg.name %> v<%= pkg.version %> \n' +
    '* https://github.com/leider/simple-timepicker \n' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> Andreas Leidig \n' +
    '* MIT License \n' +
    '*/';
  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),
    'meta': {
      project: '<%= pkg.name %>',
      version: '<%= pkg.version %>'
    },
    eslint: {
      options: {quiet: true},
      target: ['index.js', '*.js', 'spec/*.js']
    },

    'jasmine': {
      build: {
        src: ['node_modules/jquery/dist/jquery.min.js', 'spec/js/libs/autotype/index.js', 'index.js'],
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/js/helpers/*.js',
          timeout: 100
        }
      }
    },

    'uglify': {
      compressed: {
        options: {
          banner: banner
        },
        files: {'dist/<%= pkg.name %>.min.js': 'index.js'}
      },
      uncompressed: {
        options: {
          banner: banner,
          mangle: false,
          beautify: true
        },
        files: {'dist/<%= pkg.name %>.js': 'index.js'}
      }
    }
  });

  grunt.registerTask('default', ['test', 'uglify']);
  grunt.registerTask('test', ['eslint', 'jasmine']);
};
