/**
 * Schema describe the structure of a node inside the whole JSON tree
 * 
 * a Schema can include two kind of infomation
 * 1. the type of the node: `primitive`(number, string, null, undefined), and `compound`(mixed with `primitive` and Object)
 * 2. the value if it's a primitive node, or the inner structure if it's a compound node
 */
import {SimplifiedSchema, Path, FullSchema} from './types';
export default function reviveSchema(schema: SimplifiedSchema, targetPath: Path = []): FullSchema {
    const targetName = <string> (targetPath[targetPath.length - 1] || '');

    if (typeof schema === 'string') {
        if (schema === '') {
            throw new Error('"=" could not be used without a path');
        }
        
        if (schema === '=') {
            return {
                name: targetName,
                value: (context) => context
            };
        }
        return {
            name: schema,
            value: (context) => context
        }
    }

    if (typeof schema === 'function') {
        return {
            name: targetName,
            value: schema
        };
    }

    if (typeof schema === 'object') {
        const schemaName = schema.name;
        const name = (schemaName === undefined || schemaName === '=') ? targetName : schemaName;
        function parseHashSchema(hashSchemaMap, p) {
            return Object.keys(hashSchemaMap).reduce((s, key) => {
                s[key] = reviveSchema(hashSchemaMap[key], p.concat(key));
                return s;
            }, {});
        }
        if (schema['properties']) {
            return {
                ...<Object>schema,
                name,
                properties: parseHashSchema(schema['properties'], targetPath.concat(name))                
            };
        }
        if (schema['children']) {
            return {
                ...<Object>schema,
                name,
                children: parseHashSchema(schema['children'], targetPath.concat(name))
            }
        }

        // it's a SimplifiedLeafSchema
        return {
            ...<Object>schema,
            name,
            value: schema['value'] ? schema['value'] : (context) => context
        };
    }

    throw new Error(`could not parse the schema: ${JSON.stringify(schema)}`);
}