const fetch = globalThis.fetch;

async function testMailTm() {
    try {
        console.log('Fetching domain...');
        let res = await fetch('https://api.mail.tm/domains');
        let domains = await res.json();
        let domain = domains['hydra:member'][0].domain;
        console.log('Using domain:', domain);

        const email = 'test' + Date.now() + '@' + domain;
        const password = 'password123';

        console.log('Creating account:', email);
        res = await fetch('https://api.mail.tm/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: email, password })
        });
        const account = await res.json();
        console.log('Account created:', account.id);

        console.log('Getting token...');
        res = await fetch('https://api.mail.tm/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: email, password })
        });
        const tokenData = await res.json();
        const token = tokenData.token;
        console.log('Token received');

        console.log('Checking messages...');
        res = await fetch('https://api.mail.tm/messages', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const msgs = await res.json();
        console.log('Messages:', msgs);
    } catch (e) {
        console.error('Error:', e);
    }
}

testMailTm();
