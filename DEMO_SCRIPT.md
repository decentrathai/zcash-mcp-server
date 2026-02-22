# Zcash MCP Server - Demo Video Script

**Duration:** ~2 minutes
**Track:** Building Cool Agents

---

## Scene 1: Introduction (0:00 - 0:15)

**Visual:** Show repository on GitHub
**Narration:**

> "Hi! I'm Alex from decentrathai, and I built the Zcash MCP Server for the MCP & AI Agents Hackathon. This project brings private blockchain payments to AI agents using the Model Context Protocol."

**On Screen:**
- GitHub repo: github.com/decentrathai/zcash-mcp-server
- Project title and tagline

---

## Scene 2: The Problem (0:15 - 0:30)

**Visual:** Slide with privacy concerns
**Narration:**

> "Today's payment systems lack privacy. Every transaction - amount, sender, recipient - is tracked. But what if AI agents could send fully private payments that protect user privacy?"

**On Screen:**
- Traditional payments: ❌ Public amounts, ❌ Tracked addresses
- Zcash payments: ✅ Private amounts, ✅ Encrypted memos

---

## Scene 3: The Solution (0:30 - 0:50)

**Visual:** Architecture diagram
**Narration:**

> "The Zcash MCP Server solves this by integrating Zcash's shielded transactions into the MCP ecosystem. AI agents can now create private addresses, check balances, send payments with encrypted memos, and view transaction history - all while maintaining complete privacy."

**On Screen:**
```
MCP Client (Claude/Cline)
        ↓
  Zcash MCP Server
        ↓
   Zcash Blockchain
```

**5 Tools:**
1. create_shielded_address
2. get_balance
3. send_private_payment
4. get_transactions
5. get_price

---

## Scene 4: Live Demo - Setup (0:50 - 1:05)

**Visual:** Show Claude Desktop config
**Narration:**

> "Setup is simple. Install the npm package, add it to your MCP client config - like Claude Desktop - and restart. The server connects via stdio and exposes five powerful tools."

**On Screen:**
```json
{
  "mcpServers": {
    "zcash": {
      "command": "node",
      "args": ["./index.js"]
    }
  }
}
```

---

## Scene 5: Live Demo - Creating Address (1:05 - 1:25)

**Visual:** Claude Desktop showing tool usage
**Narration:**

> "Let's see it in action. I'll ask Claude to create a shielded address for donations."

**User Input:** 
> "Create a shielded Zcash address labeled 'donations'"

**Claude Response:**
> "✅ Created new shielded address
> Address: zs1abc123...
> Label: donations
> Type: Sapling (shielded)"

**Narration:**
> "The MCP server generates a fully private z-address that can receive encrypted payments."

---

## Scene 6: Live Demo - Sending Payment (1:25 - 1:45)

**Visual:** Continue in Claude Desktop
**Narration:**

> "Now let's send a private payment. I'll ask Claude to send 0.5 ZEC with an encrypted memo."

**User Input:**
> "Send 0.5 ZEC to zs1xyz789... with memo 'Thanks for your work'"

**Claude Response:**
> "🔒 Private Payment Sent
> Transaction ID: abc123...
> Amount: 0.5 ZEC
> Memo: Thanks for your work
> Status: Pending confirmation
>
> 🛡️ Privacy: This transaction is fully shielded. Amount, sender, recipient, and memo are encrypted on-chain."

**Narration:**
> "The payment is completely private - no one can see the amount, addresses, or message except the sender and recipient."

---

## Scene 7: Real-World Use Cases (1:45 - 1:55)

**Visual:** Slide with use cases
**Narration:**

> "This enables powerful use cases: privacy-preserving payment bots, anonymous donations, supply chain automation, and subscription management - all with AI agents."

**On Screen:**
- 💬 Payment Bots
- 🎁 Anonymous Donations
- 📦 Supply Chain
- 📅 Subscriptions

---

## Scene 8: Closing (1:55 - 2:00)

**Visual:** GitHub repo + call to action
**Narration:**

> "Check out the full code on GitHub, star the repo, and let's build a more private future for AI agents. Thanks!"

**On Screen:**
- ⭐ github.com/decentrathai/zcash-mcp-server
- 📚 Full tutorial included
- 🔒 Built for privacy
- Track: Building Cool Agents

---

## Technical Highlights to Mention

1. **MCP SDK Integration** - Uses official @modelcontextprotocol/sdk
2. **Privacy First** - All transactions use Zcash's Sapling shielded protocol
3. **Developer Friendly** - Simple npm install, works with any MCP client
4. **Real-Time Pricing** - Integrates with CoinGecko API
5. **Extensible** - Easy to add new tools and features

## Recording Tips

- Use screen recording software (OBS, Loom, QuickTime)
- Show actual code and terminal output
- Demonstrate real MCP client interaction (Claude Desktop recommended)
- Keep narration clear and concise
- Ensure audio quality is good
- Show GitHub repo at beginning and end

## Required Elements

✅ Introduce yourself and project
✅ Explain the problem you're solving
✅ Show the solution/demo
✅ Highlight technical implementation
✅ Show real usage in MCP client
✅ Explain real-world use cases
✅ Call to action (GitHub repo)

Duration: Exactly 2 minutes ⏱️
