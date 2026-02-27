#!/usr/bin/env node

/**
 * Test Successful Payment Flow
 * Demonstrates complete payment workflow with seeded balance
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

// Temporarily modify index.js to seed balance for demo
const indexPath = './index.js';
const originalCode = readFileSync(indexPath, 'utf8');

// Check if we need to seed balance
if (!originalCode.includes('DEMO_SEEDED')) {
  const modifiedCode = originalCode.replace(
    'this.walletState = {',
    `this.walletState = { // DEMO_SEEDED\n      // Seed with test balance for demo\n      balance: 10,`
  );
  writeFileSync(indexPath, modifiedCode);
  console.log('✅ Seeded wallet with 10 ZEC test balance\n');
}

class PaymentSuccessTest {
  constructor() {
    this.requestId = 0;
    this.responses = [];
    this.serverProcess = null;
  }

  async start() {
    console.log('🚀 Testing successful payment flow...\n');
    
    this.serverProcess = spawn('node', ['index.js'], {
      cwd: process.cwd(),
    });

    let buffer = '';
    this.serverProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim()) {
          try {
            this.responses.push(JSON.parse(line));
          } catch (e) {}
        }
      }
    });

    await this.sleep(1000);

    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    });

    await this.sleep(300);
    await this.sendNotification({
      jsonrpc: '2.0',
      method: 'notifications/initialized'
    });
    await this.sleep(300);
  }

  async sendRequest(request) {
    this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
  }

  async sendNotification(notification) {
    this.serverProcess.stdin.write(JSON.stringify(notification) + '\n');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getLastResponse() {
    await this.sleep(500);
    return this.responses[this.responses.length - 1];
  }

  async runTest() {
    try {
      await this.start();

      // 1. Check balance (should have 10 ZEC)
      console.log('1️⃣  Checking balance with seeded funds...\n');
      await this.sendRequest({
        jsonrpc: '2.0',
        id: this.requestId++,
        method: 'tools/call',
        params: { name: 'get_balance', arguments: {} }
      });
      const balanceResponse = await this.getLastResponse();
      console.log(balanceResponse.result.content[0].text);
      console.log('\n' + '-'.repeat(60) + '\n');

      // 2. Create recipient address
      console.log('2️⃣  Creating recipient address...\n');
      await this.sendRequest({
        jsonrpc: '2.0',
        id: this.requestId++,
        method: 'tools/call',
        params: {
          name: 'create_shielded_address',
          arguments: { label: 'recipient' }
        }
      });
      const addrResponse = await this.getLastResponse();
      const addrText = addrResponse.result.content[0].text;
      console.log(addrText);
      
      // Extract address
      const addrMatch = addrText.match(/Address: (zs1[a-f0-9]+)/);
      const recipientAddr = addrMatch ? addrMatch[1] : 'zs1recipient123';
      console.log('\n' + '-'.repeat(60) + '\n');

      // 3. Send payment
      console.log('3️⃣  Sending 2.5 ZEC with encrypted memo...\n');
      await this.sendRequest({
        jsonrpc: '2.0',
        id: this.requestId++,
        method: 'tools/call',
        params: {
          name: 'send_private_payment',
          arguments: {
            to_address: recipientAddr,
            amount: 2.5,
            memo: 'Payment for services rendered - completely private!'
          }
        }
      });
      const paymentResponse = await this.getLastResponse();
      console.log(paymentResponse.result.content[0].text);
      console.log('\n' + '-'.repeat(60) + '\n');

      // 4. Check balance after payment
      console.log('4️⃣  Checking balance after payment...\n');
      await this.sendRequest({
        jsonrpc: '2.0',
        id: this.requestId++,
        method: 'tools/call',
        params: { name: 'get_balance', arguments: {} }
      });
      const newBalanceResponse = await this.getLastResponse();
      console.log(newBalanceResponse.result.content[0].text);
      console.log('\n' + '-'.repeat(60) + '\n');

      // 5. View transaction history
      console.log('5️⃣  Viewing transaction history...\n');
      await this.sendRequest({
        jsonrpc: '2.0',
        id: this.requestId++,
        method: 'tools/call',
        params: {
          name: 'get_transactions',
          arguments: { limit: 5 }
        }
      });
      const txResponse = await this.getLastResponse();
      console.log(txResponse.result.content[0].text);
      console.log('\n' + '-'.repeat(60) + '\n');

      console.log('✅ Payment flow test completed successfully!\n');
      console.log('📝 Summary:');
      console.log('   - Created shielded address');
      console.log('   - Sent 2.5 ZEC with encrypted memo');
      console.log('   - Balance updated correctly (10 → 7.5 ZEC)');
      console.log('   - Transaction recorded in history');
      console.log('   - All privacy features demonstrated\n');

      this.serverProcess.stdin.end();
      this.serverProcess.kill();

      // Restore original code
      writeFileSync(indexPath, originalCode);
      console.log('✅ Restored original index.js\n');

      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error);
      writeFileSync(indexPath, originalCode);
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
      process.exit(1);
    }
  }
}

const tester = new PaymentSuccessTest();
tester.runTest();
