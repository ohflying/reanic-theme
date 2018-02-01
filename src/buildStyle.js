/**
 * Author: Jeejen.Dong
 * Date  : 2018/1/31
 * @flow
 **/

import _ from 'lodash';
import type {ComponentStyle, StyleConfig, VarGetter} from './TypeDefinition';

function getVarName(names: Array<string>): string {
    return names.join('_');
}

class StyleConfigBuilder {
    varGetter: VarGetter;
    props: Object;
    constructor(varGetter: VarGetter, props: Object) {
        this.varGetter = varGetter;
        this.props = props;
    }

    _build(styleConfig: StyleConfig, names: Array<string>): Object {
        if (Array.isArray(styleConfig)) {
            return this._buildWithArr(styleConfig, names);
        } else if (typeof styleConfig === 'string') {
            return this._buildWithStr(styleConfig, names);
        } else {
            return this._buildWithObj(styleConfig, names);
        }
    }

    _buildWithStr(str: string, names: Array<string>): Object {
        let [first, second] = str.split('@');
        let newNames = names.concat(first);

        let varName = getVarName(newNames);
        return !this.varGetter.has(varName) ? {}
            : {[second || first]: this.varGetter.get(varName)};
    }

    _buildWithArr(arr: Array<StyleConfig>, names: Array<string>): Object {
        return arr.map((styleConfig: StyleConfig) => {
            return this._build(styleConfig, names);
        }).reduce((prev, cur) => {
            return Object.assign(prev, cur);
        }, {});
    }

    _buildWithObj(obj: Object, names: Array<string>): Object {
        return Object.keys(obj).map((key) => {
            let name = !this.props.hasOwnProperty(key) || this.props[key] === true
                ? key : this.props[key];
            if (!_.isBoolean(name)) {
                return this._build(obj[key], names.concat(name));
            }
        }).reduce((prev, cur) => {
            return Object.assign(prev, cur);
        }, {});
    }

    build(styleConfig: StyleConfig, prefix: string) {
        return this._build(styleConfig, [prefix]);
    }
}

export default function buildStyle<S>(varGetter: VarGetter, props: Object, styleConfig: ComponentStyle, prefix: string): {[$Keys<S>]: any} {
    let propStyles = props.styles || {};
    let builder = new StyleConfigBuilder(varGetter, props);
    return Object.keys(styleConfig).map((key: string) => {
        let style = builder.build(styleConfig[key], prefix);
        return Object.assign({}, style, propStyles[key]);
    }).reduce((prevStyle, curStyle) => {
        return Object.assign(prevStyle, curStyle);
    }, {});
}
