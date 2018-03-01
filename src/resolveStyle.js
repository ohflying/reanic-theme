/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/7
 *
 * @flow
 **/

const PropRegExp = /^\[(.+?)([\^$*]{0,1})=(.+?)\]$/;

class PropComparator {
    static create(styleName: string): ?PropComparator {
        let result = PropRegExp.exec(styleName);
        if (result) {
            let [name, operator, value] = result.slice(1);
            return new PropComparator(name, value, operator);
        }
    }

    name: string;
    value: string;
    operator: string;
    constructor(name: string, value: string, operator: string) {
        this.name = name;
        this.value = value;
        this.operator = operator;
    }

    valid(props: Object): boolean {
        let propValue = String(props[this.name]);
        if (this.operator === '') {
            return propValue === this.value;
        }
        if (this.operator === '*') {
            return propValue.includes(this.value);
        }

        if (this.operator === '^') {
            return propValue.startsWith(this.value);
        }

        if (this.operator === '$') {
            return propValue.endsWith(this.value);
        }

        return false;
    }
}
class PropResolver {
    static isPropStyle(styleName: string) {
        return PropRegExp.test(styleName);
    }

    static resolve(styleName: string, styleSheet: Object, props: Object): ?Object {
        let comparator = PropComparator.create(styleName);
        if (comparator && comparator.valid(props)) {
            return ResolveMgr.resolve(styleSheet, props);
        }
    }
}

class ResolveMgr {
    static resolve(styleSheets: Object, props: Object): Object {
        let style = {};
        Object.keys(styleSheets).map((styleName) => {
            if (PropResolver.isPropStyle(styleName)) {
                let propStyle = PropResolver.resolve(styleName, styleSheets[styleName], props);
                Object.assign(style, propStyle);
            } else {
                style[styleName] = styleSheets[styleName];
            }
        });

        return style;
    }
}

function formatName(styleName: string) {
    return styleName.replace(/^\./, '');
}

export default function resolveStyle(styleSheets: Object, props: Object): Object {
    return Object.keys(styleSheets).map((styleName: string) => {
        let styleSheet = styleSheets[styleName];
        return {[formatName(styleName)]: ResolveMgr.resolve(styleSheet, props)};
    }).reduce((prevStyle, curStyle) => {
        return Object.assign(prevStyle, curStyle);
    }, {});
};
