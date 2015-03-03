/**
 * Created by W.Y.Park on 2015-03-03.
 */
requirejs.config({
    baseUrl: "/js",
    paths: {
        'jquery': [
            '/js/jquery',
            '//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min'
        ],
        'underscore': [
            '/js/underscore.min',
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min'
        ],
        'backbone': [
            'js/backbone.min',
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min'
        ]
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    waitSecondes: 15
});