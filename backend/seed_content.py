"""
Seed script to populate MongoDB with sample Relvanta content.
Run this to initialize the database with products, services, labs, and pages.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
from datetime import datetime, timezone
import uuid

load_dotenv(Path(__file__).parent / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']


async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Seeding Relvanta Platform database...")
    
    # Clear existing content collections
    await db.products.delete_many({})
    await db.services.delete_many({})
    await db.labs.delete_many({})
    await db.pages.delete_many({})
    await db.redirects.delete_many({})
    
    print("✅ Cleared existing content")
    
    # ========================================================================
    # PRODUCTS
    # ========================================================================
    products = [
        {
            "id": str(uuid.uuid4()),
            "slug": "oneeye",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "order": 1,
            "name": "OneEye",
            "tagline": "AI-powered visual intelligence for modern businesses",
            "short_description": "Transform visual data into actionable insights with advanced computer vision and deep learning.",
            "long_description": """# OneEye - Visual Intelligence Platform

## Overview

OneEye is a revolutionary AI-powered platform that transforms how businesses interact with visual data. Leveraging cutting-edge computer vision and deep learning models, OneEye analyzes images and video streams to identify patterns, detect anomalies, and extract actionable intelligence.

## Key Features

### Real-Time Object Detection
Detect and track objects across multiple video feeds simultaneously with sub-second latency.

### Anomaly Detection
Identify unusual patterns or behaviors that deviate from normal operations automatically.

### Sentiment Analysis
Extract emotional cues and sentiment from visual data to understand customer reactions.

### Quality Control Automation
Automate quality inspection processes with 99.8% accuracy across manufacturing lines.

## Use Cases

- **Retail**: Customer behavior analysis, inventory monitoring, theft prevention
- **Manufacturing**: Defect detection, production line optimization, safety compliance
- **Security**: Threat detection, access control, perimeter monitoring
- **Healthcare**: Medical imaging analysis, patient monitoring, facility management

## Integration

OneEye provides RESTful APIs and SDKs for seamless integration with your existing infrastructure.

```python
import oneeye

# Initialize client
client = oneeye.Client(api_key="your_key")

# Analyze image
result = client.analyze_image("path/to/image.jpg")
print(result.detections)
```

## Pricing

Contact our team for enterprise pricing tailored to your needs.
""",
            "category": "Visual Analytics",
            "status": "live",
            "accent_color": "#4A90E2",
            "icon": "/icons/oneeye.svg",
            "features": [
                "Real-time object detection",
                "Anomaly detection",
                "Sentiment analysis",
                "Automated quality control",
                "Multi-stream processing",
                "RESTful API"
            ],
            "target_audience": "Retail, Manufacturing, Security, Healthcare",
            "links": {
                "demo": "/products/oneeye/demo",
                "docs": "/products/oneeye/docs"
            },
            "theme": {
                "primary_color": "#4A90E2",
                "secondary_color": "#E0F2F7"
            }
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "predictiq",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "order": 2,
            "name": "PredictIQ",
            "tagline": "Forecasting the future with advanced predictive analytics",
            "short_description": "Leverage machine learning to predict trends, optimize operations, and make data-driven decisions.",
            "long_description": """# PredictIQ - Predictive Analytics Platform

## Transform Data into Foresight

PredictIQ empowers businesses to anticipate market trends, customer behavior, and operational challenges before they happen. Our platform combines advanced machine learning algorithms with intuitive visualization to deliver actionable predictions.

## Core Capabilities

### Time Series Forecasting
Predict future values based on historical patterns with state-of-the-art ARIMA, LSTM, and Prophet models.

### Demand Forecasting
Optimize inventory and supply chain with accurate demand predictions across multiple time horizons.

### Customer Churn Prediction
Identify at-risk customers early and take proactive retention measures.

### Anomaly Detection
Detect unusual patterns that could indicate fraud, system failures, or market opportunities.

## Why PredictIQ?

- **Accuracy**: 95%+ prediction accuracy across diverse use cases
- **Speed**: Real-time predictions with sub-100ms latency
- **Scalability**: Handle billions of data points effortlessly
- **Explainability**: Understand why predictions are made with built-in model interpretability

## Industries We Serve

- Financial Services
- E-commerce & Retail
- Manufacturing
- Telecommunications
- Healthcare

## Get Started

