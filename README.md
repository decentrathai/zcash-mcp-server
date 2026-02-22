# Zcash MCP Server - Private Payments for AI Agents

**Track:** Building Cool Agents

An MCP (Model Context Protocol) server that enables AI agents to send and receive private Zcash payments with full shielded transaction support.

## Features

- **Shielded Addresses**: Generate and manage private Zcash addresses
- **Private Payments**: Send ZEC with encrypted memos
- **Balance Checking**: Query shielded balances
- **Transaction History**: View private transaction history
- **Price Info**: Real-time ZEC/USD pricing

## Why This Matters

Privacy in digital payments is critical. This MCP server brings private, blockchain-based payments to AI agents, enabling:

- **Private agent-to-agent transfers**
- **Secure payment automation**
- **Privacy-preserving transactions**
- **Decentralized finance integration**

## Installation

```bash
npm install
```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "zcash": {
      "command": "node",
      "args": ["/path/to/zcash-mcp-server/index.js"]
    }
  }
}
```

### Available Tools

1. **create_shielded_address** - Generate new private Zcash address
2. **get_balance** - Check shielded balance
3. **send_private_payment** - Send ZEC with encrypted memo
4. **get_transactions** - View transaction history
5. **get_price** - Get current ZEC/USD price

## Architecture

- Built on MCP SDK
- Connects to Zcash RPC node
- Uses shielded (Sapling/Orchard) addresses
- Encrypts transaction memos

## Security

- Private keys never exposed to AI agent
- All transactions use shielded pools
- Encrypted memo support
- No metadata leakage

## Demo

See `demo/` folder for example usage with Claude Desktop and other MCP clients.

## License

MIT

## Author

decentrathai - Built for MCP & AI Agents Hackathon 2026
