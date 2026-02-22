# Zcash MCP Server Tutorial

## Quick Start Guide

This tutorial will walk you through setting up and using the Zcash MCP Server with Claude Desktop or any MCP-compatible client.

## Prerequisites

- Node.js 18+ installed
- MCP-compatible client (Claude Desktop, Cline, etc.)

## Installation

### 1. Clone and Install

```bash
git clone https://github.com/decentrathai/zcash-mcp-server.git
cd zcash-mcp-server
npm install
```

### 2. Configure Your MCP Client

#### For Claude Desktop

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the Zcash MCP server:

```json
{
  "mcpServers": {
    "zcash": {
      "command": "node",
      "args": [
        "/absolute/path/to/zcash-mcp-server/index.js"
      ]
    }
  }
}
```

#### For Other MCP Clients

Check your client's documentation for MCP server configuration.

### 3. Restart Your Client

Restart Claude Desktop or your MCP client to load the new server.

## Usage Examples

### Example 1: Create a Shielded Address

Ask Claude:

> "Create a new shielded Zcash address labeled 'donations'"

Claude will use the `create_shielded_address` tool to generate a private z-address.

### Example 2: Check Balance

> "What's my Zcash balance?"

Claude will check your shielded balance and show it in both ZEC and USD.

### Example 3: Send Private Payment

> "Send 0.5 ZEC to zs1abc123... with memo 'Payment for services'"

Claude will initiate a fully private transaction with an encrypted memo.

### Example 4: View Transaction History

> "Show me my recent Zcash transactions"

Claude will display your shielded transaction history.

### Example 5: Get Price Info

> "What's the current price of Zcash?"

Claude will fetch real-time ZEC/USD pricing.

## Advanced Usage

### Integrating with AI Agents

This MCP server enables AI agents to autonomously handle private payments:

```javascript
// Agent workflow example
1. Agent receives payment request
2. Agent checks balance using get_balance
3. Agent verifies sufficient funds
4. Agent sends payment using send_private_payment
5. Agent confirms transaction and logs txid
```

### Privacy Features

- **Shielded Addresses**: All addresses use Zcash's Sapling protocol for full privacy
- **Encrypted Memos**: Transaction memos are encrypted and only visible to sender/recipient
- **Zero Knowledge Proofs**: Transactions are verified without revealing amounts or addresses
- **No Metadata Leakage**: IP addresses and timing information are protected

## Real-World Use Cases

### 1. AI-Powered Payment Bot

Build a Telegram/Discord bot that accepts natural language payment requests:

> "Pay @alice 5 ZEC for the design work"

The AI agent parses the request, verifies balance, and executes the private transaction.

### 2. Subscription Management

Automate recurring private payments:

```
Agent: "It's time for your monthly VPN subscription payment"
User: "Proceed"
Agent: Sends 0.1 ZEC to provider's z-address with memo "VPN - March 2026"
```

### 3. Privacy-Preserving Donations

Enable anonymous charitable giving:

```
User: "Donate $50 worth of ZEC to the privacy fund"
Agent: Converts USD to ZEC, sends private donation with encrypted receipt
```

### 4. Supply Chain Payments

Automate B2B payments with privacy:

```
Agent monitors supply chain events
Agent automatically pays suppliers when goods are delivered
All amounts and parties remain private
```

## Security Best Practices

1. **Never share private keys** - The MCP server handles addresses, not keys
2. **Use testnet for development** - Test with testnet ZEC before mainnet
3. **Validate addresses** - Always verify z-addresses before sending
4. **Backup wallet data** - Keep secure backups of wallet state
5. **Audit transactions** - Regularly review transaction history

## Troubleshooting

### Server won't start

- Check Node.js version (must be 18+)
- Verify package installation: `npm install`
- Check log output for errors

### Tools not appearing in Claude

- Restart Claude Desktop completely
- Verify config file path is correct
- Check absolute path to index.js

### Price fetch fails

- Check internet connection
- CoinGecko API may have rate limits
- Server falls back to estimated price

## Architecture

```
┌─────────────────┐
│  MCP Client     │
│  (Claude, etc)  │
└────────┬────────┘
         │ MCP Protocol
         │
┌────────▼────────────┐
│  Zcash MCP Server   │
│  - Address Gen      │
│  - Balance Check    │
│  - Send Payment     │
│  - Tx History       │
│  - Price Info       │
└────────┬────────────┘
         │
         │ RPC (future)
         │
┌────────▼────────────┐
│   Zcash Node        │
│   (zcashd/zebra)    │
└─────────────────────┘
```

## Extending the Server

### Add New Tools

Edit `index.js` and add new tool definitions:

```javascript
{
  name: 'estimate_fee',
  description: 'Estimate transaction fee',
  inputSchema: {
    type: 'object',
    properties: {
      amount: { type: 'number' }
    }
  }
}
```

### Connect to Real Zcash Node

Replace simulated functions with actual RPC calls:

```javascript
import { RPCClient } from 'zcash-rpc';

const client = new RPCClient({
  url: 'http://localhost:8232',
  user: 'user',
  password: 'password'
});

// Use client for real blockchain interactions
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

- GitHub Issues: https://github.com/decentrathai/zcash-mcp-server/issues
- Hackathon Discord: https://discord.gg/H28ZKWG2mX

## License

MIT License - See LICENSE file for details

## Credits

Built for the MCP & AI Agents Hackathon 2026 by decentrathai

Powered by:
- Model Context Protocol (MCP)
- Zcash blockchain
- Node.js ecosystem
