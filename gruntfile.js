module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    meta: {
      version: "<%= pkg.version %>",
      banner:
        "// mustbe\n" + 
        "// ------\n" + 
        "// An authorization framework for NodeJS apps" + 
        "// \n" + 
        "// v<%= pkg.version %>\n" +
        "// Copyright (C)<%= grunt.template.today('yyyy') %> Muted Solutions, LLC.\n" + 
        "// Distributed under MIT license\n" + 
        "// \n" +
        "// https://github.com/derickbailey/mustbe\n" +
        "\n"
    },

    assets: {
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      build: [ "mustbe/*.js" ]
    },

    jasmine_node: {
      options: {
        forceExit: true,
        match: ".",
        matchall: false,
        extensions: "js",
        specNameMatcher: "Specs",
        jUnit: {
          report: true,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      },
      all: ["specs/"]
    }

  });

  grunt.loadNpmTasks("grunt-jasmine-node");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("specs", ["jshint", "jasmine_node:all"]);
  grunt.registerTask("default", ["jshint", "specs", "concat", "uglify"]);
};
