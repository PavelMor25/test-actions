import { Selector } from 'testcafe';

fixture('Load test page').page('https://testcafe.io/');

test('Open mobile menu', async (t) => {
    await t.maximizeWindow();
    await t.debug();

});