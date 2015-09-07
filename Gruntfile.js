module.exports = function(grunt) {

  var taskList = ['systemjs', 'uglify'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      browser_js: {
        files: ['**/*.js', '!node_modules/**/*', '!dist/**/*'],
        tasks: taskList,
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
            '!jspm_packages/**/*',
            '!dist/**/*'
        ],
        options: {
            'esnext': true,
        }
    },
    uglify: {
        compact: {
            files: {
                './dist/earthquake.min.js': ['./dist/earthquake.js']
            }
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
