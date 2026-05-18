# India NBFC Micro-loan Repayment AI Agent
## Quick Revenue Generation Plan

**Target:** NBFCs like Muthoot FinCorp serving micro-business traders/hoteliers/grocers  
**Pain Point:** High-frequency daily repayment management causing cash-flow stress  
**Solution:** AI-powered micro-collection alert system using Ollama LLM + SMS/WhatsApp  

### Minimum Viable Product Scope
- **Input:** Daily loan portfolio feed (customer_id, loan_id, due_date, amount, historical_payments)  
- **Processing:** 
  - Fine-tuned Ollama model predicts optimal repayment reminder timing/message  
  - Considers borrower cash-flow patterns, business type, payment history  
  - Outputs recommended action: SMS reminder, WhatsApp nudge, or call request  
- **Delivery:** API endpoint returning JSON action recommendation  
- **Deployment:** Docker container on NBFC's cloud or edge server  
- **Pricing:** $1,999/month flat fee (unlimited loans) OR $0.15 per active loan/month  

### Technical Stack (Minimum Licensing)
- **AI Model:** Ollama qwen3-coder:latest (free, local inference)  
- **Fine-tuning:** Synthetic data based on NBFC repayment patterns (no PII)  
- **API:** Python/FastAPI (free)  
- **Messaging:** Twilio SMS API (pay-per-use) OR WhatsApp Business API (if NBFC already approved)  
- **Database:** SQLite for daily batch processing  
- **Hosting:** Docker-compose (NBFC manages infrastructure or you host)  

### Go-to-Market Timeline
- **Week 1:** Deliver this 2-pager to Muthoot FinCorp Head of Retail Lending (via Praveen Varkey intro)  
- **Week 2:** Pilot with 50 micro-business loans (free for testimonial + case study)  
- **Week 3:** Refine model based on pilot feedback, begin paid engagements  
- **Week 4:** Package as deployable Docker container for easy scaling  

### Immediate Next Steps
1. Engage Praveen Varkey for warm intro to Muthoot's lending team  
2. Gather anonymized sample repayment data for model fine-tuning  
3. Create Dockerfile & docker-compose.yml for MVP  
4. Define SLA/SOW for pilot engagement  

**Revenue Potential:** $10K-$20K/month by Month 2 with 5-10 NBFC clients  
**Expansion Path:** Extend to gold loan valuation alerts, remittance tracking, utility payment agents  