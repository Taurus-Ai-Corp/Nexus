# 🏰 Taurus AI Corp. - AI Agent Registry

A comprehensive AI agent system that combines local AI capabilities with cultural marketing intelligence for global business transformation.

## 🚀 Features

### 🎨 Vibe Marketing Agent
- **Cultural Intelligence**: Market-specific content for UAE, India, Canada, and global markets
- **Brand Personality**: Aligns content with your brand's unique vibe and values
- **Multi-Format Content**: Social media, blogs, emails, ads, and more
- **Performance Analytics**: Engagement scoring, brand alignment, and market relevance metrics
- **Campaign Suites**: Generate complete marketing campaigns across multiple formats

### 🦙 Ollama Local Agent
- **Zero-Cost AI**: Local AI models with no ongoing API costs
- **Multiple Models**: Llama 3.1, Phi-3, CodeLlama, Mistral, and more
- **Versatile Capabilities**: Text generation, code generation, analysis, and embeddings
- **Privacy-First**: All processing happens on your local infrastructure
- **Performance Optimization**: Fast, balanced, and quality model options

### 🏰 Agent Registry
- **Central Management**: Unified system for all AI agents
- **Health Monitoring**: Real-time agent status and performance tracking
- **Capability Discovery**: Find agents by skills, domains, or requirements
- **Scalable Architecture**: Easy to add new agents and capabilities

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- 8GB+ RAM (for quality AI models)
- 10GB+ storage space (for local models)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/taurus-ai-corp/taurus-ai-agent-registry.git
cd taurus-ai-agent-registry

# Install dependencies
pip install -r requirements.txt

# Install Ollama (for local AI)
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama server
ollama serve
```

## 🎯 Usage Examples

### Basic Vibe Marketing
```python
from agents.vibe_marketing_agent import VibeMarketingAgent, VibeProfile, ContentRequest, ContentType, VibeStyle, TargetMarket

# Create brand profile
vibe_profile = VibeProfile(
    brand_name="Your Company",
    industry="Technology",
    target_audience="Business leaders",
    primary_vibe=VibeStyle.INNOVATIVE,
    secondary_vibes=[VibeStyle.PROFESSIONAL],
    tone_keywords=["innovative", "transformative"],
    avoid_keywords=["generic", "boring"],
    brand_values=["innovation", "excellence"],
    unique_selling_points=["AI-powered solutions", "Global reach"]
)

# Generate content
agent = VibeMarketingAgent()
content = await agent.generate_content(ContentRequest(
    content_type=ContentType.SOCIAL_MEDIA_POST,
    vibe_profile=vibe_profile,
    target_market=TargetMarket.UAE,
    topic="Digital Transformation",
    key_messages=["Transform your business", "AI-powered solutions"],
    call_to_action="Get started today!",
    length_requirement="short"
))
```

### Local AI with Ollama
```python
from agents.ollama_local_agent import OllamaLocalAgent

# Initialize local AI agent
agent = OllamaLocalAgent()
await agent.initialize()

# Generate text
response = await agent.generate_text(
    prompt="Explain quantum computing in simple terms",
    max_tokens=200,
    temperature=0.7
)

# Generate code
code = await agent.generate_code(
    description="Create a Python function to sort a list of dictionaries by a specific key",
    language="python"
)
```

### Campaign Generation
```python
# Generate complete campaign suite
campaign_content = await agent.generate_campaign_suite(
    vibe_profile=vibe_profile,
    target_market=TargetMarket.GLOBAL,
    campaign_theme="Digital Innovation",
    content_types=[
        ContentType.SOCIAL_MEDIA_POST,
        ContentType.EMAIL_CAMPAIGN,
        ContentType.BLOG_ARTICLE
    ]
)
```

## 🌍 Market Intelligence

### UAE Market
- **Cultural Focus**: Luxury, innovation, hospitality, ambition
- **Content Style**: Premium, aspirational, family-oriented
- **Platforms**: Instagram, LinkedIn, TikTok, WhatsApp
- **Peak Times**: 19:00-23:00, 12:00-14:00

### Indian Market
- **Cultural Focus**: Family, value, innovation, growth, community
- **Content Style**: Relatable, value-driven, educational
- **Platforms**: WhatsApp, Instagram, Facebook, YouTube
- **Peak Times**: 20:00-22:00, 13:00-15:00

### Canadian Market
- **Cultural Focus**: Inclusivity, sustainability, quality, politeness, diversity
- **Content Style**: Authentic, informative, respectful
- **Platforms**: LinkedIn, Facebook, Instagram, Twitter
- **Peak Times**: 18:00-21:00, 12:00-13:00

## 🔧 Configuration

### Environment Variables
```bash
# Ollama Configuration
OLLAMA_URL=http://localhost:11434

