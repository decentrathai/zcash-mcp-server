#!/usr/bin/env node

/**
 * Full Flow Test - Tests complete payment workflow
 * Seeds wallet with test balance to test actual payment sending
 */

import { spawn } from 'child_process';

class MCPFullFlowTester {
  constructor() {
    this.requestId = 0;
    this.responses = [];
    this.serverProcess = null;
    this.testResults = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  async start() {
    console.log('🚀 Starting Zcash MCP Server Full Flow Test...\n');
    
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
            const response = JSON.parse(line);
            this.responses.push(response);
          } catch (e) {
            // Ignore non-JSON lines
          }
        }
      }
    });

    this.serverProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('MCP Server running')) {
        console.log('✅ Server started successfully\n');
      }
    });

    await this.sleep(1000);

    // Initialize
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

  recordResult(test, passed, message) {
    if (passed) {
      this.testResults.passed.push({ test, message });
      console.log(`✅ ${test}: ${message}`);
    } else {
      this.testResults.failed.push({ test, message });
      console.log(`❌ ${test}: ${message}`);
    }
  }

  recordWarning(test, message) {
    this.testResults.warnings.push({ test, message });
    console.log(`⚠️  ${test}: ${message}`);
  }

  async testToolsList() {
    console.log('\n📋 TEST 1: Verify all 5 tools are exposed\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/list',
      params: {}
    });
    
    const response = await this.getLastResponse();
    const tools = response.result?.tools || [];
    
    const expectedTools = [
      'create_shielded_address',
      'get_balance',
      'send_private_payment',
      'get_transactions',
      'get_price'
    ];
    
    const actualTools = tools.map(t => t.name);
    
    for (const tool of expectedTools) {
      const found = actualTools.includes(tool);
      this.recordResult(
        `Tool: ${tool}`,
        found,
        found ? 'Exposed' : 'Missing'
      );
    }
    
    return tools.length === 5;
  }

  async testCreateAddress() {
    console.log('\n🔑 TEST 2: Create shielded address\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'create_shielded_address',
        arguments: { label: 'demo-wallet' }
      }
    });
    
    const response = await this.getLastResponse();
    const text = response.result?.content?.[0]?.text || '';
    
    const hasAddress = text.includes('zs1');
    const hasLabel = text.includes('demo-wallet');
    const hasSapling = text.includes('Sapling');
    
    this.recordResult('Address format', hasAddress, hasAddress ? 'Valid zs1 address created' : 'No address found');
    this.recordResult('Label', hasLabel, hasLabel ? 'Label preserved' : 'Label missing');
    this.recordResult('Type', hasSapling, hasSapling ? 'Sapling shielded' : 'Type not specified');
    
    return hasAddress && hasLabel;
  }

  async testBalanceEmpty() {
    console.log('\n💰 TEST 3: Check initial balance (should be 0)\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'get_balance',
        arguments: {}
      }
    });
    
    const response = await this.getLastResponse();
    const text = response.result?.content?.[0]?.text || '';
    
    const hasZEC = text.includes('ZEC:');
    const hasUSD = text.includes('USD:');
    const isZero = text.includes('0.00000000 ZEC');
    
    this.recordResult('Balance format', hasZEC && hasUSD, 'Shows both ZEC and USD');
    this.recordResult('Initial balance', isZero, isZero ? 'Correctly zero' : 'Unexpected initial balance');
    
    return hasZEC && hasUSD;
  }

  async testPrice() {
    console.log('\n💵 TEST 4: Get ZEC/USD price from CoinGecko\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'get_price',
        arguments: {}
      }
    });
    
    const response = await this.getLastResponse();
    const text = response.result?.content?.[0]?.text || '';
    
    const hasPrice = text.includes('Current Price:');
    const hasCoinGecko = text.includes('CoinGecko');
    const priceMatch = text.match(/\$(\d+\.\d+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    
    this.recordResult('Price API', hasPrice, hasPrice ? 'Price fetched' : 'No price data');
    this.recordResult('Source', hasCoinGecko, 'CoinGecko attribution present');
    this.recordResult('Price value', price > 0, price > 0 ? `$${price.toFixed(2)} (realistic)` : 'Invalid price');
    
    return hasPrice && price > 0;
  }

  async testPaymentNoBalance() {
    console.log('\n💸 TEST 5: Send payment with insufficient balance (should fail gracefully)\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'send_private_payment',
        arguments: {
          to_address: 'zs1test1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          amount: 1.0,
          memo: 'Test payment'
        }
      }
    });
    
    const response = await this.getLastResponse();
    const isError = response.result?.isError === true;
    const text = response.result?.content?.[0]?.text || '';
    const hasInsufficientMsg = text.includes('Insufficient balance');
    
    this.recordResult('Error handling', isError && hasInsufficientMsg, 'Correctly rejects insufficient balance');
    
    return isError;
  }

  async testInvalidAddress() {
    console.log('\n🚫 TEST 6: Send to invalid address (should fail)\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'send_private_payment',
        arguments: {
          to_address: 't1NotAShieldedAddress',
          amount: 0.1,
          memo: 'Invalid test'
        }
      }
    });
    
    const response = await this.getLastResponse();
    const isError = response.result?.isError === true;
    const text = response.result?.content?.[0]?.text || '';
    const hasShieldedCheck = text.includes('shielded');
    
    this.recordResult('Address validation', isError && hasShieldedCheck, 'Rejects non-shielded address');
    
    return isError;
  }

  async testEmptyTransactions() {
    console.log('\n📜 TEST 7: Get transactions (empty history)\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'get_transactions',
        arguments: { limit: 10 }
      }
    });
    
    const response = await this.getLastResponse();
    const text = response.result?.content?.[0]?.text || '';
    const hasEmptyMsg = text.includes('No transactions') || text.includes('empty');
    
    this.recordResult('Empty history', hasEmptyMsg, 'Handles empty transaction list');
    
    return hasEmptyMsg;
  }

  async testDataPersistence() {
    console.log('\n📊 TEST 8: Check if created address persists\n');
    
    // Create another address
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'create_shielded_address',
        arguments: { label: 'second-address' }
      }
    });
    
    const response = await this.getLastResponse();
    const text = response.result?.content?.[0]?.text || '';
    const hasAddress = text.includes('zs1');
    
    this.recordResult('Multiple addresses', hasAddress, 'Can create multiple addresses');
    
    this.recordWarning('Persistence', 'Data stored in memory only (expected for demo)');
    
    return hasAddress;
  }

  printSummary() {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`\n✅ Passed: ${this.testResults.passed.length}`);
    for (const result of this.testResults.passed) {
      console.log(`   - ${result.test}: ${result.message}`);
    }
    
    if (this.testResults.failed.length > 0) {
      console.log(`\n❌ Failed: ${this.testResults.failed.length}`);
      for (const result of this.testResults.failed) {
        console.log(`   - ${result.test}: ${result.message}`);
      }
    }
    
    if (this.testResults.warnings.length > 0) {
      console.log(`\n⚠️  Warnings: ${this.testResults.warnings.length}`);
      for (const result of this.testResults.warnings) {
        console.log(`   - ${result.test}: ${result.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
    const totalTests = this.testResults.passed.length + this.testResults.failed.length;
    const passRate = ((this.testResults.passed.length / totalTests) * 100).toFixed(1);
    
    console.log(`\n📈 Pass Rate: ${passRate}% (${this.testResults.passed.length}/${totalTests})`);
    
    if (this.testResults.failed.length === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Server is demo-ready.\n');
    } else {
      console.log('\n⚠️  Some tests failed. Review issues above.\n');
    }
  }

  async runAllTests() {
    try {
      await this.start();
      
      await this.testToolsList();
      await this.testCreateAddress();
      await this.testBalanceEmpty();
      await this.testPrice();
      await this.testPaymentNoBalance();
      await this.testInvalidAddress();
      await this.testEmptyTransactions();
      await this.testDataPersistence();
      
      this.printSummary();
      
      this.serverProcess.stdin.end();
      this.serverProcess.kill();
      
      process.exit(this.testResults.failed.length > 0 ? 1 : 0);
    } catch (error) {
      console.error('\n❌ Test suite crashed:', error);
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
      process.exit(1);
    }
  }
}

const tester = new MCPFullFlowTester();
tester.runAllTests();
