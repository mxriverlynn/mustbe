module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    meta: {
      version: "<%= pkg.version %>",
      banner:
        "// backbone.fwd\n" + 
        "// ------------\n" + 
        "// Forward events from a source, through a target object\n" + 
        "// \n" + 
        "// v<%= pkg.version %>\n" +
        "// Copyright (C)<%= grunt.template.today('yyyy') %> Muted Solutions, LLC.\n" + 
        "// Distributed under MIT license\n" + 
        "// \n" +
        "// https://github.com/derickbailey/backbone.fwd\n" +
        "\n"
    },

    assets: {
      underscore: "node_modules/underscore/underscore.js",
      backbone: "node_modules/backbone/backbone.js"
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      build: [ 'src/*.js' ]
    },

    concat: {
      options: {
        banner: "<%= meta.banner %>"
      },
      dist: {
        src: ["src/backbone.fwd.js"],
        dest: "dist/backbone.fwd.js",
      },
    },

    uglify: {
      options: {
        banner: "<%= meta.banner %>"
      },
      dist: {
        files: {
          "dist/backbone.fwd.min.js": ["<%= concat.dist.dest %>"]
        }
      }
    },

    jasmine : {
      options : {
        helpers : [
          "specs/helpers/**/*.js"
        ],
        specs: "specs/*Specs.js",
        vendor : [
          "<%= assets.underscore %>",
          "<%= assets.backbone %>"
        ],
        keepRunner: true
      },
      all: {
        src: ["src/backbone.fwd.js"]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("specs", ["jshint", "jasmine:all"]);
  grunt.registerTask("default", ["jshint", "specs", "concat", "uglify"]);
};
