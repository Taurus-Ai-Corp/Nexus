# QuantumGate PQC Assessment Manim Video Plan

## Narrative Arc
Show how Taurus AI's PQC Assessment Engine complements QuantumGate's CDT to solve UAE's urgent PQC compliance mandate.

### Misconception to Correct
"That quantum computing threats are distant future problems requiring expensive, complex overhauls."

### Aha Moment
"Organizations can achieve regulator-ready PQC compliance today using open-source tools with zero licensing friction, producing auditable evidence acceptable to UAE authorities."

## Scene List

### Scene 1: Title & Hook (15 seconds)
- Background: Dark blue (#1C1C1C)
- Title: "UAE's PQC Compliance Deadline: 2026"
- Subtitle: "Quantum threats are nearer than you think"
- Visual: Countdown timer from 2026 to today
- Voiceover: "By end-2026, all UAE financial entities must submit post-quantum cryptography migration plans. The clock is ticking."

### Scene 2: The Quantum Threat (20 seconds)
- Split screen:
  - Left: Classical computer trying to break RSA (shows many attempts, slow)
  - Right: Quantum computer using Shor's algorithm (shows quick solution)
- Equation: RSA breaking time: Classical ~billions of years vs Quantum ~hours
- Visual: Shor's algorithm finding period in modular exponentiation
- Voiceover: "While classical computers struggle to break RSA-2048, quantum computers using Shor's algorithm can do it in hours - not years."

### Scene 3: Current Crypto Inventory (20 seconds)
- Show a financial institution's crypto asset inventory
- Highlight vulnerable algorithms in red: RSA, ECDSA, DH, DSA
- Show quantum-safe in green: AES-256, SHA-256 (with Grover's caveat)
- Visual: Pie chart showing % of vulnerable vs quantum-safe assets
- Voiceover: "Most financial institutions today rely heavily on algorithms vulnerable to quantum attack - creating an urgent compliance gap."

### Scene 4: UAE Regulatory Requirements (15 seconds)
- Show UAE IA V2 and National Encryption Policy 2025 documents
- Highlight Kyber and Dilithium as recommended PQC algorithms
- Show ADGM/DFSA logos with "Migration Plan Required" stamps
- Voiceover: "UAE IA V2 and National Encryption Policy 2025 mandate Kyber for key exchange and Dilithium for signatures - with regulator-ready evidence required."

### Scene 5: Taurus AI PQC Assessment Engine (25 seconds)
- Show architecture diagram:
  - Input: Cryptographic Asset Inventory (JSON/CSV)
  - Engine: @taurus/pqc-crypto library (Kyber/Dilithium implementations)
  - Analysis: Gap assessment against IA V2 requirements
  - Output: 
    - PDF Gap Analysis Report
    - Heiro LF-anchored audit trail
    - Migration roadmap
- Visual: Data flowing through the system with annotations
- Voiceover: "Taurus AI's PQC Assessment Engine uses open-source @taurus/pqc-crypto to inventory assets, analyze gaps against IA V2, and generate regulator-ready reports with Heiro LF audit trails - all deployable via Docker with zero licensing friction."

### Scene 6: Integration with QuantumGate CDT (20 seconds)
- Show QuantumGate CDT dashboard/components
- Show Taurus PQC module as a complementary tab/widget
- Show data flow: CDT threat intel + PQC assessment = comprehensive crypto risk view
- Visual: Split view showing CDT monitoring PQC assessment results
- Voiceover: "As a complementary module to QuantumGate's Cybersecurity Defense Toolkit, our PQC Assessment Engine adds formal migration evidence to CDT's threat monitoring - creating a complete quantum-risk management solution."

### Scene 7: Pilot Results & Call to Action (20 seconds)
- Show before/after: Vulnerable assets → PQC-ready migration plan
- Show sample regulator-acceptable PDF report
- Show Heiro LF verification screen
- Show testimonial quote placeholder
- Voiceover: "Pilot with 2-3 ADGM/DIFC fintechs proves our reports meet regulator requirements. Let's discuss how we can help QuantumGate's clients achieve PQC compliance today - not tomorrow."

### Scene 8: Closing (10 seconds)
- Logos: Taurus AI (Nexus) + QuantumGate + ATRC
- Text: "Accelerating UAE's Quantum-Secure Future"
- Contact: partnership@taurus.ai
- Voiceover: "Together, we can ensure UAE's financial sector is quantum-ready well before the 2026 deadline."

## Visual Style
- Color Palette: Neon tech (#0A0A0A background, #00F5FF primary, #FF00FF secondary, #39FF14 accent)
- Font: Menlo (monospace for all text)
- Animation Speed: Moderate - allow time for technical concepts to sink in
- Key Principle: Show before telling - visualize the quantum threat before explaining it

## Technical Notes
- Use Manim's ThreeDScene for quantum computer visualization
- Use ValueTracker for animated countdown timer
- Use Graph/axes for crypto inventory visualization
- Use Tex/MathTex for equations (with raw strings)
- Use Arrow/Curve for data flow animations