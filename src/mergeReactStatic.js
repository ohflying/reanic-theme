/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/2
 *
 * fork hoist-non-react-statics
 **/

/*
let REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};
*/

let KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};

let defineProperty = Object.defineProperty;
let getOwnPropertyNames = Object.getOwnPropertyNames;
let getOwnPropertySymbols = Object.getOwnPropertySymbols;
let getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let getPrototypeOf = Object.getPrototypeOf;
let objectPrototype = getPrototypeOf && getPrototypeOf(Object);

export default function mergeReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
        if (objectPrototype) {
            let inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                mergeReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        let keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (let i = 0; i < keys.length; ++i) {
            let key = keys[i];
            if (!KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                let descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try { // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};
