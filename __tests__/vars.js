/**
 * Author: Jeejen.Dong
 * Date  : 2018/2/7
 **/

import Theme from '../src/Theme';

let styles = (GlobalVars) => {
    return {
        '.button': {
            borderRadius: GlobalVars.$size_border_radius,
            marginVertical: GlobalVars.$size_gap,
            height: GlobalVars.$size_medium_fontSize * 3,
            paddingHorizontal: GlobalVars.$size_medium_fontSize * 0.85,
            test: 'test',
            test_global: 'test_local',
            '[size=small]': {
                height: GlobalVars.$size_small_fontSize * 2.5,
                paddingHorizontal: GlobalVars.$size_small_fontSize * 0.85,
                test: 'small',
                '[color=primary]': {
                    color: 'primary'
                },
                '[color=danger]': {
                    color: 'danger'
                }
            },
            '[size=large]': {
                height: GlobalVars.$size_small_fontSize * 5,
                paddingHorizontal: GlobalVars.$size_small_fontSize * 0.85,
                test: 'large'
            },
            '[src$=jpg]': {
                backgroundColor: '#f00'
            }
        },
        '.text': {
            fontSize: GlobalVars.$size_medium_fontSize,
            '[sizes=small]': {
                fontSize: GlobalVars.$size_small_fontSize
            }
        }
    };
};

export default Theme.vars(styles, '$btn');
