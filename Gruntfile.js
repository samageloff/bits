module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/src/core.js', 'js/src/mods/accordion.js', 'js/src/mods/slideshow.js', 'js/src/init.js'],
        dest: 'js/dist/built.js',
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
    }
  });

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'connect']);
};