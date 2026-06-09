# Social Suite Dashboard - Platform for Social Media Management Employee

## Overview
I've enhanced the existing Social Suite Dashboard platform to create a comprehensive tool for your social media management employee. The platform now includes:

1. **Enhanced NLP Engine** - Understands natural language commands for campaign creation and management
2. **BizFlow Integration** - Direct access to Meta Business Suite campaign management
3. **Nexus Integration** - Instagram-specific campaign management
4. **Agent Orchestration** - Ability to run BizFlow and Nexus AI agents
5. **Unified Dashboard** - Single interface for all social media management tasks

## Key Features Created

### Backend API Enhancements (`social-suite-dashboard/api/`)
- **enhanced_nlp_engine.py** - Advanced natural language processing that understands:
  - Meta/Facebook campaign creation commands
  - Instagram campaign creation commands (story, reel, feed, explore)
  - Lead generation campaign commands
  - Campaign listing and filtering
  - Pause/resume campaign commands
  - Asset creation/upload commands
  - BizFlow/Nexus agent orchestration
  - Analytics and performance reporting

- **main.py** - Added new API endpoints:
  - POST `/api/bizflow/meta-campaigns` - Create Meta campaigns
  - GET `/api/bizflow/meta-campaigns` - List Meta campaigns
  - POST `/api/nexus/instagram-campaigns` - Create Instagram campaigns
  - GET `/api/nexus/instagram-campaigns` - List Instagram campaigns
  - POST `/api/agents/orchestrate` - Orchestrate BizFlow/Nexus agents

### Frontend Components (`social-suite-dashboard/web/src/components/platforms/`)
- **BizFlowPanel.jsx** - Meta/Facebook campaign management interface
- **NexusPanel.jsx** - Instagram campaign management interface
- **AgentOrchestrationPanel.jsx** - Agent orchestration center for running AI agents
- **Updated App.jsx** - Navigation sidebar to switch between platforms

## How to Use the Platform

### For Your Social Media Management Employee:

#### 1. Natural Language Commands (NLP Panel)
The employee can type commands like:
- `"Create a Meta lead generation campaign for cafés in Windsor with $25/day budget"`
- `"Launch an Instagram story ad campaign targeting Detroit females 25-40 with $30 daily budget"`
- `"Show me all active campaigns"`
- `"Pause campaign 123"`
- `"Run a BizFlow SEO agent to create content about quantum threat mitigation"`
- `"Get analytics for my Instagram campaigns from the last week"`

#### 2. Visual Dashboard Interface
- **BizFlow Campaigns Tab**: Create and manage Meta/Facebook campaigns
- **Nexus Campaigns Tab**: Create and manage Instagram campaigns (story, reel, feed, explore)
- **Agent Orchestration Tab**: Run BizFlow SEO agents, Nexus content/design agents, etc.
- **NLP Command Panel**: Test and refine natural language commands

#### 3. Campaign Management Capabilities
- Create campaigns with specific objectives (lead gen, sales, engagement, brand awareness)
- Set daily/total budgets
- Define targeting (location, age, gender, interests)
- Choose ad formats (for Instagram: story, reel, feed, explore)
- Pause/resume campaigns
- View campaign analytics and performance
- Upload and manage creative assets

### Technical Implementation Details

#### NLP Engine Capabilities:
- Extracts budget information from natural language
- Identifies campaign objectives from contextual clues
- Parses location and demographic targeting
- Understands platform-specific features (Instagram ad formats)
- Maps commands to appropriate API endpoints
- Structures payloads for BizFlow and Nexus systems

#### Integration Points:
- **BizFlow**: Meta Business Suite campaign management via `/api/bizflow/*` endpoints
- **Nexus**: Instagram-specific campaign management via `/api/nexus/*` endpoints
- **Agents**: Agent orchestration via `/api/agents/orchestrate` endpoint (connects to your existing agent systems)

## Next Steps for Deployment

1. **Install Dependencies**:
   ```bash
   # Backend
   cd social-suite-dashboard/api
   pip install -r requirements.txt
   
   # Frontend
   cd social-suite-dashboard/web
   npm install
   
   # NLP Service
   cd social-suite-dashboard/nlp
   npm install
   ```

2. **Set Up Environment**:
   - Copy `.env.example` to `.env`
   - Configure database connection
   - Add API keys for Meta/Instagram (if integrating with real platforms)

3. **Run the Platform**:
   ```bash
   # Option 1: Docker (Recommended)
   docker-compose up --build
   
   # Option 2: Manual
   # Terminal 1: Backend
   cd api && uvicorn main:app --reload
   
   # Terminal 2: Frontend
   cd web && npm run dev
   
   # Terminal 3: NLP Service (if needed)
   cd nlp && npm start
   ```

4. **Access the Dashboard**:
   - Open http://localhost:3000 in browser
   - Login with: employee1@taurusai.corp / employee123

## Benefits for Your Employee

1. **Unified Interface**: Single platform for all social media management tasks
2. **Natural Language Interaction**: No need to learn complex UIs - just type what you want
3. **Direct Agent Access**: Can trigger your existing BizFlow/Nexus AI agents
4. **Real-time Management**: Create, monitor, and adjust campaigns instantly
5. **Analytics Integration**: View performance metrics to optimize campaigns
6. **Cross-Platform**: Manage both Meta and Instagram campaigns in one place

The platform is now ready for your social media management employee to efficiently handle Meta Business Suite and Instagram campaigns while leveraging your existing BizFlow and Nexus AI agent systems.