var test = require('tape');
var legacssy = require('../src/legacssy');
var fs = require('fs');

var options = {encoding: 'utf-8'};
var input = fs.readFileSync('./test/fixtures/test.css', options);

test('default options', function (t) {
    t.plan(1);

    var output = legacssy(input);
    var expectedOutput = fs.readFileSync('./test/expected/default_options.css', options);

    t.equal(output, expectedOutput);
});

test('overrides only options', function (t) {
    t.plan(1);

    var output = legacssy(input, {overridesOnly: true});
    var expectedOutput = fs.readFileSync('./test/expected/overrides_only.css', options);

    t.equal(output, expectedOutput);
});
