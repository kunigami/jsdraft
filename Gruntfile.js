module.exports = function(grunt) {

  var DEFAULT_PROJECT = 'earthquake';

  var configsBySource = {
    earthquake: {
      src: './01_earthquake/earthquake.js',
      dest: './dist/01_earthquake/earthquake.js'
    },
    worker: {
      src: './02_worker/main.js',
      dest: './dist/02_worker/main.js'
    },
  }

  var taskList = ['systemjs'];

  var projectName = grunt.option('project') || DEFAULT_PROJECT;
  var projectConfig = configsBySource[projectName];

  if (!projectConfig) {
    console.error("Project doesn't have a configuration: " + projectName);
  }
  console.log('Generating project', projectName);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      browser_js: {
        files: ['**/*.js', '!node_modules/**/*', '!dist/**/*'],
        tasks: taskList
      }
    },
    systemjs: {
      options: {
        'configFile': './config.js',
        minify: true
      },
      dist: projectConfig
    },
    jshint: {
        files: [
            '**/*.js',
            '!node_modules/**/*',
            '!jspm_packages/**/*',
            '!dist/**/*'
        ],
        options: {
            'esnext': true,
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-systemjs-builder");
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', taskList);
  grunt.registerTask('lint', ['jshint']);
};
