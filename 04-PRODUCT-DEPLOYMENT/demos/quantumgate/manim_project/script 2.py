from manim import *


class QuantumGatePQC(Scene):
    def construct(self):
        # Scene 1: Title
        title = Text("QuantumGate Partnership Opportunity")
        subtitle = Text("Taurus AI PQC Assessment Engine")
        title.scale(1.5)
        subtitle.scale(1)
        title.shift(UP*2)
        subtitle.shift(UP*1)
        self.play(Write(title), Write(subtitle))
        self.wait(2)

        # Scene 2: Quantum Threat
        threat_title = Text("The Quantum Threat")
        threat_title.scale(1.2)
        threat_title.shift(UP*2)

        classical = Text("Classical Crypto")
        quantum = Text("Quantum Computers")
        broken = Text("Vulnerable")

        classical.shift(LEFT*3)
        quantum.shift(RIGHT*3)
        broken.shift(DOWN*2)

        self.play(FadeOut(title), FadeOut(subtitle))
        self.play(Write(threat_title))
        self.play(Write(classical), Write(quantum))
        self.wait(1)

        arrow = Arrow(classical.get_right(), quantum.get_left())
        self.play(Create(arrow))
        self.wait(1)

        self.play(Write(broken))
        self.wait(2)

        # Scene 3: PQC Solution
        solution_title = Text("PQC Assessment Engine")
        solution_title.scale(1.2)
        solution_title.shift(UP*2)

        components = VGroup(
            Text("Algorithm Detection"),
            Text("Risk Assessment"),
            Text("Migration Planning")
        )

        for i, comp in enumerate(components):
            comp.shift(DOWN*1.5 + LEFT*3 + RIGHT*i*2)

        self.play(FadeOut(threat_title), FadeOut(classical), FadeOut(quantum), FadeOut(arrow), FadeOut(broken))
        self.play(Write(solution_title))
        self.play(Write(components))
        self.wait(2)

        # Scene 4: Partnership Benefits
        benefits_title = Text("Partnership Benefits")
        benefits_title.scale(1.2)
        benefits_title.shift(UP*2)

        benefits = VGroup(
            Text("Market Leadership"),
            Text("Revenue Growth"),
            Text("Technical Excellence")
        )

        for i, benefit in enumerate(benefits):
            benefit.shift(DOWN*1.5 + LEFT*3 + RIGHT*i*2)

        self.play(FadeOut(solution_title), FadeOut(components))
        self.play(Write(benefits_title))
        self.play(Write(benefits))
        self.wait(2)

        # Scene 5: Call to Action
        cta = Text("Let's Secure the Future Together")
        cta.scale(1.5)
        cta.shift(UP*1)

        contact = Text("Contact: quantum@taurus.ai")
        contact.scale(1)
        contact.shift(DOWN*1)

        self.play(FadeOut(benefits_title), FadeOut(benefits))
        self.play(Write(cta), Write(contact))
        self.wait(3)

        self.play(FadeOut(cta), FadeOut(contact))
        self.wait(1)
