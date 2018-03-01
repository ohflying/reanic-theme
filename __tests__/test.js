/* eslint-disable */

import GlobalTheme from './global.theme';
import Theme from '../src/Theme';
import vars from './vars';

describe('Style-Test', () => {
    Theme.setTheme(GlobalTheme);

    let styles = Theme.style(vars, {
        size: 'small',
        color: 'danger',
        src: 'test.png'
    });

    test('test resolve', () => {
        expect(styles['button']).toHaveProperty('test', 'small');
    });

    test('test global theme', () => {
        expect(styles['button']).toHaveProperty('test_global', 'modified_small');
        expect(styles['button']).toHaveProperty('global', 'global.theme');
    });
});