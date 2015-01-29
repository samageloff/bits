module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      dev: {
        src: ['build/app.js', 'build/main.css', 'build/<%= pkg.name %>.js']
      },
      prod: ['dist']
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/src/core.js', 'js/src/mods/**/*.js', 'js/src/init.js'],
        dest: 'js/dist/build.js',
      },
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'www-root',
          keepalive: 'true'
        }
      }
    },

    watch: {
      all: {
        options: {
          livereload: true
        },
      },
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint:all', 'clean', 'concat', 'copy']
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js']
    }

  });

  // Default task(s).
  grunt.registerTask('default', [
    'connect',
    'watch',
    'jshint',
    'concat'
  ]);
};