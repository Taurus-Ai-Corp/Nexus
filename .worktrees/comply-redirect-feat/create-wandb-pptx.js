const pptxgen = require('pptxgenjs');

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Taurus AI';
pres.title = 'Weights & Biases for MLOps';

// Slide 1: Title Slide
let slide = pres.addSlide();
slide.addText('Weights & Biases (W&B)', { x: 0.5, y: 1, w: 9, h: 2, fontSize: 48, color: '2E86C1', align: 'center' });
slide.addText('ML Experiment Tracking & MLOps Platform', { x: 0.5, y: 3, w: 9, h: 1, fontSize: 24, color: '5D6D7E', align: 'center' });
slide.addText('DevOps Integration for ML Workflows', { x: 0.5, y: 4, w: 9, h: 1, fontSize: 20, color: '85929E', align: 'center' });
slide.addText('Taurus AI Corp', { x: 0.5, y: 5, w: 9, h: 1, fontSize: 16, color: 'A8B0A7', align: 'center' });

// Slide 2: Why W&B?
slide = pres.addSlide();
slide.addText('Why Weights & Biases?', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: '• Track ML experiments with automatic logging
' },
  { text: '• Visualize training in real-time dashboards
' },
  { text: '• Compare runs across hyperparameters and configurations
' },
  { text: '• Optimize hyperparameters with automated sweeps
' },
  { text: '• Manage model registry with versioning and lineage
' },
  { text: '• Collaborate on ML projects with team workspaces
' },
  { text: '• Track artifacts (datasets, models, code) with lineage
' }
], { x: 0.5, y: 1.5, w: 9, h: 4, fontSize: 18, color: '2D3436' });

// Slide 3: Core Concepts
slide = pres.addSlide();
slide.addText('Core Concepts', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: 'Projects and Runs
' },
  { text: '• Project: Collection of related experiments
' },
  { text: '• Run: Single execution of training script
' }
], { x: 0.5, y: 1.5, w: 4, h: 2, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Configuration Tracking
' },
  { text: '• Track hyperparameters automatically
' },
  { text: '• Access config during training
' }
], { x: 0.5, y: 3.5, w: 4, h: 2, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Metric Logging
' },
  { text: '• Log scalars, media, histograms, tables
' },
  { text: '• Custom x-axis and step logging
' }
], { x: 5, y: 1.5, w: 4, h: 2, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Model Checkpointing
' },
  { text: '• Save and upload model checkpoints
' },
  { text: '• Use Artifacts for versioning
' }
], { x: 5, y: 3.5, w: 4, h: 2, fontSize: 18, color: '2D3436' });

// Slide 4: Hyperparameter Sweeps
slide = pres.addSlide();
slide.addText('Hyperparameter Sweeps', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: 'Automatically search for optimal hyperparameters
' }
], { x: 0.5, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: '2D3436', italic: true });
slide.addText([
  { text: 'Define sweep configuration:
' },
  { text: '• Method: bayes, grid, random
' },
  { text: '• Metric to optimize (e.g., val/accuracy)
' },
  { text: '• Parameter distributions
' }
], { x: 0.5, y: 2.5, w: 4, h: 2, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Training function uses wandb.config
' },
  { text: '• Access sweep parameters
' },
  { text: '• Build model and optimizer
' }
], { x: 0.5, y: 4.5, w: 4, h: 1.5, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Run agent:
' },
  { text: 'wandb.agent(sweep_id, function=train, count=50)
' }
], { x: 5, y: 2.5, w: 4, h: 2, fontSize: 18, color: '2D3436' });

// Slide 5: Artifacts
slide = pres.addSlide();
slide.addText('Artifacts & Model Registry', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: 'Track datasets, models, and other files with lineage
' }
], { x: 0.5, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: '2D3436', italic: true });
slide.addText([
  { text: 'Log Artifacts
' },
  { text: '• Create artifact with name, type, description
' },
  { text: '• Add files or directories
' },
  { text: '• Log artifact to W&B
' }
], { x: 0.5, y: 2.5, w: 4, h: 2.5, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Use Artifacts
' },
  { text: '• Download and use artifact in another run
' },
  { text: '• Model registry: link artifacts to production
' }
], { x: 5, y: 2.5, w: 4, h: 2.5, fontSize: 18, color: '2D3436' });

// Slide 6: Integrations
slide = pres.addSlide();
slide.addText('Framework Integrations', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: 'PyTorch Lightning
' },
  { text: '• WandbLogger for automatic logging
' },
  { text: '• Log model checkpoints
' }
], { x: 0.5, y: 1.5, w: 4, h: 1.5, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'HuggingFace Transformers
' },
  { text: '• Set report_to="wandb" in TrainingArguments
' },
  { text: '• Trainer automatically logs to W&B
' }
], { x: 0.5, y: 3.5, w: 4, h: 1.5, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Keras/TensorFlow
' },
  { text: '• WandbCallback for auto-logging metrics
' },
  { text: '• Log model and training visualizations
' }
], { x: 5, y: 1.5, w: 4, h: 1.5, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Custom Logging
' },
  { text: '• Log custom visualizations (matplotlib, seaborn)
' },
  { text: '• Log confusion matrices, ROC curves, etc.
' }
], { x: 5, y: 3.5, w: 4, h: 1.5, fontSize: 18, color: '2D3436' });

// Slide 7: Best Practices
slide = pres.addSlide();
slide.addText('Best Practices', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: '• Organize with tags, groups, and job types
' },
  { text: '• Log everything relevant (system metrics, git commit, data splits)
' },
  { text: '• Use descriptive run names
' },
  { text: '• Save important artifacts (final model, predictions)
' },
  { text: '• Use offline mode for unstable connections
' }
], { x: 0.5, y: 1.5, w: 9, h: 3, fontSize: 18, color: '2D3436' });

// Slide 8: Taurus AI Use Case
slide = pres.addSlide();
slide.addText('Taurus AI Use Case: Muthoot Micro-Loan AI Agent', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '2E86C1', bold: true });
slide.addText([
  { text: 'Fine-tune Ollama qwen3-coder:latest on synthetic repayment patterns
' }
], { x: 0.5, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: '2D3436', italic: true });
slide.addText([
  { text: 'Track with W&B:
' },
  { text: '• Hyperparameters: learning rate, batch size, epochs
' },
  { text: '• Metrics: prediction accuracy, reminder effectiveness
' },
  { text: '• Artifacts: datasets, model checkpoints, evaluation results
' },
  { text: '• Sweeps: Optimize for >15% reduction in collection calls
' }
], { x: 0.5, y: 2.5, w: 9, h: 2.5, fontSize: 18, color: '2D3436' });

// Slide 9: Conclusion
slide = pres.addSlide();
slide.addText('Conclusion', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 32, color: '2E86C1', bold: true });
slide.addText([
  { text: 'Weights & Biases provides:
' },
  { text: '• End-to-end ML experiment tracking
' },
  { text: '• Collaboration and reproducibility
' },
  { text: '• Integration with popular ML frameworks
' },
  { text: '• DevOps-friendly API and automation
' }
], { x: 0.5, y: 1.5, w: 9, h: 2, fontSize: 18, color: '2D3436' });
slide.addText([
  { text: 'Empowers Taurus AI to:
' },
  { text: '• Accelerate ML model development
' },
  { text: '• Ensure compliance and auditability
' },
  { text: '• Deliver better AI solutions to clients
' }
], { x: 0.5, y: 4, w: 9, h: 1.5, fontSize: 18, color: '2D3436' });

// Write the presentation
pres.writeFile({ fileName: 'WandB-MLOps-DevOps.pptx' });