Request a demo to see PredictIQ in action with your data.
""",
            "category": "Predictive Analytics",
            "status": "beta",
            "accent_color": "#10B981",
            "icon": "/icons/predictiq.svg",
            "features": [
                "Time series forecasting",
                "Demand prediction",
                "Churn prediction",
                "Anomaly detection",
                "Model explainability",
                "Custom model training"
            ],
            "target_audience": "Financial Services, E-commerce, Manufacturing",
            "links": {
                "demo": "/products/predictiq/demo"
            },
            "theme": {
                "primary_color": "#10B981",
                "secondary_color": "#D1FAE5"
            }
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "chatflow",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "order": 3,
            "name": "ChatFlow",
            "tagline": "Intelligent conversational AI for seamless customer engagement",
            "short_description": "Build sophisticated chatbots and virtual assistants powered by the latest LLMs.",
            "long_description": """# ChatFlow - Conversational AI Platform

## Elevate Customer Interactions

ChatFlow enables businesses to create intelligent, context-aware chatbots and virtual assistants that deliver exceptional customer experiences across all channels.

## Platform Features

### Multi-Channel Support
Deploy your AI assistant across web chat, mobile apps, WhatsApp, Slack, and more.

### Natural Language Understanding
Leverage GPT-4 and Claude to understand customer intent with human-like accuracy.

### Contextual Memory
Maintain conversation context across multiple interactions for personalized experiences.

### Enterprise Integration
Connect seamlessly with your CRM, knowledge base, and backend systems.

### Analytics Dashboard
Track conversation metrics, user satisfaction, and bot performance in real-time.

## Use Cases

- **Customer Support**: Automate tier-1 support and deflect up to 70% of inquiries
- **Sales Assistance**: Qualify leads and guide prospects through the sales funnel
- **Internal Help Desk**: Provide employees instant access to company information
- **Appointment Booking**: Schedule meetings and manage calendars automatically

## Security & Compliance

- SOC 2 Type II certified
- GDPR compliant
- End-to-end encryption
- Role-based access control

## Start Building

No-code builder for non-technical users, API for developers.
""",
            "category": "Conversational AI",
            "status": "live",
            "accent_color": "#8B5CF6",
            "icon": "/icons/chatflow.svg",
            "features": [
                "Multi-channel deployment",
                "GPT-4 powered",
                "Contextual memory",
                "Enterprise integrations",
                "No-code builder",
                "Analytics dashboard"
            ],
            "target_audience": "Customer Support, Sales, HR, IT",
            "links": {
                "demo": "/products/chatflow/demo",
                "docs": "/products/chatflow/docs",
                "external": "https://chatflow-demo.relvanta.com"
            },
            "theme": {
                "primary_color": "#8B5CF6",
                "secondary_color": "#EDE9FE"
            }
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✅ Inserted {len(products)} products")
    
    # ========================================================================
    # SERVICES
    # ========================================================================
    services = [
        {
            "id": str(uuid.uuid4()),
            "slug": "ai-strategy-consulting",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "order": 1,
            "name": "AI Strategy Consulting",
            "summary": "Define your AI roadmap and identify high-impact opportunities for AI adoption.",
            "description": """# AI Strategy Consulting

## Transform Your Business with AI

Our AI Strategy Consulting service helps medium-sized businesses navigate the complex landscape of artificial intelligence and identify opportunities for transformative impact.

## What We Deliver

### Discovery & Assessment
- Current state analysis of your technology stack
- Identification of AI-ready use cases
- ROI estimation for potential initiatives
- Competitive landscape analysis

### Strategy Development
- 3-year AI roadmap aligned with business goals
- Prioritized list of AI initiatives
- Build vs. buy recommendations
- Risk assessment and mitigation strategies

### Implementation Planning
- Technical architecture design
- Team structure and skills gap analysis
- Vendor selection criteria
- Change management framework

## Engagement Process

1. **Week 1-2**: Discovery workshops and data analysis
2. **Week 3-4**: Strategy formulation and validation
3. **Week 5-6**: Roadmap development and presentation

## Deliverables

- Executive summary and recommendations
- Detailed AI roadmap (3-year horizon)
- Use case portfolio with ROI projections
- Implementation playbook
- Ongoing advisory support (3 months)

## Investment

Starting at $25,000 for a 6-week engagement.
""",
            "scope": [
                "Discovery & assessment",
                "Strategy development",
                "Roadmap creation",
                "Implementation planning"
            ],
            "engagement_type": "project",
            "deliverables": [
                "AI readiness assessment",
                "3-year AI roadmap",
                "Use case portfolio",
                "Implementation playbook"
            ],
            "duration": "6 weeks"
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "mlops-implementation",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "order": 2,
            "name": "MLOps Implementation",
            "summary": "Build production-grade ML infrastructure for reliable model deployment and monitoring.",
            "description": """# MLOps Implementation Service

