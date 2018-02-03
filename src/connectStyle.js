/**
 * Author: Jeejen.Dong
 * Date  : 2018/1/31
 *
 * @flow
 **/

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import mergeReactStatic from './mergeReactStatic';
import Theme from './theme';
import type {Disposer, ComponentStyle} from './TypeDefinition';

export default function connectStyle<S: Object>(Component: Class<React$Component<*>>, styleConfig: ComponentStyle): (themeVars: Object) => {[$Keys<S>]: any} {
    return function wrap<S: Object>(themeVars: Object): React$PureComponent<any, any> {
        class StyleComponent extends React.PureComponent<any, any> {
            static propTypes = {
                styles: PropTypes.object
            };

            static defaultProps = {
                styles: {}
            };

            themeDisposer: Disposer;
            state: { styles: {[key: $Keys<S>]: any} };

            constructor(props: any, context: any) {
                super(props, context);

                this.state = {
                    styles: Theme.style(props, styleConfig, themeVars)
                };
            }

            componentWillMount() {
                this.themeDisposer = Theme.watch(this.onThemeWatch);
            }

            componentWillUnmount() {
                if (this.themeDisposer) {
                    this.themeDisposer();
                }
            }

            componentWillReceiveProps(nextProps: any, nextContext: any) {
                this.tryResetStyle(nextProps);
            }

            tryResetStyle(props: any) {
                let nextStyle = Theme.style(props, styleConfig, themeVars);
                if (!_.isEqual(nextStyle, this.state.styles)) {
                    this.setState({
                        styles: nextStyle
                    });
                }
            }

            onThemeWatch = () => {
                this.tryResetStyle(this.props);
            };

            render() {
                let styles = _.merge(this.state.styles, this.props.styles);
                return (
                    <Component
                        {...this.props}
                        styles={styles}
                    />
                );
            }
        }

        return mergeReactStatic(StyleComponent, Component);
    };
}
