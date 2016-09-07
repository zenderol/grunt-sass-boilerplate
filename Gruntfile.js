module.exports = function(grunt) {
    var mozjpeg = require('imagemin-mozjpeg');

    grunt.initConfig({

        // Package
        pkg: grunt.file.readJSON('package.json'),

        // Compass
        compass: {
            build: {
                options: {
                    sassDir: 'assets/sass',
                    cssDir: 'assets/css',
                    outputStyle: 'compressed'
                }
            }
        },

        // Clean
        clean: {
            pre: ['styleguide', 'assets/css', 'dist/*'],
            post: ['.sass-cache']
        },

        // Watch
        watch: {
            sass: {
                files: ['assets/sass/**/*.{sass,scss}'],
                tasks: ['compass', 'sassdown']
            }
        },

        // Sassdown (Styleguide)
        sassdown: {
            options: {
                assets: ['assets/css/*.css']
            },
            files: {
                expand: true,
                cwd: 'assets/sass/partials',
                src: ['**/*.{sass,scss}'],
                dest: 'styleguide/'
            }
        },
        imagemin: {                          // Task
            static: {                          // Target
                options: {                       // Target options
                    optimizationLevel: 4,
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]
                },
                files: {                         // Dictionary of files
                    'dist/img.png': 'src/img.png', // 'destination': 'source'
                    'dist/img.jpg': 'src/img.jpg',
                    'dist/img.gif': 'src/img.gif'
                }
            },
            dynamic: {                         // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/',                   // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'dist/'                  // Destination path prefix
                }]
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.js',
                    dest: 'dist/'
                }]
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip',
                    level: 9
                },
                expand: true,
                cwd: 'dist/',
                src: ['**/*.js'],
                ext: '.js.gz',
                dest: 'dist/'
            }
        },
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'src/index.html'     // 'destination': 'source'
                }
            }
        }

    });

    // Load NPM Tasks
    grunt.loadNpmTasks('sassdown');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Register Grunt tasks
    grunt.registerTask('default', ['clean:pre','uglify','compress_images','compress','htmlmin', 'clean:post']);
    grunt.registerTask('compress_images', ['imagemin:dynamic']);
  
};
