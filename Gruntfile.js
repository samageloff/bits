module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['www-root/js/dist/build.js']
    },

    concat: {
      dist: {
        src: ['www-root/js/src/core.js', 'www-root/js/src/mods/**/*.js', 'www-root/js/src/init.js'],
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
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'concat']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'connect',
    'watch',
    'clean',
    'concat'
  ]);
};