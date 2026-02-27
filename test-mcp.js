#!/usr/bin/env node

/**
 * MCP Server Test Script
 * Tests all 5 tools of the Zcash MCP Server
 */

import { spawn } from 'child_process';
import { createInterface } from 'readline';

class MCPTester {
  constructor() {
    this.requestId = 0;
    this.responses = [];
    this.serverProcess = null;
  }

  async start() {
    console.log('🚀 Starting Zcash MCP Server test...\n');
    
    // Start the MCP server
    this.serverProcess = spawn('node', ['index.js'], {
      cwd: process.cwd(),
    });

    let buffer = '';
    
    // Handle server output
    this.serverProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      
      // Try to parse complete JSON-RPC messages
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line);
            this.responses.push(response);
            console.log('📨 Received:', JSON.stringify(response, null, 2));
          } catch (e) {
            // Not JSON, might be stderr message
            if (!line.includes('MCP Server running')) {
              console.log('📝 Server log:', line);
            }
          }
        }
      }
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.log('🔧 Server stderr:', data.toString());
    });

    this.serverProcess.on('error', (error) => {
      console.error('❌ Server error:', error);
    });

    // Wait for server to start
    await this.sleep(1000);

    // Initialize
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          roots: {
            listChanged: true
          }
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    });

    await this.sleep(500);

    // Send initialized notification
    await this.sendNotification({
      jsonrpc: '2.0',
      method: 'notifications/initialized'
    });

    await this.sleep(500);
  }

  async sendRequest(request) {
    console.log('📤 Sending request:', JSON.stringify(request, null, 2));
    this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
  }

  async sendNotification(notification) {
    console.log('📤 Sending notification:', JSON.stringify(notification, null, 2));
    this.serverProcess.stdin.write(JSON.stringify(notification) + '\n');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testListTools() {
    console.log('\n\n=== TEST 1: List Tools ===\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/list',
      params: {}
    });
    
    await this.sleep(500);
  }

  async testCreateAddress() {
    console.log('\n\n=== TEST 2: Create Shielded Address ===\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'create_shielded_address',
        arguments: {
          label: 'test-donations'
        }
      }
    });
    
    await this.sleep(500);
  }

  async testGetBalance() {
    console.log('\n\n=== TEST 3: Get Balance ===\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'get_balance',
        arguments: {}
      }
    });
    
    await this.sleep(500);
  }

  async testSendPayment() {
    console.log('\n\n=== TEST 4: Send Private Payment ===\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'send_private_payment',
        arguments: {
          to_address: 'zs1test1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          amount: 0.5,
          memo: 'Test payment from MCP test suite'
        }
      }
    });
    
    await this.sleep(500);
  }

  async testGetTransactions() {
    console.log('\n\n=== TEST 5: Get Transactions ===\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'get_transactions',
        arguments: {
          limit: 5
        }
      }
    });
    
    await this.sleep(500);
  }

  async testGetPrice() {
    console.log('\n\n=== TEST 6: Get ZEC Price ===\n');
    
    await this.sendRequest({
      jsonrpc: '2.0',
      id: this.requestId++,
      method: 'tools/call',
      params: {
        name: 'get_price',
        arguments: {}
      }
    });
    
    await this.sleep(1000); // Wait for API call
  }

  async runAllTests() {
    try {
      await this.start();
      await this.testListTools();
      await this.testCreateAddress();
      await this.testGetBalance();
      await this.testSendPayment();
      await this.testGetTransactions();
      await this.testGetPrice();
      
      console.log('\n\n✅ All tests completed!\n');
      console.log(`Total responses received: ${this.responses.length}`);
      
      // Cleanup
      this.serverProcess.stdin.end();
      this.serverProcess.kill();
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error);
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
      process.exit(1);
    }
  }
}

const tester = new MCPTester();
tester.runAllTests();
