module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    path: {
      host: 'public',
      dev: 'public/assets',
      build: 'public/build'
    },

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['<%= path.build %>/js/main.js']
    },

    concurrent: {
      target: {
        tasks: ['connect', 'watch', 'clean', 'concat'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    concat: {
      scripts: {
        src: [
          '<%= path.dev %>/js/util.js',
          '<%= path.dev %>/js/obj.js',
          '<%= path.dev %>/js/core.js',
          '<%= path.dev %>/js/pub.js',
          '<%= path.dev %>/js/mods/**/*.js',
          '<%= path.dev %>/js/init.js'
        ],
        dest: '<%= path.build %>/js/main.js',
      },
      styles: {
        src: [
          '<%= path.dev %>/css/core/normalize.css',
          '<%= path.dev %>/css/core/grid.css',
          '<%= path.dev %>/css/core/global.css',
          '<%= path.dev %>/css/core/buttons.css',
          '<%= path.dev %>/css/core/icons.css',
          '<%= path.dev %>/css/modules/*.css'
        ],
        dest: '<%= path.build %>/css/main.css',
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: '<%= path.host %>/',
          keepalive: 'true'
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', '<%= path.dev %>/js/**/*.js']
    },

    watch: {
      options: {
        atBegin: true
      },
      scripts: {
        files: ['Gruntfile.js', '<%= path.dev %>/js/**/*.js', '<%= path.dev %>/css/**/*.css'],
        tasks: ['concat', 'jshint']
      }
    },

    jsdoc: {
      dist: {
        src: ['README.md', '<%= path.dev %>/js/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
      my_target: {
        options: {
          sourceMap: true,
          sourceMapName: '<%= path.build %>/sourcemap.map'
        },
        files: {
          '<%= path.build %>/js/main.min.js': ['<%= path.dev %>/js/main.js']
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
  grunt.loadNpmTasks('grunt-evil-icons');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:target']);
};