var cssParser = require('css');
var merge = require('merge');

var defaults = require('./defaults');

module.exports = function legacssy(css, opts) {
    var options = merge(defaults, opts);

    var isUnsupported = function (media) {
        // Tokens `only` and `not` are new in CSS3
        // Every expression has to start with `(`
        var re = /(only)|(not)|(\()/;

        return !!media.match(re);
    };

    var isMatching = function (media) {
        var queries = media.split(/\s*,\s*/);

        for (var i = 0; i < queries.length; i++) {
            // RegExps are based on ones from scottjehl/Respond
            var minw = queries[i].match( /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)[^\d\)]*\s*\)/ ) && parseFloat( RegExp.$1 ),
                maxw = queries[i].match( /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)[^\d\)]*\s*\)/ ) && parseFloat( RegExp.$1 );

            // If this does not match, move to the next
            if ((minw && minw > options.legacyWidth) ||
                (maxw && maxw < options.legacyWidth)) {
                continue;
            }

            // Match found
            return true;
        }

        return false;
    };

    var stripMediaQueries = function (rules, innerOnly) {
        var tmp = [];
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].type === "media" && isUnsupported(rules[i].media)) {
                if (!options.matchingOnly || isMatching(rules[i].media)) {
                    tmp = tmp.concat(stripMediaQueries(rules[i].rules, false));
                }
            } else {
                if (!innerOnly) {
                    tmp.push(rules[i]);
                }
            }
        }
        return tmp;
    };

    var style = cssParser.parse(css);
    style.stylesheet.rules = stripMediaQueries(style.stylesheet.rules, options.overridesOnly);

    return cssParser.stringify(style);
};
