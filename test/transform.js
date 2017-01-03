const {reviveSchema, transform} = require('../build/main.js');
const assert = require('assert');

let hashSchema = {
    properties: {
        tx1: 'sx1',
        tx3: '=',
        tz1: () => 1,
        ty: {
            name: 'oy',
            test: '1',
            properties: {
                tk1: 'ok2',
                tk2: 'ok3'
            }
        },
        tz: {
            name: 'oy2',
            children: {
                tk1: 'ok2'
            }
        }
    }
}

let arrScehema = {
    children: {
        tk: 'ok'
    }
};

let fullHashSchema = reviveSchema(hashSchema);
let fullArrarySchema = reviveSchema(arrScehema);

describe('transformation should work as expected', () => {
    it('transform', () => {
        const resultObj = transform(fullHashSchema, {
            sx1: 1,
            tx3: 2,
            oy: {
                ok2: 3,
                ok3: 4
            },
            oy2: [{
                ok2: 1,
            }, {
                ok2: 2
            }]
        });

        const resultArr = transform(fullArrarySchema, [
            {ok: 1},
            {ok: 2}
        ]);

        assert.equal(JSON.stringify(resultObj), '{"tx1":1,"tx3":2,"tz1":1,"ty":{"tk1":3,"tk2":4},"tz":[{"tk1":1},{"tk1":2}]}');
        assert.equal(JSON.stringify(resultArr), '[{"tk":1},{"tk":2}]');
    });
});