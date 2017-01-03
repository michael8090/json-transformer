# a declarative and extendable json transformer
---

## why
Based on my experience, it's a common situation where the JSON data returned from server need to be transformed to meet the requirement of your client model. That's where this transformer comes in.

## features

* a `JSON Schema`-like structure to describe the JSON declarativly
* extendable via plugins

## install

```bash
npm install --save json-shapper
```

## usage
define a schema via `simplified schema`:

```js
const {reviveSchema, transform} = require('jsonate');

//
let hashSchema = {
    // `properties` indicate it's a object
    properties: {
        // sx1 is the `source` key, the key from the server
        // tx1 is the `target` key
        tx1: 'sx1',
        // if it's a symble '=', we treat it as `tx3: 'tx3'`
        tx3: '=',
        // an arbitrary function to do the transform
        tz1: (jsonNodeData) => 1,
        // nested schema
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
            // if it's an array, use `children` instead
            children: {
                tk1: 'ok2'
            }
        }
    }
}; 

// get a full edition of the schema
const fullHashSchema = reviveSchema(hashSchema);

// transform
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

// the result 
// {
//     "tx1": 1,
//     "tx3": 2,
//     "tz1": 1,
//     "ty": {
//         "tk1": 3,
//         "tk2": 4
//     },
//     "tz": [{
//         "tk1": 1
//     }, {
//         "tk1": 2
//     }]
// }


```



