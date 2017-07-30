/**
 * @description: Parses wikipedia page
 * @author: Shivraj Rath
 */

(function() {
    'use strict';

    var request = require('request'),
        cheerio = require('cheerio'),
        config = require('./CONFIG.json');

    var $;

    // Private
    var _$ = {
        /*
         * Ignore list of elements
         */
        ignoreList: ["head", "script", "link", ".reference", ".toc",
            ".refbegin", ".reflist", ".noprint", ".navigation-not-searchable",
            ".vertical-navbox", ".mw-jump", ".navbox", "#mw-navigation", "#footer",
            ".catlinks", ".printfooter"
        ],

        ignoreSections: ["#References"],

        /**
         * Sets the dom
         */
        setDom: function(body) {
            $ = cheerio.load(body);
        },

        /**
         * Sanitize the page
         */
        sanitize: function() {
            this.ignoreList.forEach(function(elStr) {
                $(elStr).remove();
            });

            // Replaces anchor tag with span tags
            $("a").replaceWith(function() {
                return $("<span>" + $(this).html() + "</span>");
            });
            
            // Get full resolution of image
            // $("img").replaceWith(function() {
            //     return $("<img src =" + $(this).attr('src').replace(/\/thumb|\/\d+px.*$/g, '') + ">" + "</span>");
            // });
        },
        
        /**
         * Parses the content into various sections
         * Supported sections - Thumbnail, paragraphs, h3, h2
         */
        getSections: function(){
           $('')  
        },

        /**
         * Get the title of the page
         */
        getTitle: function() {
            try {
                return $('.firstHeading').text();
            }
            catch (err) {
                console.log(err);
            }
        },
        
        getMainImage: function(){
            
        },

        /**
         * Main parsing logic
         */
        parse: function(body) {
            this.setDom(body);
            this.sanitize();
            return $.html();
        }
    };

    // Public
    module.exports = {
        parse: function(url, func) {
            if (!url) {
                func(config.err.No_URL);
            }
            else {
                request(url, function(error, response, body) {
                    if (error) {
                        func(error);
                    }
                    else {
                        func(_$.parse(body));
                    }
                });
            }
        }
    };

})();
