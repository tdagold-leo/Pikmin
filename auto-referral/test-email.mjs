import { createOneAccount } from './automation.mjs';

(async () => {
    console.log('Testing GuerrillaMail...');
    try {
        const result = await createOneAccount({
            referralCode: 'TEST',
            onLog: (msg) => console.log(msg),
            headless: true
        });
        console.log('Result:', result);
    } catch (e) {
        console.error('Test Failed:', e);
    }
})();
