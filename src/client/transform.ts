import * as Types from './types';
import getInPath from './getInPath';

function applyPlugins(plugins: Array<Function> = [], inputNode, schemaNode) {
    return plugins.reduce((pre, plugin) => plugin(pre, schemaNode), inputNode);
}

function isLeaf(schema: Types.FullSchema): schema is Types.LeafSchema {
    return typeof schema['value'] === 'function';
}

function isObject(schema: Types.FullSchema): schema is Types.ObjectSchema {
    return typeof schema['properties'] === 'object';
}

function isArray(schema: Types.FullSchema): schema is Types.ArraySchema {
    return typeof schema['children'] === 'object';
}

function doTransform(schema: Types.FullSchema, root:any, sourcePath: Types.Path, context?: any, plugins: Array<Function> = []) {
    if (isLeaf(schema)) {
        return applyPlugins(plugins, schema.value(context, root, sourcePath), schema);
    }
    if (context === undefined) {
        return applyPlugins(plugins, context, schema);
    }

    if (isObject(schema)) {
        return Object.keys(schema.properties).reduce((pre, targetPropertyName) => {
            const propertySchema = schema.properties![targetPropertyName];
            pre[targetPropertyName] = doTransform(propertySchema, root, sourcePath.concat(propertySchema.name), context[propertySchema.name], plugins);
            return pre;
        }, {});
    }

    if (isArray(schema)) {
        return context.map((a, i) => {
            const itemSourcePath = sourcePath.concat(i);
            return Object.keys(schema.children).reduce((pre, targetPropertyName) => {
                const propertySchema = schema.children![targetPropertyName];
                pre[targetPropertyName] = doTransform(propertySchema, root, itemSourcePath.concat(i), a[propertySchema.name], plugins);
                return pre;
            }, {});
        });
    }

    throw new Error('could not determin the type of the schema node');

}

export default function transform(schema: Types.FullSchema, jsonData?: any, plugins: Array<Function> = []): any {
    return doTransform(schema, jsonData, [], jsonData, []);
}