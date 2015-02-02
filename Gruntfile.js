module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['www-root/js/dist/build.js']
    },

    concurrent: {
      target: {
        tasks: ['connect', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    concat: {
      dist: {
        src: [
          'www-root/js/src/core.js',
          'www-root/js/src/util.js',
          'www-root/js/src/mods/**/*.js',
          'www-root/js/src/init.js'
        ],
        dest: 'www-root/js/dist/build.js',
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

    jshint: {
      files: ['Gruntfile.js', 'www-root/js/**/*.js']
    },

    watch: {
      options: {
        atBegin: true
      },
      scripts: {
        files: ['Gruntfile.js', 'www-root/js/src/**/*.js'],
        tasks: ['concat', 'jshint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:target']);
};