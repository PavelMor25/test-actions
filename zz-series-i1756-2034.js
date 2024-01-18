import { Selector, ClientFunction, RequestLogger } from 'testcafe';

fixture `zz-series-i1756`
    .page `https://demo.e-thermo.fr/`
    .beforeEach(async t => {
        await t
            .resizeWindow(1500, 844);

        let userLogin='S_DEVEXPRESS';
        let userPass='4p7aPM6Cx6sqZ7!';
        let userLang='english';

        // wait for user logged in
        await t
            .click(Selector('[data-test-id="menu-lang"]')) // open language selection
            .click(Selector('[data-test-id="menu-lang-'+userLang+'"]')) // select user language
            .typeText(Selector('[data-test-id="login-user-login"]'), userLogin) // type user login
            .click(Selector('[data-test-id="login-btn-nav-next"]')) // goto next step
            .typeText(Selector('[data-test-id="login-user-pass"]'), userPass) // type user password
            .click(Selector('[data-test-id="login-btn-nav-next"]')); // goto next step: sign-in;

        await t
            .expect(Selector('[data-test-id="app-user-account"]').textContent).contains("SD", 'user initials are "SD"')
            .expect(Selector('[data-test-id="dashboard-new-project"]').visible).ok('wait for home page');
    });

test('1756.1', async t => {
    //should be run in last, because no "after each" to reset history (we are out of ethermo scope after a click on detherm button);

    await t
        .click('[data-test-id="app-quick-search"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('64-17-5'))
        .click('[data-test-id="app-search"]');

    //wait for compound page to be loaded;

    await t
        .expect(Selector('[data-test-id="compound-properties-table"] td').withText('Tb').exists).ok();

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="compound-search-compound-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("Search this compound on detherm", 'message hover button is "Search this compound on detherm"');

    const url = 'https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL&casn=64-17-5';
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="compound-search-compound-detherm"]'))
        .skipJsErrors(false)
        .wait(5000)          
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.2', async t => {
    //should be run in last, because no "after each" to reset history (we are out of ethermo scope after a click on detherm button);

    await t
        .click('[data-test-id="app-quick-search"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('64-17-5'))
        .click('[data-test-id="app-search"]');

    //wait for compound page to be loaded;

    await t
        .expect(Selector('[data-test-id="compound-properties-table"] td').withText('Tb').exists).ok()
        .click(Selector('[data-test-id="compound-properties-table"] td').withText('Pvap'));

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="compound-search-compound-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("Search this property on detherm", 'message hover button is "Search this property on detherm"');

    const url = 'https://i-systems.dechema.de/directSearch.php?id=project1&prop=PL&cids=ETHANOL&casn=64-17-5';
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="compound-search-compound-detherm"]'))
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.3', async t => {
    //should be run in last, because no "after each" to reset history (we are out of ethermo scope after a click on detherm button);

    await t
        .click('[data-test-id="app-quick-search"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('64-17-5'))
        .click('[data-test-id="app-search"]');

    //wait for compound page to be loaded;

    await t
        .expect(Selector('[data-test-id="compound-properties-table"] td').withText('Tb').exists).ok()
        .click(Selector('[data-test-id="compound-properties-table"] td').withText('LogP'));

    // we don't check external site, thus cannot check that open ethanol on all properties
    // we just check that tooltip changed and url is on prop=ALL;

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="compound-search-compound-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("Search this compound on detherm", 'message hover button is "Search this compound on detherm"');

    const url = 'https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL&casn=64-17-5';
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="compound-search-compound-detherm"]'))
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.4', async t => {
    //should be run in last, because no "after each" to reset history (we are out of ethermo scope after a click on detherm button);

    await t
        .click('[data-test-id="app-quick-search"]')
        .typeText('[data-test-id="app-quick-search"]', '4#-METHOXYACETOPHENONE')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('100-06-1'))
        .click('[data-test-id="app-search"]');

    //wait for compound page to be loaded;

    await t
        .expect(Selector('[data-test-id="compound-properties-table"] td').withText('Tb').exists).ok();

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="compound-search-compound-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("Search this compound on detherm", 'message hover button is "Search this compound on detherm"');

    const url = 'https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=4%23-METHOXYACETOPHENONE&casn=100-06-1';
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="compound-search-compound-detherm"]'))
        .skipJsErrors(false)    
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.5', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.6', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'methanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('67-56-1'))
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER%7CMETHANOL&casn=64-17-5%7C7732-18-5%7C67-56-1";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.7', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-panel-measurements"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'vle')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .click(Selector('[data-test-id="search-advanced-mixture-search"]').withText('SEARCH'))
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=VLEMIX&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.8', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-panel-measurements"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'beta')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    //beta has no detherm symbol, search on ALL
    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.9', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-panel-measurements"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'vle')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .click('[data-test-id="search-advanced-mixture-panel-properties"]')
        .click('[data-test-id="search-advanced-mixture-data-1-property"]', {
            speed: 0.5
        })
        .click(Selector('[data-test-id="search-advanced-mixture-data-1-property-option-501"]').withText('Temperature ( T )'))
        .click('[data-test-id="search-advanced-mixture-data-1-operator"]')
        .click(Selector('[data-test-id="search-advanced-mixture-data-1-operator-option-1"]').withText('= (+/- 5)'))
        .typeText('[data-test-id="search-advanced-mixture-data-1-value"]', '25')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    //T criteria is ignored
    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=VLEMIX&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.10', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-panel-measurements"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'vle')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'lle')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    //search on 1st pp with detherm symbol = VLE, other (LLE) is ignored
    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=VLEMIX&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.11', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-panel-measurements"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'beta')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'vle')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    //search on 1st pp with detherm symbol = VLE, other (beta) is ignored
    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=VLEMIX&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)         
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('1756.12', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .click('[data-test-id="search-advanced-mixture-compounds-btn-wildcard"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("These criteria are not compatible with detherm search.", 'message hover button is "These criteria are not compatible with detherm search."')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('class')).contains("off", 'button looks disabled');

    const getUrl = ClientFunction( () => {
        return window.location.href;
    })

    // We must compare both url, should be the same since button is disabled

    const oldUrl = await getUrl();

    await t.click('[data-test-id="search-advanced-mixture-search-on-detherm"]');

    await t.expect(getUrl()).eql(oldUrl);
});

