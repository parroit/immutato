
var suite1 = {
    maxTime: 2,
    setup: function() {
        var Imm = immutato_prev.struct({
            name: immutato_prev.String,
            age: immutato_prev.Number
        }, 'Person');

        suite1.immPrev = new Imm({
            name: 'Andrea',
            age: 38
        });

        suite1.immCurr = immutato({
            name: 'Andrea',
            age: 38
        });

        suite1.pojo = {
            name: 'Andrea',
            age: 38
        };
        Object.freeze(suite1.pojo);
    },

    name: 'current vs prev version vs pojo -- create a copy of immutable object with changed property',

    tests: {

        'current version': function() {
            suite1.immCurr.age(42);
        },


        'previous version': function() {
            suite1.immPrev.set('age', 42);
        },

        'pojo': function() {
            var copy = assign({},suite1.pojo);
            copy.age = 42;
            Object.freeze(copy);
        }

    }
};

suite1.setup();