from manim import *


class MuthootMicroLoan(Scene):
    def construct(self):
        # Scene 1: Title
        title = Text("Taurus AI x Muthoot FinCorp")
        subtitle = Text("Micro-Loan Repayment AI Agent")
        title.scale(1.5)
        subtitle.scale(1)
        title.shift(UP*2)
        subtitle.shift(UP*1)
        self.play(Write(title), Write(subtitle))
        self.wait(2)

        # Scene 2: Micro-Loan Pain Points
        pain_title = Text("Micro-Loan Challenges")
        pain_title.scale(1.2)
        pain_title.shift(UP*2)

        challenges = VGroup(
            Text("High Default Rates"),
            Text("Manual Processing"),
            Text("Limited Risk Assessment")
        )

        for i, challenge in enumerate(challenges):
            challenge.shift(DOWN*1.5 + LEFT*3 + RIGHT*i*2)

        self.play(FadeOut(title), FadeOut(subtitle))
        self.play(Write(pain_title))
        self.play(Write(challenges))
        self.wait(2)

        # Scene 3: AI Agent Solution
        solution_title = Text("AI Agent Solution")
        solution_title.scale(1.2)
        solution_title.shift(UP*2)

        components = VGroup(
            Text("Application Processing"),
            Text("Risk Assessment"),
            Text("Repayment Scheduling")
        )

        for i, comp in enumerate(components):
            comp.shift(DOWN*1.5 + LEFT*3 + RIGHT*i*2)

        self.play(FadeOut(pain_title), FadeOut(challenges))
        self.play(Write(solution_title))
        self.play(Write(components))
        self.wait(2)

        # Scene 4: Business Benefits
        benefits_title = Text("Business Benefits")
        benefits_title.scale(1.2)
        benefits_title.shift(UP*2)

        benefits = VGroup(
            Text("Reduced Defaults"),
            Text("Faster Processing"),
            Text("Better Risk Management")
        )

        for i, benefit in enumerate(benefits):
            benefit.shift(DOWN*1.5 + LEFT*3 + RIGHT*i*2)

        self.play(FadeOut(solution_title), FadeOut(components))
        self.play(Write(benefits_title))
        self.play(Write(benefits))
        self.wait(2)

        # Scene 5: Call to Action
        cta = Text("Let's Transform Micro-Finance")
        cta.scale(1.5)
        cta.shift(UP*1)

        contact = Text("Contact: muthoot@taurus.ai")
        contact.scale(1)
        contact.shift(DOWN*1)

        self.play(FadeOut(benefits_title), FadeOut(benefits))
        self.play(Write(cta), Write(contact))
        self.wait(3)

        self.play(FadeOut(cta), FadeOut(contact))
        self.wait(1)
