# Muthoot FinCorp Cash-Flow Agent Manim Video Plan

## Narrative Arc
Show how Taurus AI's Cash-Flow AI Agent solves Muthoot FinCorp's micro-loan repayment challenges by aligning reminders with borrower cash-flow patterns.

### Misconception to Correct
"That generic repayment reminders are sufficient for micro-loans with irregular cash flows."

### Aha Moment
"AI-powered reminders timed to individual borrower cash-flow patterns can significantly improve on-time payments while reducing collection costs."

## Scene List

### Scene 1: Title & Hook (15 seconds)
- Background: Warm academic (#2D2B55)
- Title: "The Micro-loan Repayment Challenge"
- Subtitle: "When reminders don't match cash flow, everyone loses"
- Visual: Split screen - stressed borrower checking empty wallet vs collections agent making calls
- Voiceover: "Micro-business traders, hoteliers, and grocers face irregular daily income - yet their loan repayments demand fixed daily/weekly payments. This mismatch creates stress for borrowers and inefficiency for lenders."

### Scene 2: Current State - Generic Reminders (20 seconds)
- Show calendar with fixed daily repayment reminders (same time every day)
- Show borrower income pattern: irregular spikes (market days, customer payments)
- Show mismatch: reminders often come when borrower has low cash
- Visual: Animated income stream with reminder icons appearing at fixed intervals
- Voiceover: "Today's generic reminders ignore borrower cash-flow reality - sending payment requests when funds are unavailable, leading to missed payments, late fees, and costly collection calls."

### Scene 3: Borrower Segmentation & Patterns (20 seconds)
- Show three borrower profiles: Trader (weekly market cycles), Hotelier (weekend spikes), Grocer (daily steady + weekly bulk)
- Show their unique income patterns over 2-week period
- Highlight optimal repayment timing for each segment
- Visual: Three income stream graphs with suggested repayment windows highlighted
- Voiceover: "Different micro-businesses have distinct cash-flow patterns: traders earn weekly at market, hoteliers see weekend spikes, grocers have daily steady income with bulk weekly payments. One-size-fits-all reminders don't work."

### Scene 4: AI Agent Analysis Engine (25 seconds)
- Show data inputs: Historical repayment data, borrower segments, loan terms
- Show AI processing: Pattern recognition, cash-flow prediction, optimal timing calculation
- Show outputs: Personalized reminder timing, repayment suggestions, channel preference (SMS/WhatsApp/Call)
- Visual: Data flowing into Ollama qwen3-coder model, insights flowing out
- Voiceover: "Taurus AI's Cash-Flow Agent analyzes historical repayment patterns using fine-tuned Ollama models to predict individual borrower cash-flow, determine optimal reminder timing, and suggest repayment amounts based on predicted income - all while respecting borrower communication preferences."

### Scene 5: Personalized Reminder Delivery (20 seconds)
- Show three scenarios:
  - Trader: Reminder sent Thursday evening (before Friday market)
  - Hotelier: Reminder sent Friday afternoon (before weekend rush)
  - Grocer: Reminder sent Tuesday morning (after Monday restock)
- Show borrower receiving reminder, checking wallet, making payment
- Visual: Calendar with dynamically timed reminders matching income spikes
- Voiceover: "Instead of fixed-time reminders, the AI agent delivers personalized requests when borrowers are most likely to have funds - increasing payment success while reducing the 'payment when broke' feeling."

### Scene 6: Repayment Suggestions & Flexibility (15 seconds)
- Show borrower with partial funds
- Show AI suggesting: "Pay ₹300 now (60% of ₹500 due) + ₹200 tomorrow"
- Show borrower accepting split payment
- Visual: Dynamic repayment adjustment based on real-time cash flow
- Voiceover: "When full payment isn't possible, the agent suggests affordable partial payments based on predicted cash flow - maintaining engagement and reducing the psychological barrier to repayment."

### Scene 7: Muthoot FinCorp Benefits (20 seconds)
- Show metrics improving over time:
  - Collection calls: ↓ 15% 
  - On-time payments: ↑ 10%
  - Borrower satisfaction: ↑ (smiley faces increasing)
  - Portfolio health: ↑ (green trend line)
- Visual: Four improving metrics with before/after comparison
- Voiceover: "For Muthoot FinCorp, this means significantly reduced collection costs, improved on-time payment rates, happier borrowers, and healthier loan portfolios - all from smarter, AI-driven reminder timing."

### Scene 8: Deployment & Integration (15 seconds)
- Show simple architecture:
  - Input: Anonymized borrower/loan/repayment data (CSV or API)
  - Engine: Docker-compose with Ollama qwen3-coder + SQLite
  - Output: SMS/WhatsApp via Twilio, repayment suggestions, web dashboard
- Visual: Simple box diagram showing data in, insights and reminders out
- Voiceover: "Deployment is simple: Docker-compose running on Muthoot's infrastructure (on-prem or cloud), using Ollama for local AI (zero API costs), SQLite for storage, and Twilio for messaging - no complex integrations required."

### Scene 9: Pilot Results & Call to Action (20 seconds)
- Show pilot setup: 50 micro-loans, 4-week duration
- Show projected outcomes based on similar implementations
- Show testimonial quote placeholder from Head of Retail Lending
- Show pricing: $1,999/month flat OR $0.15/active loan/month
- Voiceover: "A 4-week pilot with 50 micro-loans validates the approach and builds the case for rollout. After pilot, flexible pricing scales with your success - either flat fee or per-loan basis."

### Scene 10: Closing (10 seconds)
- Logos: Taurus AI (Nexus) + Muthoot FinCorp
- Text: "Empowering Micro-businesses with AI-Driven Financial Resilience"
- Contact: partnership@taurus.ai
- Voiceover: "Together, we can transform micro-loan repayment from a stress point into a strength for both borrowers and lenders."

## Visual Style
- Color Palette: Warm academic (#2D2B55 background, #FF6B6B primary, #FFD93D secondary, #6BCB77 accent)
- Font: Menlo (monospace for all text)
- Animation Speed: Approachable - slightly slower for emotional connection
- Key Principle: Show human impact first, then reveal the AI solution

## Technical Notes
- Use ValueTracker for animated income streams and repayment timing
- Use BarChart/Axes for showing borrower segments and metrics improvement
- Use Tex/MathTex for any equations (though minimal in this business-focused demo)
- Use Image/MovieClip for borrower/lender human elements (if available)
- Use Arrow/Curve for data flow and suggestion animations