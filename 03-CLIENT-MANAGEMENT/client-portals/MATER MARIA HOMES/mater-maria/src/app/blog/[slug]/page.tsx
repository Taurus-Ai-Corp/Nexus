import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { MotionDiv } from "@/components/ui/motion";
import { BLOG_POSTS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Static Params                                                      */
/* ------------------------------------------------------------------ */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/* ------------------------------------------------------------------ */
/*  Dynamic Metadata                                                   */
/* ------------------------------------------------------------------ */
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

/* ------------------------------------------------------------------ */
/*  Placeholder article bodies                                         */
/* ------------------------------------------------------------------ */
const ARTICLE_BODIES: Record<string, string[]> = {
  "why-kottayam-best-retirement": [
    "Kottayam, often called the 'Land of Letters, Latex and Lakes', has quietly emerged as one of Kerala's most sought-after retirement destinations. Nestled between the Western Ghats and the backwaters, this district offers retirees an unmatched combination of natural beauty, cultural richness, and modern infrastructure.",
    "The healthcare ecosystem in Kottayam is particularly noteworthy. With several multi-specialty hospitals, medical colleges, and Ayurvedic treatment centers within easy reach, seniors have access to world-class medical care. The region's temperate climate — cooler than coastal Kerala yet warmer than the hill stations — creates an ideal environment for year-round comfortable living.",
    "Beyond healthcare, Kottayam boasts a vibrant cultural scene. The district has one of the highest literacy rates in India and a rich tradition of publishing, arts, and community gatherings. For retirees, this translates to an intellectually stimulating environment with book clubs, cultural festivals, temple and church communities, and a population that values education and thoughtful conversation. Add to this the proximity to Kumarakom's backwaters, Vagamon's hills, and Periyar's wildlife sanctuary, and you have a retirement destination that truly has it all.",
  ],
  "nri-guide-senior-living": [
    "For NRI families scattered across the Gulf, Europe, and North America, securing a comfortable and safe living arrangement for aging parents back in Kerala is one of the most pressing concerns. The traditional joint family system, while still cherished, faces practical challenges when children live thousands of miles away. Premium senior living communities are emerging as the modern solution — offering professional care, vibrant social life, and the peace of mind that only comes from knowing your loved ones are well looked after.",
    "When evaluating senior living options in Kerala, NRI families should consider several key factors: regulatory compliance (ensuring the project is legally sound and well-governed), healthcare infrastructure (24/7 nursing, emergency protocols, hospital tie-ups), community culture (activities, social engagement, spiritual support), and financial transparency. Payment structures typically include an upfront investment for the residence plus a monthly maintenance fee covering services, meals, and amenity access.",
    "From a financial standpoint, investing in Kerala senior living offers several advantages for NRIs. Properties can be purchased through NRE or NRO accounts, and many developers offer flexible payment plans. The tax implications are generally favorable, with potential benefits under the Income Tax Act for property ownership. Most importantly, the investment serves a dual purpose — it provides immediate housing for your parents while also being a tangible real estate asset that appreciates over time. We recommend consulting with a CA familiar with NRI taxation before making your decision.",
  ],
  "ayurveda-active-aging": [
    "Ayurveda, the 5,000-year-old science of life that originated in Kerala, offers a uniquely holistic approach to aging. Unlike Western medicine's focus on treating symptoms, Ayurveda emphasizes prevention, balance, and the nurturing of the body's innate intelligence. For seniors, this ancient system provides practical daily routines, dietary guidelines, and therapeutic treatments that can dramatically improve quality of life.",
    "Central to Ayurvedic aging well is the concept of 'Dinacharya' — daily routine. This includes rising with the sun, oil massage (Abhyanga), gentle yoga, meditation, and eating freshly prepared meals at consistent times. At Mater Maria, we've integrated these principles into our daily programming. Our Ayurvedic spa offers treatments like Shirodhara (warm oil poured over the forehead for mental clarity), Pizhichil (oil bath for joint health), and Njavarakizhi (rice bolus massage for vitality) — all administered by experienced practitioners.",
    "The integration of Ayurveda with modern medicine creates what we call 'Integrative Senior Wellness.' Our residents benefit from regular health check-ups with both allopathic and Ayurvedic doctors. Dietary plans are personalized based on each resident's Prakriti (constitution) and current health conditions. Herbal supplements, when appropriate, complement conventional medications. This isn't about choosing one system over another — it's about harnessing the best of both worlds to help our residents live with vitality, mental clarity, and a deep sense of well-being in their golden years.",
  ],
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = ARTICLE_BODIES[slug] ?? [
    "This article is coming soon. Check back for the full content.",
    "In the meantime, explore our other blog posts for insights on senior living, Kerala lifestyle, and wellness.",
    "If you have specific questions, don't hesitate to reach out to our team through the contact page.",
  ];

  return (
    <main id="main-content" className="pb-24 pt-32">
      <Container size="md">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/" className="transition-colors hover:text-accent-default">Home</Link>
          <ChevronRight className="size-4" />
          <Link href="/blog" className="transition-colors hover:text-accent-default">Blog</Link>
          <ChevronRight className="size-4" />
          <span className="line-clamp-1 font-medium text-text-primary">{post.title}</span>
        </nav>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Badge className="mb-4 bg-accent-default/15 text-accent-default border-accent-default/30">
            {post.category}
          </Badge>

          <h1 className="font-heading mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {post.title}
          </h1>

          <div className="mb-8 flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {new Date(post.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {post.readTime}
            </span>
          </div>

          {/* Separator */}
          <div className="mb-8 h-px bg-border-default" />

          {/* Article body */}
          <article className="prose-custom space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-text-secondary">
                {p}
              </p>
            ))}
          </article>

          {/* Back link */}
          <div className="mt-12 border-t border-border-default pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-default transition-colors hover:text-accent-dark"
            >
              <ArrowLeft className="size-4" />
              Back to all posts
            </Link>
          </div>
        </MotionDiv>
      </Container>
    </main>
  );
}