## Operationalize Your Machine Learning

We help you build robust MLOps infrastructure to deploy, monitor, and maintain machine learning models at scale.

## Service Overview

### Infrastructure Setup
- CI/CD pipelines for ML workflows
- Model registry and versioning
- Feature store implementation
- Automated testing frameworks

### Deployment Architecture
- Containerization with Docker/Kubernetes
- Serverless deployment options
- A/B testing infrastructure
- Blue-green deployment strategies

### Monitoring & Observability
- Model performance tracking
- Data drift detection
- Prediction monitoring
- Alerting systems

### Governance & Compliance
- Model documentation standards
- Audit trails and lineage tracking
- Bias and fairness testing
- Regulatory compliance frameworks

## Technology Stack

We work with industry-leading tools:
- MLflow, Kubeflow, or Vertex AI
- Docker & Kubernetes
- Prometheus & Grafana
- Git & DVC

## Typical Engagement

8-12 weeks to establish end-to-end MLOps capabilities.

## Outcomes

- 10x faster model deployment
- 50% reduction in model maintenance overhead
- Comprehensive observability
- Reproducible experiments
""",
            "scope": [
                "Infrastructure setup",
                "Deployment architecture",
                "Monitoring setup",
                "Governance frameworks"
            ],
            "engagement_type": "project",
            "deliverables": [
                "MLOps infrastructure",
                "CI/CD pipelines",
                "Monitoring dashboards",
                "Documentation & training"
            ],
            "duration": "8-12 weeks"
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "ai-pilot-program",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "order": 3,
            "name": "AI Pilot Program",
            "summary": "Validate AI use cases with rapid prototyping and proof-of-concept development.",
            "description": """# AI Pilot Program

## Test Before You Invest

Our AI Pilot Program allows you to validate use cases and prove value before committing to full-scale implementation.

## Program Structure

### Phase 1: Use Case Definition (Week 1)
- Collaborative workshop to define success metrics
- Data requirements assessment
- Technical feasibility analysis

### Phase 2: Rapid Prototyping (Weeks 2-4)
- Build minimum viable model
- Integrate with test environment
- Iterate based on feedback

### Phase 3: Evaluation & Roadmap (Week 5-6)
- Measure against success criteria
- Production readiness assessment
- Scale-up planning

## What's Included

- Dedicated data scientist and engineer
- Access to Relvanta AI platform
- Weekly progress reviews
- Final presentation to stakeholders

## Ideal For

- Testing new AI applications
- Validating vendor solutions
- Building internal AI buy-in
- Risk mitigation before large investments

## Investment

$15,000 for a 6-week pilot with one use case.

## Success Stories

We've run 50+ pilots with a 75% conversion rate to production.
""",
            "scope": [
                "Use case definition",
                "Rapid prototyping",
                "Evaluation",
                "Roadmap planning"
            ],
            "engagement_type": "pilot",
            "deliverables": [
                "Working prototype",
                "Performance metrics",
                "Production roadmap",
                "Technical documentation"
            ],
            "duration": "6 weeks"
        }
    ]
    
    await db.services.insert_many(services)
    print(f"✅ Inserted {len(services)} services")
    
    # ========================================================================
    # LABS (Experimental Projects)
    # ========================================================================
    labs = [
        {
            "id": str(uuid.uuid4()),
            "slug": "code-oracle",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "labs",
            "order": 1,
            "name": "CodeOracle",
            "description": """# CodeOracle - AI-Powered Code Review Assistant

## Experiment Overview

CodeOracle is an experimental tool that uses large language models to provide intelligent code review suggestions, detect potential bugs, and recommend best practices.

## Hypothesis

LLMs fine-tuned on codebases can provide more contextually relevant code reviews than traditional static analysis tools, reducing review time by 40% while maintaining code quality.

## Current Status

We're currently in the **running** phase with 10 pilot teams testing the tool.

## Technology Stack

- GPT-4 for code understanding
- Custom fine-tuning on Python and TypeScript codebases
- GitHub Actions integration
- Vector embeddings for codebase context

## Early Results

- Average review time reduced by 32%
- 85% of suggestions accepted by developers
- Detected 23 critical bugs missed by linters

