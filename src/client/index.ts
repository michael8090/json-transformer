import {SimplifiedSchema} from './types';
import reviveSchema from './reviveSchema';
import transform from './transform';

let hashSchema: SimplifiedSchema = {
    name: 'test',
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

let arrScehema: SimplifiedSchema = {
    children: {
        tk: 'ok'
    }
};

let fullHashSchema = reviveSchema(hashSchema);
let fullArrarySchema = reviveSchema(arrScehema);

window['obj'] = transform(fullHashSchema, {
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

window['arr'] = transform(fullArrarySchema, [
    {ok: 1},
    {ok: 2}
]);