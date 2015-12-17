var util = require("util");
util.print = process.stdout.write.bind(process.stdout);

module.exports = function(grunt){
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      build: [ "mustbe/**/*.js" ]
    },

    jasmine_nodejs: {
      options: {
        specNameSuffix: "specs.js"
      },
      reporters: {
        console: {
          colors: true,
          listStyle: "indent"
        },
      },
      all: {
        specs: ["specs/**"],
      }
    },

    watch: {
      specs: {
        files: ["mustbe/**/*.js", "specs/**/*.js"],
        tasks: ["specs"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-jasmine-nodejs");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("specs", ["jshint", "jasmine_nodejs:all"]);
  grunt.registerTask("default", ["specs", "watch"]);
};
