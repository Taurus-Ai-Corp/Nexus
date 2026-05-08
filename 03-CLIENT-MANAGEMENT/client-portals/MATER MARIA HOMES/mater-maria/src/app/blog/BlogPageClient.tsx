"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { VideoHeroSection } from "@/components/ui/video-hero-section";
import { VideoBreak } from "@/components/ui/video-break";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { BLOG_POSTS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Client Component                                                   */
/* ------------------------------------------------------------------ */
export function BlogPageClient() {
  const gridRef = useGsapReveal("[data-gsap-card]", {
    y: 60,
    stagger: 0.15,
    duration: 0.8,
  });

  const firstThree = BLOG_POSTS.slice(0, 3);
  const rest = BLOG_POSTS.slice(3);

  return (
    <main id="main-content">
      {/* Video Hero */}
      <VideoHeroSection
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="STORIES"
      >
        <Container size="lg" className="pb-20 pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Blog</span>
          </nav>
          <SectionHeading
            badge="Insights"
            title="From Our Blog"
            subtitle="Stories, guides, and perspectives on sustainable community living, Kerala lifestyle, and holistic wellness."
          />
        </Container>
      </VideoHeroSection>

      {/* First 3 Blog Cards */}
      <section className="py-16" ref={gridRef as React.RefObject<HTMLElement>}>
        <Container size="lg">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {firstThree.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>

      {/* Video Break */}
      <VideoBreak
        videoSrc="/assets-2025/videos/villa-showcase.mp4"
        watermarkText="LIVING REFINED"
      />

      {/* Remaining Blog Cards */}
      {rest.length > 0 && (
        <section className="py-16 pb-24">
          <Container size="lg">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Blog Card                                                          */
/* ------------------------------------------------------------------ */
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div data-gsap-card>
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="flex h-full flex-col rounded-xl border border-border-default bg-surface p-6 transition-all hover:-translate-y-1 hover:border-border-strong hover:shadow-lg">
          {/* Meta */}
          <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(post.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.readTime}
            </span>
          </div>

          {/* Category badge */}
          <Badge className="mb-3 w-fit bg-accent-default/15 text-accent-default border-accent-default/30">
            {post.category}
          </Badge>

          {/* Title */}
          <h2 className="font-heading mb-3 text-lg font-bold text-text-primary transition-colors group-hover:text-accent-default">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mb-6 flex-1 text-sm leading-relaxed text-text-secondary">
            {post.excerpt}
          </p>

          {/* Read More */}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-default transition-transform group-hover:gap-2">
            Read More <ArrowRight className="size-4" />
          </span>
        </article>
      </Link>
    </div>
  );
}
