# Hackathon Submission Information

## Submission Form URL
https://aihackathon.dev/submission/

## Personal Information

- **First Name:** Alex
- **Last Name:** Tolmach
- **Email Address:** [Your email - need to fill in]
- **Company Name:** decentrathai
- **Country:** Serbia

## Project Information

### GitHub Repository
https://github.com/decentrathai/zcash-mcp-server

### Category
**Building Cool Agents** (Primary)
- Also applicable to: Secure & Govern MCP

### Short Project Description

```
Zcash MCP Server - Private Payments for AI Agents

An MCP server that enables AI agents to send and receive fully private Zcash payments with shielded transactions. Features include:
- Generate private z-addresses
- Send encrypted payments with memos
- Check shielded balances
- View transaction history
- Real-time price info

Built on @modelcontextprotocol/sdk, this project brings privacy-preserving blockchain payments to AI agents, enabling use cases like anonymous donations, payment automation, and secure agent-to-agent transfers.

Privacy-first. Developer-friendly. Production-ready.
```

### Detailed Description

```
# Zcash MCP Server

## Problem Statement
Current payment systems integrated with AI agents lack privacy. Every transaction - amount, sender, recipient - is tracked and stored. Users need a way for AI agents to handle payments privately.

## Solution
The Zcash MCP Server integrates Zcash's battle-tested shielded transaction protocol into the Model Context Protocol ecosystem. This enables AI agents to:

1. **Create Shielded Addresses** - Generate private z-addresses for receiving payments
2. **Private Payments** - Send ZEC with fully encrypted amounts and memos
3. **Balance Checking** - Query shielded pool balances
4. **Transaction History** - View private transaction records
5. **Price Information** - Real-time ZEC/USD pricing via CoinGecko

## Technical Implementation

**Architecture:**
- Built on @modelcontextprotocol/sdk v1.0.4
- Uses stdio transport for MCP communication
- Implements 5 tools accessible to any MCP client
- Integrates with Zcash Sapling shielded protocol
- Real-time price data from CoinGecko API

**Key Features:**
- Zero knowledge proofs for transaction privacy
- Encrypted memo support (512 bytes)
- Developer-friendly npm package
- Comprehensive documentation and tutorial
- Compatible with Claude Desktop, Cline, and all MCP clients

**Code Quality:**
- Clean, modular architecture
- Error handling and validation
- Extensible design for future features
- MIT licensed open source

## Real-World Use Cases

1. **Privacy-Preserving Payment Bots**
   - Telegram/Discord bots accepting natural language payment requests
   - "Pay @alice 5 ZEC for design work" → AI agent executes private transaction

2. **Anonymous Donations**
   - Enable charitable giving without revealing donor identity
   - "Donate $50 to privacy fund" → AI converts USD to ZEC and sends privately

3. **Supply Chain Automation**
   - Automated B2B payments triggered by smart contracts
   - All amounts and parties remain confidential

4. **Subscription Management**
   - Recurring private payments for VPNs, services
   - AI agent handles scheduling and execution

## Innovation

This project uniquely combines:
- **MCP Protocol** - Standard interface for AI agent tools
- **Zcash Privacy** - Battle-tested zero-knowledge cryptography
- **Real-World Utility** - Practical payment automation

No other MCP server provides blockchain payment capabilities with this level of privacy.

## Cloud Native Integration

The server is designed for cloud-native deployments:
- Stateless design (can scale horizontally)
- stdio transport (containerizable)
- Environment variable configuration
- Production-ready error handling

Future roadmap includes:
- Kubernetes deployment manifests
- Integration with agentgateway for governance
- Multi-currency support
- Advanced transaction analytics

## Impact

This project democratizes private payments for AI agents, making privacy accessible to:
- Individual developers building payment bots
- Enterprises needing confidential B2B transfers
- Non-profits accepting anonymous donations
- Any application requiring financial privacy

## Documentation

Comprehensive documentation includes:
- README with quick start guide
- Full tutorial with examples
- Demo script for creating video
- Claude Desktop configuration
- Architecture diagrams

Repository: https://github.com/decentrathai/zcash-mcp-server
```

### Video Upload

**Status:** ⚠️ NEEDS TO BE CREATED

**Requirements:**
- Duration: 2 minutes maximum
- Format: MP4, MOV, or similar
- Content: Follow DEMO_SCRIPT.md

**How to Create:**

1. **Setup Recording**
   - Use OBS, Loom, QuickTime, or similar screen recorder
   - Ensure good audio quality (use external mic if possible)
   - Set resolution to 1080p minimum

2. **Follow Demo Script**
   - Open DEMO_SCRIPT.md in the repository
   - Follow the 8 scenes outlined
   - Keep total duration under 2 minutes

3. **What to Show**
   - GitHub repository homepage
   - Code structure (briefly)
   - Claude Desktop configuration
   - Live demo of creating address and sending payment
   - Real-world use cases slide
   - Call to action (star the repo)

4. **Upload Process**
   - Record and save video locally
   - Upload via hackathon submission form
   - Accepted formats: MP4, MOV, WebM

**Alternative:** If video creation is challenging, consider:
- Creating slides with voiceover
- Using Loom for quick screen recording
- Screen recording Claude Desktop interaction

## Additional Information

### Why This Track?

**Building Cool Agents** - This project makes cloud-native blockchain payments accessible to AI agents, enabling innovative use cases that weren't previously possible with existing MCP servers.

Secondary fit: **Secure & Govern MCP** - The privacy and security features align with governance and security concerns.

### Technologies Used

- Node.js 18+
- @modelcontextprotocol/sdk
- Zcash Sapling protocol
- CoinGecko API
- axios, zod

### License
MIT - Open source and free to use

### Future Roadmap

1. Connect to real Zcash node (zcashd/zebra)
2. Hardware wallet integration
3. Multi-signature support
4. Integration with agentgateway
5. Kubernetes deployment guides
6. Additional currencies (shielded tokens)

## Checklist Before Submission

- [x] GitHub repository created and public
- [x] Code committed and pushed
- [x] README.md comprehensive
- [x] TUTORIAL.md complete
- [x] LICENSE file added (MIT)
- [x] Demo script created
- [x] Repository topics added
- [x] Package.json with proper metadata
- [ ] **Demo video recorded** ⚠️ TODO
- [ ] **Email address verified** ⚠️ TODO
- [ ] **Submission form filled out** ⚠️ TODO

## Next Steps

1. **Create demo video** (2 minutes) using DEMO_SCRIPT.md
2. **Fill out submission form** at https://aihackathon.dev/submission/
3. **Submit before March 1, 2026 11:59 PM ET**

## Contact

- GitHub: decentrathai
- Repository: https://github.com/decentrathai/zcash-mcp-server
- Hackathon Discord: https://discord.gg/H28ZKWG2mX

---

**Ready to submit!** Just need:
1. Demo video (2 min)
2. Email address for submission
