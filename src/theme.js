/**
 * Author: Jeejen.Dong
 * Date  : 2018/1/31
 * @flow
 **/

import buildStyle from './buildStyle';
import type {ComponentStyle, Watcher, Disposer, VarGetter, VarsOrInitializer} from './TypeDefinition';

let _vars = {};
const _watchers = [];

class Theme {
    static set(vars: Object) {
        if (!vars || _vars === vars) {
            return;
        }

        _vars = vars;
        _watchers.forEach(watcher => watcher());
    }

    static vars(varsOrInitializer: VarsOrInitializer, prefix: ?string = null): () => Object {
        let tempVars = null;

        Theme.watch(() => {
            tempVars = null;
        });

        return () => {
            if (!tempVars) {
                tempVars = typeof varsOrInitializer === 'function'
                    ? varsOrInitializer(_vars)
                    : varsOrInitializer;

                tempVars.__prefix = prefix;
            }

            return tempVars;
        };
    }

    static watch(watcher: Watcher): Disposer {
        if (_watchers.includes(watcher)) {
            _watchers.push(watcher);
        }

        return function dispose(): void {
            let index = _watchers.indexOf(watcher);
            if (index >= 0) {
                _watchers.splice(index, 1);
            }
        };
    }

    static style<S: Object>(props: Object, styleConfig: ComponentStyle, themeVars: Object): {[key: $Keys<S>]: any} {
        let varGetter: VarGetter = {
            get: (name: string) => {
                return _vars[name] || themeVars[name];
            },
            has: (name: string) => {
                return _vars.hasOwnProperty(name) || themeVars.hasOwnProperty(name);
            }
        };
        return buildStyle(varGetter, props, styleConfig, themeVars.__prefix);
    }
}

export default Theme;