## Next Steps

If validated, we plan to graduate CodeOracle to a full product offering in Q3 2025.

## Join the Experiment

We're accepting 5 more pilot customers. Contact us to participate.
""",
            "hypothesis": "LLMs can provide better code reviews than traditional tools with proper context.",
            "status": "running",
            "start_date": datetime(2025, 1, 15, tzinfo=timezone.utc),
            "metrics": [
                {"name": "Review Time Reduction", "target": "40%", "actual": "32%"},
                {"name": "Suggestion Acceptance Rate", "target": "80%", "actual": "85%"},
                {"name": "Critical Bugs Detected", "target": "20", "actual": "23"}
            ]
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "voice-insight",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "labs",
            "order": 2,
            "name": "VoiceInsight",
            "description": """# VoiceInsight - Voice Analytics for Customer Calls

## Experiment Overview

VoiceInsight analyzes customer support calls to extract sentiment, identify common issues, and provide coaching recommendations for agents.

## Hypothesis

Real-time voice analytics can improve customer satisfaction scores by 25% and reduce average handle time by 15%.

## Technology

- Whisper AI for transcription
- Sentiment analysis models
- Topic modeling
- Real-time agent prompting

## Status

Early **hypothesis** phase. We're validating the technical approach with synthetic data.

## Target Metrics

- Customer satisfaction improvement: 25%
- Average handle time reduction: 15%
- Agent performance score increase: 20%

## Timeline

- Q1 2025: Technical validation
- Q2 2025: Pilot with 2-3 customers
- Q3 2025: Graduate or pivot decision
""",
            "hypothesis": "Real-time voice analytics can significantly improve customer support quality.",
            "status": "hypothesis",
            "start_date": datetime(2025, 2, 1, tzinfo=timezone.utc),
            "metrics": [
                {"name": "CSAT Improvement", "target": "25%"},
                {"name": "Handle Time Reduction", "target": "15%"},
                {"name": "Agent Score Increase", "target": "20%"}
            ]
        }
    ]
    
    await db.labs.insert_many(labs)
    print(f"✅ Inserted {len(labs)} labs")
    
    # ========================================================================
    # PAGES
    # ========================================================================
    pages = [
        {
            "id": str(uuid.uuid4()),
            "slug": "about",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "visibility": "public",
            "title": "About Relvanta",
            "content": """# About Relvanta

## Empowering Medium-Sized Businesses with AI

Founded in 2023, Relvanta is on a mission to democratize access to cutting-edge artificial intelligence for medium-sized businesses. We believe AI shouldn't be exclusive to tech giants.

## Our Approach

We combine deep technical expertise with business acumen to deliver AI solutions that generate measurable ROI. Our team has deployed AI systems for over 100 organizations across retail, manufacturing, finance, and healthcare.

## Our Values

- **Pragmatism**: We focus on solutions that work in the real world
- **Transparency**: No black boxes—we explain how our AI systems work
- **Partnership**: Your success is our success
- **Innovation**: We stay at the forefront of AI research

## The Team

Our team includes former researchers from MIT and Stanford, AI engineers from top tech companies, and business consultants with deep industry expertise.

## Contact Us

Ready to explore how AI can transform your business?

Email: hello@relvanta.com  
Location: Stockholm, Sweden
""",
            "seo": {
                "title": "About Relvanta - AI Solutions for Medium-Sized Businesses",
                "description": "Learn about Relvanta's mission to bring enterprise-grade AI to medium-sized businesses.",
                "og_image": "/images/about-og.jpg"
            }
        }
    ]
    
    await db.pages.insert_many(pages)
    print(f"✅ Inserted {len(pages)} pages")
    
    # ========================================================================
    # REDIRECTS
    # ========================================================================
    redirects = [
        {
            "from": "/product/oneeye",
            "to": "/products/oneeye",
            "permanent": True
        },
        {
            "from": "/consulting",
            "to": "/services/ai-strategy-consulting",
            "permanent": True
        }
    ]
    
    await db.redirects.insert_many(redirects)
    print(f"✅ Inserted {len(redirects)} redirects")
    
    print("\n🎉 Database seeded successfully!")
    print("\n📊 Summary:")
    print(f"   - Products: {len(products)}")
    print(f"   - Services: {len(services)}")
    print(f"   - Labs: {len(labs)}")
    print(f"   - Pages: {len(pages)}")
    print(f"   - Redirects: {len(redirects)}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
