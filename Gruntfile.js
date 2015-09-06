module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      browser_js: {
        files: ['**/*.js', '!node_modules/**/*'],
        tasks: ['browserify:debug'],
      }
    },
    systemjs: {
        options: {
            'configFile': './config.js'
        },
        dist: {
            'src': './01_earthquake/earthquake.js',
            'dest': './dist/earthquake.js'
        }
    },
    jshint: {
        files: [
            '**/*.js',
            '!node_modules/**/*',
        ],
        options: {
        }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-systemjs-builder");
  grunt.registerTask('default', ['systemjs']);
};