# AI Router Configuration (if using external AI)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

### Agent Configuration
```python
# Update agent configuration
agent.update_config({
    "max_tokens": 1000,
    "temperature": 0.8,
    "cultural_sensitivity": "high"
})

# Get current configuration
config = agent.get_config()
```

## 📊 Performance Monitoring

### Health Checks
```python
# Check agent health
health_status = await agent.health_check()

# Registry-wide health check
registry_health = await registry.health_check_all()
```

### Analytics
```python
# Get engagement metrics
engagement_score = content.estimated_engagement_score
brand_alignment = content.brand_alignment_score
market_relevance = content.market_relevance_score

# Registry statistics
stats = registry.get_registry_stats()
```

## 🚀 Advanced Features

### Custom AI Routers
```python
class CustomAIRouter:
    async def generate_text(self, prompt: str, **kwargs) -> str:
        # Your custom AI logic here
        return "Generated content"
    
    async def chat_completion(self, messages: list, **kwargs) -> dict:
        # Your custom chat logic here
        return {"message": {"content": "Response"}}

# Use custom router
agent.set_ai_router(CustomAIRouter())
```

### Model Recommendations
```python
# Get best model for task
best_model = agent.recommend_model(
    task_type="code",
    performance_preference="quality"
)

# Get model statistics
model_stats = await agent.get_model_stats()
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
python test_agents.py

# Run demo
python demo_agents.py
```

### Test Results
- ✅ Vibe Marketing Agent: Content generation and cultural adaptation
- ✅ Ollama Local Agent: Local AI capabilities and model management
- ✅ Agent Registry: Central management and monitoring

## 📁 Project Structure

```
taurus-ai-agent-registry/
├── agents/
│   ├── vibe_marketing_agent.py      # Cultural marketing content
│   ├── ollama_local_agent.py        # Local AI capabilities
│   ├── test_agents.py               # Test suite
│   └── demo_agents.py               # Usage examples
├── registry/
│   ├── base_agent.py                # Base agent class
│   ├── agent_registry.py            # Central registry
│   └── server.py                    # API server
├── configs/                         # Configuration files
├── monitoring/                      # Monitoring and analytics
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## 🔒 Security & Privacy

- **Local Processing**: All AI operations happen on your infrastructure
- **No Data Sharing**: Your content and prompts stay private
- **Secure Models**: Local models with no external API calls
- **Configurable Access**: Control who can use which agents

## 🌟 Use Cases

### Marketing Teams
- Generate culturally-appropriate content for global markets
- Create consistent brand messaging across platforms
- Optimize content for engagement and conversion
- Scale content production without losing quality

### Development Teams
- Local AI development with zero ongoing costs
- Code generation and analysis
- Technical documentation and explanations
- Prototyping and experimentation

### Business Leaders
- Global market expansion with cultural intelligence
- Automated content creation and optimization
- Performance analytics and insights
- Scalable AI solutions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run linting
black agents/ registry/
flake8 agents/ registry/

# Run tests
pytest tests/
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/taurus-ai-corp/taurus-ai-agent-registry/wiki)
- **Issues**: [GitHub Issues](https://github.com/taurus-ai-corp/taurus-ai-agent-registry/issues)
- **Discussions**: [GitHub Discussions](https://github.com/taurus-ai-corp/taurus-ai-agent-registry/discussions)
- **Email**: support@taurus-ai-corp.com

## 🎯 Roadmap

- [ ] Additional market support (Europe, Asia-Pacific, Latin America)
- [ ] Advanced analytics and reporting
- [ ] Integration with popular marketing platforms
- [ ] Real-time content optimization
- [ ] Multi-language support
- [ ] Advanced AI model management
- [ ] Cloud deployment options

---

**Built with ❤️ by Taurus AI Corp.**

*Transform your business with intelligent, culturally-aware AI solutions.*
