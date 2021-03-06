require("mocha-as-promised")();
var chai = require('chai')
var expect = chai.expect
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

var strftime = require('mout/date/strftime')

var template = require('./tpl')

describe('Template System', function() {

    describe('Type Text', function() {
        it('should replace text with given parameters', function() {
            return expect(template.render(template.item('vt_text', {'test': 'foo'}))).to.eventually.be.eql('<div>foo</div>')
        })

        it('should convert non text values to a string with JSON.stringify', function() {
            return expect(template.render(template.item('vt_text', {'test': {'abc': 'def'}}))).to.eventually.be.eql('<div>{"abc":"def"}</div>')
        })

        it('should escape text with htmlchars', function () {
            return expect(template.render(template.item('vt_textEscape', {'test': 'Abc "def" ghj <klm>nop'}))).to.eventually.be.eql('<div>Abc &quot;def&quot; ghj &lt;klm&gt;nop</div>')
        })
    })

    describe('Type Date', function() {
        it('should replace date tag', function() {
            return expect(template.render(template.item('vt_date1', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>1970-01-02</div>')
        })

        it('should display date with custom format', function() {
            return expect(template.render(template.item('vt_date2', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>02.01.1970</div>')
        })

        it('should use testDate type with custom options', function() {
            return expect(template.render(template.item('vt_date3', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>01.02.1970</div>')
        })

        it('should parse date from ISO8601 string', function() {
            return expect(template.render(template.item('vt_date4', {'test': '1970-01-02'}))).to.eventually.be.eql('<div>'+Date.UTC(1970, 0, 2) / 1000+'</div>')
        })
    })

    describe('Type Number', function() {
        it('should replace number tag and round up', function() {
            return expect(template.render(template.item('vt_number1', {'test': 1.55}))).to.eventually.be.eql('<div>2</div>')
        })

        it('should replace number tag and round down', function() {
            return expect(template.render(template.item('vt_number1', {'test': 1.49}))).to.eventually.be.eql('<div>1</div>')
        })

        it('should display number with custom format', function() {
            return expect(template.render(template.item('vt_number2', {'test': 1.55}))).to.eventually.be.eql('<div>1,55</div>')
        })

        it('should use testNumber type with custom options', function() {
            return expect(template.render(template.item('vt_number3', {'test': 1234.55}))).to.eventually.be.eql('<div>1.234,550</div>')
        })

        it('should display number with pad options', function() {
            return expect(template.render(template.item('vt_number4', {'test': 12.55}))).to.eventually.be.eql('<div>__12.55</div>')
        })

        it('should display number with prefix and suffix', function() {
            return expect(template.render(template.item('vt_number5', {'test': 12.55}))).to.eventually.be.eql('<div>$12.55%</div>')
        })
    })

    describe('Type Partial', function() {
        it('should replace partial tag with given template', function() {
            return expect(template.render(template.item('vt_partial1'))).to.eventually.be.eql('<div>ab</div>')
        })

        it('should accept item', function() {
            var innerItem = template.item('vt_partial3_p1', {'test': 'p1'});
            var item = template.item('vt_partial2', {'test': innerItem});

            return expect(template.render(item)).to.eventually.be.eql('<div>ap1b</div>')
        })

        it('should replace dynPartial tag', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}))

            return expect(template.render(template.item('vt_partial3', {'test': items}))).to.eventually.be.eql('<div>ap1bcp2d</div>')
        })

        it('should order the items', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}, 2))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_partial3', {'test': items}))).to.eventually.be.eql('<div>cp2dap1b</div>')
        })

        it('should not render items with render = false', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}, 2, false))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_partial3', {'test': items}))).to.eventually.be.eql('<div>cp2d</div>')
        })

        it('should support multiple formats as items and sort them correctly', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': ' ps3 '}, 3))
            items.push({'test': ' op2 '})
            items.push('vt_partial3_p3')
            items.push(template.item('vt_partial3_p1', {'test': ' ps1 '}, 1))
            items.push(template.item('vt_partial3_p1', {'test': ' ps2 '}, 2))

            return expect(template.render(template.item('vt_partial2', {'test': items}))).to.eventually.be.eql('<div>a ps1 ba ps2 ba ps3 bc op2 def</div>')
        })

        it('should takeover values passed in the typeTag', function() {
            return expect(template.render(template.item('vt_partial4'))).to.eventually.be.eql('<div><div>partial4name partial4title</div></div>')
        })

        it('should takeover values passed in the typeTag but merge them with controller given', function() {
            return expect(template.render(template.item('vt_partial4', {'name': 'controller4name'}))).to.eventually.be.eql('<div><div>controller4name partial4title</div></div>')
        })

        it('should takeover values passed in the typeTag but merge them with controller given for multiple items', function() {
            return expect(template.render(template.item('vt_partial4', {'test': [{'name': 'a'}, {'name': 'b', 'title': 'c'}, {'title': 'd'}]}))).to.eventually.be.eql('<div><div>a partial4title</div><div>b c</div><div>partial4name d</div></div>')
        })
    })

    describe('Type Boolean', function() {
        it('should replace boolean tag with custom true', function() {
            return expect(template.render(template.item('vt_boolean1', {'test': true}))).to.eventually.be.eql('<div>yes</div>')
        })

        it('should replace boolean tag with custom false', function() {
            return expect(template.render(template.item('vt_boolean1', {'test': false}))).to.eventually.be.eql('<div>no</div>')
        })

        it('should replace boolean tag with true', function() {
            return expect(template.render(template.item('vt_boolean2', {'test': true}))).to.eventually.be.eql('<div>true</div>')
        })

        it('should replace boolean tag with false', function() {
            return expect(template.render(template.item('vt_boolean2', {'test': false}))).to.eventually.be.eql('<div>false</div>')
        })
    })

    describe('Auto Casting for Types', function() {
        it('should autocast boolean to boolean', function() {
            return expect(template.render(template.item('vt_autocast', {'test': true}))).to.eventually.be.eql('<div>true</div>')
        });

        it('should autocast date to date', function() {
            return expect(template.render(template.item('vt_autocast', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>1970-01-02</div>')
        });

        it('should autocast number to number', function() {
            return expect(template.render(template.item('vt_autocast', {'test': 12345678.9}))).to.eventually.be.eql('<div>12,345,679</div>')
        });

        it('should autocast string to text', function() {
            return expect(template.render(template.item('vt_autocast', {'test': '000123.9ABC'}))).to.eventually.be.eql('<div>000123.9ABC</div>')
        });

        it('should autocast item to partial', function() {
            var item = template.item('vt_partial3_p1', {'test': 'p1'});
            return expect(template.render(template.item('vt_autocast', {'test': item}))).to.eventually.be.eql('<div>ap1b</div>')
        });

        it('should autocast array with items to partial', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}, 2))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_autocast', {'test': items}))).to.eventually.be.eql('<div>cp2dap1b</div>')
        });

        it('should autocast array with objects to partial and set the object as values when a tpl is set on the typeTag', function() {
            var items = [{'test': 'p1'},{'test': 'p2'}]
            return expect(template.render(template.item('vt_autocast', {'test': items}))).to.eventually.be.eql('<div>ap1bap2b</div>')
        });

        it('should autocast array to partial', function() {
            return expect(template.render(template.item('vt_autocast', {'test': [1, 'vt_partial3_p1', 3]}))).to.eventually.be.eql('<div>1ab3</div>')
        });
    })

    describe('DataController', function() {
        it('should manipulate all item values', function() {
            return expect(template.render(template.item('vt_dataController', {'test': "abc"}))).to.eventually.be.eql('<div>1970-01-02</div>')
        })
    })

    describe('Error Handling', function() {
        it('should give the right position of the typeTag in the template if type is invalid', function() {
            return expect(template.render(template.item('err_t1', {'test': 'foo'}))).to.eventually.be.rejectedWith('ERROR WITH TYPE: {\'key\': \'test2} in Template: err_t1:9:36')
        })

        it('should give the right position of the Type in the template if type doesn\'t exist', function() {
            return expect(template.render(template.item('err_t2', {'test': 'foo'}))).to.eventually.be.rejectedWith('typeController "Foo" not available. From: err_t2:14:13')
        })

        it('should throw an error that the render method is missing in "Wrong" TypeController', function() {
            return expect(template.render(template.item('err_t3', {'test': 'foo'}))).to.eventually.be.rejectedWith('Render method not implemented in TypeConrtoller: Wrong From:err_t3:1:8')
        })

        it('should throw an error that the parse method is missing in "Wrong" DataController', function() {
            return expect(template.render(template.item('err_t4', {'test': 'foo'}))).to.eventually.be.rejectedWith('Parse method not implemented in DataController: Wrong From:err_t4:1:8')
        })
    })

    describe('Basics', function() {
        it('should use session variable for option to render the date format', function() {
            return expect(template.render(template.item('session_date', {'test': new Date(1970, 0, 2)}), {'formats': {'date': '%m.%d.%Y'}})).to.eventually.be.eql('<div>01.02.1970</div>')
        })

        it('should replace vartype value with session variable', function () {
            return expect(template.render(template.item('session_date2', {'test': new Date(1970, 0, 2)}), {'dateFormat': '%m.%d.%Y'})).to.eventually.be.eql('<div>01.02.1970</div>')
        })

        it('should replace all same typeTags with the first result', function() {
            return expect(template.render(template.item('same_replace', {'test': 'abc'}))).to.eventually.be.eql('<div>abc</div>\n<div>abc</div>\n<div>abc</div>\n<div>abc</div>\n<div>abc</div>\n<div>abc</div>\n<div>abc</div>\n<div>abc</div>\n<div>abc</div>')
        })

        it('should be possible to use a short form of typeTags', function() {
            return expect(template.render(template.item('vt_short', {'test': 'abc'}))).to.eventually.be.eql('<div>abc</div>')
        })

        it('should be possible to use a short form of typeTags with the type', function() {
            return expect(template.render(template.item('vt_short2', {'test': '12'}))).to.eventually.be.eql('<div>12,000</div>')
        })

        it('should prefill values when a key is given', function () {
            return expect(template.render(template.item('key_prefill', {'test': new Date(1970, 0, 2), 'customer': {'locale': 'de_DE'}}))).to.eventually.be.eql('<div> 2. Januar 1970</div>')
        })
    })

    describe('Form Helpers', function() {
        it('should return option elements', function() {
            return expect(template.render(template.item('form/option1', {'options': {'key1': 'value1', 'key2': 'value2', 'key3': 'value3'}, 'test': [{'key2': 'value2'},{'key3': 'value3'}]}))).to.eventually.be.eql('<select name="test" id="test">\n    <option value="key1">value1</option><option value="key2" selected>value2</option><option value="key3" selected>value3</option>\n</select>')
        })

        it('should return option elements', function() {
            return expect(template.render(template.item('form/option1', {'options': [{'value': 'key1', 'label': 'value1'}, {'value': 'key2', 'label': 'value2'}, {'value': 'key3', 'label': 'value3'}], 'test': [{'key2': 'value2'},{'key3': 'value3'}]}))).to.eventually.be.eql('<select name="test" id="test">\n    <option value="key1">value1</option><option value="key2" selected>value2</option><option value="key3" selected>value3</option>\n</select>')
        })
    })

    describe('Performance Test', function () {
        xit('should be fast :D', function () {
            var start = [];
            var dateval = new Date()
            var partialval = [];

            for (var i = 0; i < 10; i++) {
                partialval.push(template.item('speed3', {
                    'headline1': 'h1 ' + i,
                    'headline2': 'h2 ' + i,
                    'headline3': 'h3 ' + i,
                    'headline4': 'h4 ' + i,
                    'headline5': 'h5 ' + i,
                    'headline6': 'h6 ' + i,
                    'dateval': dateval,
                    'numberval': 12.34,
                    'partialval': []
                }, i))
            }

            for (var i = 0; i < 15; i++) {
                start.push(template.item('speed2', {
                    'headline1': 'h1 ' + i,
                    'headline2': 'h2 ' + i,
                    'headline3': 'h3 ' + i,
                    'headline4': 'h4 ' + i,
                    'headline5': 'h5 ' + i,
                    'headline6': 'h6 ' + i,
                    'dateval': dateval,
                    'numberval': 12.34,
                    'partialval': partialval
                }, i))
            }
            var startTime = Date.now()
            return template.render(template.item('speed', {'start': start})).then(function (res) {
                var endTime = Date.now()
                console.log('diff', endTime - startTime, 'length', res.length)
            })
        })
    })

});