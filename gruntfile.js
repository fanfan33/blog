module.exports = function(grunt) {
    
        grunt.initConfig({
            watch: {
                ejs: {
                    files: ['views/**/*.ejs'],
                    options: {
                        livereload: true
                    }
                },
                js: {
                    files: ['public/javascripts/**', 'models/**/*.js', 'schemas/**/*.js'],
                    // tasks: ['jshint'],
                    options: {
                        livereload: true
                    }
                }
            },
            uglify: {
                my_target: {
                    files: [{
                        expand: true,
                        cwd: 'public/javascripts',
                        src: '**/*.js',
                        dest: 'public/build/js',
                        ext: '.min.js'
                    }]
                }
            },
            less: {
                development: {
                  options: {
                    paths: ['public/stylesheets'],
                    cleancss: true
                  },
                  files: {
                    'public/build/css/style.css': 'public/src/stylesheets/style.less'
                  }
                }
            },
            cssmin: {
                target: {
                    files: [{
                        expand: true,
                        cwd: 'public/build/css',
                        src: ['*.css','!*.min.css'],
                        dest: 'public/build/cssmin',
                        ext: '.min.css'
                    }]
                }
            },
            nodemon: {
                dev: {
                  script: 'bin/www',
                  options: {
                    args: [],
                    nodeArgs: [],
                    env: {
                      PORT: '4000'
                    },
                    cwd: __dirname,
                    ignore: ['node_modules/**', 'README.md'],
                    ext: 'js',
                    watch: ['app.js', 'gruntfile.js', 'routes/*.js', 'public/stylesheets/style.less'],
                    delay: 1000,
                  }
                },
            },
            concurrent: {
                dev: {
                    tasks: ['nodemon', 'watch', 'uglify', 'less', 'cssmin'],
                    options: {
                        logConcurrentOutput: true
                    }
                }
            }
        })
    
        grunt.loadNpmTasks('grunt-contrib-watch')
        grunt.loadNpmTasks('grunt-contrib-uglify')
        grunt.loadNpmTasks('grunt-contrib-cssmin')
        grunt.loadNpmTasks('grunt-contrib-nodemon')     //实时监听入口app.js文件，实现自动重启
        grunt.loadNpmTasks('grunt-concurrent')      //优化慢任务的构建时间，比如sass,less，并发执行多个阻塞的任务,比如nodemon和watch
        grunt.loadNpmTasks('grunt-contrib-less')
        grunt.option('force', true);
        grunt.registerTask('default', ['concurrent'])
    }