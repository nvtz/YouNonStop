module.exports = function (grunt) {
    
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        htmlhint: {

            build: {

                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },

                src: ['app/index.html']

            }

        },

        jshint : {

            files : ['Gruntfile.js', 'app/assets/js/younonstop.js', 'app/assets/js/modals.js'],

            options : {

                '-W086': true,
                validthis : true,
                laxcomma : true,
                laxbreak : true,
                browser : true,
                eqnull : true,
                debug : true,
                devel : true,
                boss : true,
                expr : true,
                asi : true,

                globals : {
                    jQuery : true
                },

            }

        },

        htmlmin: {

            dist: {

                options: {

                    removeComments: true,
                    collapseWhitespace: true

                },

                files: {
                    'dist/index.html': 'app/index.html',
                }

            }

        },

        concat: {

            options: {

                        
              banner: '/*!\n' +
                      '*' + '\n' +
                      '*' + ' <%= pkg.name %> - v<%= pkg.version %> - ' +
                      '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                      '*' + '\n' +
                      '*' + ' Copyright 2014 <%= pkg.author.name %> \n' +
                      '*' + '\n' +
                      '*/' + '\n\n\n',

            },

            dist: {

                src: [
                    'app/assets/js/younonstop.js',
                    'app/assets/js/modals.js'
                ],

                dest: 'app/assets/js/main.js',

            }

        },

        cssmin: {

            combine: {

                files: {

                    'app/assets/css/main.css': [
                        'app/assets/css/style.css',
                        'app/assets/libs/bootstrap-social-buttons/1.0.0/social-buttons.css'
                    ]

                }

            },

            add_banner: {

                options: {

                    banner: '/*!\n' +
                            '*' + '\n' +
                            '*' + ' <%= pkg.name %> - v<%= pkg.version %> - ' +
                            '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                            '*' + '\n' +
                            '*' + ' Copyright 2014 <%= pkg.author.name %> \n' +
                            '*' + '\n' +
                            '*/' + '\n\n',
                },

                files: {
                    'app/assets/css/main.css': ['app/assets/css/main.css']
                }

            },

            minify: {

                expand: true,
                cwd: 'app/assets/css/',
                src: ['main.css'],
                dest: 'dist/assets/css/',
                ext: '.css'

            }

        },

        uglify: {

            options: {
            
              banner: '/*!\n' +
                      '*' + '\n' +
                      '*' + ' <%= pkg.name %> - v<%= pkg.version %> - ' +
                      '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                      '*' + '\n' +
                      '*' + ' Copyright 2014 <%= pkg.author.name %> \n' +
                      '*' + '\n' +
                      '*/' + '\n\n\n',

            },
            
            build: {

                src: 'app/assets/js/main.js',
                dest: 'dist/assets/js/main.js'
                
            }

        },

        copy: {
          main: {
            expand: true,
            src: 'ico/*',
            cwd: 'app/assets/img/',
            dest: 'dist/assets/img/',
          },
        }

    });

    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['htmlhint', 'jshint', 'htmlmin', 'concat', 'cssmin', 'uglify', 'copy']);
};