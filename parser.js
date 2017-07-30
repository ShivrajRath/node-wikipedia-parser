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
            $("img").replaceWith(function() {
                return $("<img src =" + $(this).attr('src').replace(/\/thumb|\/\d+px.*$/g, '') + ">" + "</span>");
            });
        },

        /**
         * Parses the content into various sections
         * Supported sections - Thumbnail, paragraphs, blockquote, h2, h3, h4
         * Other sections: Div, Table, ul
         */
        getSections: function() {

            var sections = [{
                index: 1,
                type: 'h3',
                text: this.getTitle(),
                subSections: []
            }];

            var i = 0;

            var currSection = sections[i];

            $('.mw-parser-output').children().each(function() {
                var el = $(this);
                var nodeName = el.prop('nodeName').toLowerCase();
                var text = el.text().trim();
                if (text) {
                    switch (nodeName) {
                        case 'p':
                        case 'h3':
                        case 'h4':
                        case 'blockquote':
                            currSection.subSections.push({
                                type: nodeName,
                                text: text
                            });
                            break;
                        case 'h2':
                            sections.push({
                                type: 'h2',
                                text: text,
                                subSections: []
                            });

                            currSection = sections[++i];
                            break;
                            // Store the html
                        default:
                            // Thumbnail humbnails case
                            if (el.hasClass('thumb')) {
                                // Multiple caption image
                                if (el.hasClass('tmulti')) {
                                    el.find('tsingle').each(function() {
                                        currSection.subSections.push({
                                            type: 'img',
                                            src: $(this).find('img').attr('src'),
                                            caption: $(this).find('.thumbcaption').text().trim()
                                        });
                                    });
                                }
                                else {
                                    currSection.subSections.push({
                                        type: 'img',
                                        src: el.find('img').attr('src'),
                                        caption: el.find('.thumbcaption').text()
                                    });
                                }
                            }
                            else {
                                currSection.subSections.push({
                                    isHTML: true,
                                    type: nodeName,
                                    text: el.html()
                                });
                            }
                    }
                }
            });

            return sections;
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

        getMainImage: function() {

        },

        /**
         * Main parsing logic
         */
        parse: function(body) {
            this.setDom(body);
            this.sanitize();
            //return $.html();
            return {
                title: this.getTitle(),
                mainImg: this.getMainImage(),
                sections: this.getSections()
            };
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