test('1756.13', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('64-17-5'))
        .click('[data-test-id^="search-advanced-mixture-compounds-btn-unknown-numb"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("These criteria are not compatible with detherm search.", 'message hover button is "These criteria are not compatible with detherm search."')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('class')).contains("off", 'button looks disabled');

    const getUrl = ClientFunction( () => {
        return window.location.href;
    })

    // We must compare both url, should be the same since button is disabled

    const oldUrl = await getUrl();

    await t.click('[data-test-id="search-advanced-mixture-search-on-detherm"]');

    await t.expect(getUrl()).eql(oldUrl);
});

test('1756.14', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .click('[data-test-id="search-advanced-mixture-panel-measurements"]')
        .typeText('[data-test-id="search-advanced-mixture-measurements-input"]', 'lambda_S')
        .click('[data-test-id^="search-advanced-mixture-measurements-auto-option-1"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("These criteria are not compatible with detherm search.", 'message hover button is "These criteria are not compatible with detherm search."')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('class')).contains("off", 'button looks disabled');

    const getUrl = ClientFunction( () => {
        return window.location.href;
    })

    // We must compare both url, should be the same since button is disabled

    const oldUrl = await getUrl();

    await t.click('[data-test-id="search-advanced-mixture-search-on-detherm"]');

    await t.expect(getUrl()).eql(oldUrl);
});

