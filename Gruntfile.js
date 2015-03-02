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
      scripts: {
        src: [
          'www-root/js/src/util.js',
          'www-root/js/src/obj.js',
          'www-root/js/src/core.js',
          'www-root/js/src/pub.js',
          'www-root/js/src/mods/**/*.js',
          'www-root/js/src/init.js'
        ],
        dest: 'www-root/js/dist/build.js',
      },
      styles: {
        src: [
          'www-root/css/normalize.css',
          'www-root/css/grid.css',
          'www-root/css/global.css',
          'www-root/css/buttons.css',
          'www-root/css/accordion.css',
          'www-root/css/slideshow.css',
          'www-root/css/tabs.css'
        ],
        dest: 'www-root/css/dist/styles.css',
      }
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
        files: ['Gruntfile.js', 'www-root/js/src/**/*.js', 'www-root/css/*.css'],
        tasks: ['concat', 'jshint']
      }
    },

    jsdoc: {
      dist: {
        src: ['README.md', 'www-root/js/src/**/*.js'],
        options: {
          destination: 'doc'
        }
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
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:target']);
};