test('2034.1', async t => {
    await t
        .click('[data-test-id="app-advanced-search"]')
        .click(Selector('[data-test-id="search-advanced-tab-group"] .mat-mdc-tab-labels div[mattablabelwrapper]').withText('MIXTURE'))
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'ethanol')
        .click('[data-test-id="search-advanced-mixture-compounds-btn-all-results"]')
        .click('[data-test-id="search-compound-1-checkbox"]')
        .click('[data-test-id="search-compound-ok"]')
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click('[data-test-id="search-advanced-mixture-compounds-btn-all-results"]')
        .click('[data-test-id="search-compound-1-checkbox"]')
        .click('[data-test-id="search-compound-ok"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.2', async t => {
    await t
        .click('[data-test-id="app-toolbar"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('64-17-5'))
        .typeText('[data-test-id="app-quick-search"]', 'water')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('7732-18-5'))
        .click('[data-test-id="app-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.3', async t => {
    await t
        .click('[data-test-id="app-toolbar"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click('[data-test-id="app-quick-search-for-mixtures-1"]')
        .click('[data-test-id="search-advanced-mixture-compounds-chips-2"] button[matchipremove]')
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.4', async t => {
    await t
        .click('[data-test-id="app-toolbar"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('64-17-5'))
        .click('[data-test-id="app-search"]')
        .expect(Selector('[data-test-id="compound-name"]').exists).eql(true, '"Compound is loaded"')
        .click('[data-test-id="compound-search-binaries"]')
        .click('[data-test-id="search-advanced-mixture-compounds-chips-2"] button[matchipremove]')
        .typeText('[data-test-id="search-advanced-mixture-compounds-input"]', 'water')
        .click(Selector('[data-test-id="search-advanced-mixture-compounds-results"] td').withText('7732-18-5'))
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.8', async t => {
    await t
        .click('[data-test-id="app-toolbar"]')
        .typeText('[data-test-id="app-quick-search"]', 'ethanol')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('64-17-5'))
        .typeText('[data-test-id="app-quick-search"]', 'water')
        .click(Selector('[data-test-id="app-quick-search-results-compound-1"]').withText('7732-18-5'))
        .click('[data-test-id="app-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist')
        .click('[data-test-id="close-breadcrumb-1"]')
        .click('[data-test-id="app-quick-search-history"]')
        .click('[data-test-id="app-quick-search-results-search-1"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.5', async t => {
    await t
        .click('[data-test-id="dashboard-new-project"]')
        .typeText('[data-test-id="create-new-project-name"]', 'Test2034')
        .click('[data-test-id="create-new-project-create"]')
        .click('[data-test-id="dashboard-user-project-1-title"]')
        .click('[data-test-id="project-compound-button-add-compound"]')
        .click('[data-test-id="project-compound-live-search"]')
        .typeText('[data-test-id="project-compound-live-search"]', 'ethanol')
        .click(Selector('[data-test-id="add-compound-table"] td').withText('64-17-5'))
        .click('[data-test-id="project-compound-button-add-compound"]')
        .click('[data-test-id="project-compound-live-search"]')
        .typeText('[data-test-id="project-compound-live-search"]', 'water')
        .click('[data-test-id="app-compound-table-all-results"]')
        .click('[data-test-id="search-compound-1-checkbox"]')
        .click('[data-test-id="search-compound-ok"]')
        .click('[data-test-id="project-compound-all-table-checkbox"]')
        .click('[data-test-id="project-compound-button-perform-adv-search"]')
        .click('[data-test-id="search-advanced-mixture-search"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    // go remove project before exiting ethermo via detherm;

    await t
        .click('[data-test-id="app-nav-btn-dash"]')
        .expect(Selector('[data-test-id="dashboard-with-project"]').exists).ok('home with project');

    let nbProjects = await Selector('mat-card').count
    // it will delete every projects
    for (let i = 1; i < nbProjects; i++) {
            let projectTitle = await Selector ('[data-test-id="dashboard-user-project-1-title"]').textContent;
            let isCompoundAnalysis = projectTitle.includes('Compound Analysis');
    if(!isCompoundAnalysis){
            // we must not delete Compound Analysis project
            // logically Compound Analysis project will always be deleted the last one (sorted by modification date)
            // so we can change <= nbProjects to < nbProjects
            // always delete the first element (will result to no projects remaining)
            let delButton = await Selector('[data-test-id="dashboard-user-project-1-delete"');
            await t.click(delButton);
        
            let confirm = await Selector('[data-test-id="confirm-dialog-yes"]');
            await t.click(confirm);
    } else {
            let dashboard =  await Selector ('[data-test-id="app-nav-btn-dash"]');
            await t.click(dashboard);
    }
    };

    await t
        .expect(Selector('[data-test-id="dashboard-with-project"]').exists).ok('home with project')
        .expect(Selector('[data-test-id="widget-projects-span-title"]').count).eql(1, 'There is only one project remaining ')
        .expect(Selector('[data-test-id="dashboard-user-project-1-title"]').textContent).contains(" Project Compound Analysis", 'remaining project is "Compound Analysis"')
        .click('[data-test-id="breadcrumb-1"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.6', async t => {
    await t
        .click('[data-test-id="dashboard-new-project"]')
        .typeText('[data-test-id="create-new-project-name"]', 'Test2034')
        .click('[data-test-id="create-new-project-create"]')
        .click('[data-test-id="dashboard-user-project-1-title"]')
        .click('[data-test-id="project-navbar-button-binary-matrix"]')
        .expect(Selector('[data-test-id="widget-binary-matrix-button-add-compound"]').exists).eql(true, 'add a compound button is ready')
        .click('[data-test-id="widget-binary-matrix-button-add-compound"]')
        .click('[data-test-id="widget-binary-matrix-compound-livesearch"]')
        .typeText('[data-test-id="widget-binary-matrix-compound-livesearch"]', 'ethanol')
        .click(Selector('[data-test-id="add-compound-table"] td').withText('64-17-5'))
        .expect(Selector('[data-test-id="widget-binary-matrix-button-add-compound"]').exists).eql(true, 'add a compound button is ready')
        .click('[data-test-id="widget-binary-matrix-button-add-compound"]')
        .click('[data-test-id="widget-binary-matrix-compound-livesearch"]')
        .typeText('[data-test-id="widget-binary-matrix-compound-livesearch"]', 'water')
        .click('[data-test-id="app-compound-table-all-results"]')
        .click('[data-test-id="search-compound-1-checkbox"]')
        .click('[data-test-id="search-compound-ok"]')
        .click(Selector('[data-test-id="widget-binary-matrix-table"] span').withText('66'))
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    // go remove project before exiting ethermo via detherm;

    await t
        .click('[data-test-id="app-nav-btn-dash"]')
        .expect(Selector('[data-test-id="dashboard-with-project"]').exists).ok('home with project');

    let nbProjects = await Selector('mat-card').count
    // it will delete every projects
    for (let i = 1; i < nbProjects; i++) {
            let projectTitle = await Selector ('[data-test-id="dashboard-user-project-1-title"]').textContent;
            let isCompoundAnalysis = projectTitle.includes('Compound Analysis');
    if(!isCompoundAnalysis){
            // we must not delete Compound Analysis project
            // logically Compound Analysis project will always be deleted the last one (sorted by modification date)
            // so we can change <= nbProjects to < nbProjects
            // always delete the first element (will result to no projects remaining)
            let delButton = await Selector('[data-test-id="dashboard-user-project-1-delete"');
            await t.click(delButton);
        
            let confirm = await Selector('[data-test-id="confirm-dialog-yes"]');
            await t.click(confirm);
    } else {
            let dashboard =  await Selector ('[data-test-id="app-nav-btn-dash"]');
            await t.click(dashboard);
    }
    };

    await t
        .expect(Selector('[data-test-id="dashboard-with-project"]').exists).ok('home with project')
        .expect(Selector('[data-test-id="widget-projects-span-title"]').count).eql(1, 'There is only one project remaining ')
        .expect(Selector('[data-test-id="dashboard-user-project-1-title"]').textContent).contains(" Project Compound Analysis", 'remaining project is "Compound Analysis"')
        .click('[data-test-id="breadcrumb-1"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});

test('2034.7', async t => {
    await t
        .click('[data-test-id="dashboard-new-project"]')
        .typeText('[data-test-id="create-new-project-name"]', 'Test2034')
        .click('[data-test-id="create-new-project-create"]');

    //display binary matrix for new project;

    await t
        .click('[data-test-id="dashboard-customization-button"]')
        .click('[data-test-id="dashboard-settings-slider-analysis"]')
        .click('[data-test-id="dashboard-settings-slider-binary-matrix"]')
        .click('[data-test-id="account-submit-button"]')
        .click('[data-test-id="widget-binary-matrix-select-project"]')
        .click('[data-test-id="select-project-1-checkbox"]')
        .click('[data-test-id="select-project-2-checkbox"]')
        .click('[data-test-id="select-project-ok"]');

    //add compounds for detherm;

    await t
        .expect(Selector('[data-test-id="widget-binary-matrix-button-add-compound"]').exists).eql(true, 'add a compound button is ready')
        .click('[data-test-id="widget-binary-matrix-button-add-compound"]')
        .click('[data-test-id="widget-binary-matrix-compound-livesearch"]')
        .typeText('[data-test-id="widget-binary-matrix-compound-livesearch"]', 'ethanol')
        .click(Selector('[data-test-id="add-compound-table"] td').withText('64-17-5'))
        .expect(Selector('[data-test-id="widget-binary-matrix-button-add-compound"]').exists).eql(true, 'add a compound button is ready')
        .click('[data-test-id="widget-binary-matrix-button-add-compound"]')
        .click('[data-test-id="widget-binary-matrix-compound-livesearch"]')
        .typeText('[data-test-id="widget-binary-matrix-compound-livesearch"]', 'water')
        .click('[data-test-id="app-compound-table-all-results"]')
        .click('[data-test-id="search-compound-1-checkbox"]')
        .click('[data-test-id="search-compound-ok"]')
        .click(Selector('[data-test-id="widget-binary-matrix-table"] span').withText('66'))
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    // go remove project before exiting ethermo via detherm;

    await t
        .click('[data-test-id="app-nav-btn-dash"]')
        .expect(Selector('[data-test-id="dashboard-with-project"]').exists).ok('home with project');

    let nbProjects = await Selector('mat-card').count
    // it will delete every projects
    for (let i = 1; i < nbProjects; i++) {
            let projectTitle = await Selector ('[data-test-id="dashboard-user-project-1-title"]').textContent;
            let isCompoundAnalysis = projectTitle.includes('Compound Analysis');
    if(!isCompoundAnalysis){
            // we must not delete Compound Analysis project
            // logically Compound Analysis project will always be deleted the last one (sorted by modification date)
            // so we can change <= nbProjects to < nbProjects
            // always delete the first element (will result to no projects remaining)
            let delButton = await Selector('[data-test-id="dashboard-user-project-1-delete"');
            await t.click(delButton);
        
            let confirm = await Selector('[data-test-id="confirm-dialog-yes"]');
            await t.click(confirm);
    } else {
            let dashboard =  await Selector ('[data-test-id="app-nav-btn-dash"]');
            await t.click(dashboard);
    }
    };

    await t
        .expect(Selector('[data-test-id="dashboard-with-project"]').exists).ok('home with project')
        .expect(Selector('[data-test-id="widget-projects-span-title"]').count).eql(1, 'There is only one project remaining ')
        .expect(Selector('[data-test-id="dashboard-user-project-1-title"]').textContent).contains(" Project Compound Analysis", 'remaining project is "Compound Analysis"');

    //restore home page on compound analysis;

    await t
        .click('[data-test-id="widget-binary-matrix-select-project"]')
        .click('[data-test-id="select-project-1-checkbox"]')
        .click('[data-test-id="select-project-ok"]')
        .click('[data-test-id="dashboard-customization-button"]')
        .click('[data-test-id="dashboard-settings-slider-analysis"]')
        .click('[data-test-id="dashboard-settings-slider-binary-matrix"]')
        .click('[data-test-id="account-submit-button"]');

    //return to search;

    await t
        .click('[data-test-id="breadcrumb-1"]')
        .expect(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]').exists).ok('detherm button exist');

    const tooltipMessageDetherm = Selector(() => {
        // return the tooltip message form an element
        return document.getElementById(document.querySelector('[data-test-id="search-advanced-mixture-search-on-detherm"]').getAttribute('aria-describedby'));
    
        // the Material tooltip element id is ported by the 'aria-describedby' attribute, for instance : "cdk-describedby-message-0"
        // so find this element in the DOM to get the tooltip message
    });

    await t
        .expect(Selector(tooltipMessageDetherm).textContent).contains("See more results on detherm", 'message hover button is "See more results on detherm"');

    const url = "https://i-systems.dechema.de/directSearch.php?id=project1&prop=ALL&cids=ETHANOL%7CWATER&casn=64-17-5%7C7732-18-5";
    const urlDest = 'https://i-systems.dechema.de/datasets.php';
    const logger = RequestLogger({ url, method: 'GET' }, {
        logResponseHeaders: true,
        logResponseBody:    true
    });

    // Lancez le logger avant de cliquer sur le bouton
    await t.addRequestHooks(logger);

    //skip error around click on detherm
    await t        
        .skipJsErrors()
        .click(Selector('[data-test-id="search-advanced-mixture-search-on-detherm"]')) 
        .skipJsErrors(false)          
        .wait(5000)
        .expect(logger.contains(record => record.response.headers['location'] === urlDest)).ok('Response location is https://i-systems.dechema.de/datasets.php')
        .expect(logger.contains(record => record.response.statusCode === 302)).ok('Response is redirected');

    const request = logger.requests[0].request;

    await t
        .expect(request.method).eql('get', 'Method is get.')
        .expect(request.url).eql(url, 'url is correct.');
});