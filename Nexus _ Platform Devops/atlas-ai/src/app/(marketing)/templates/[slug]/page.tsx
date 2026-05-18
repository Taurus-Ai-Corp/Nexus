import { useParams } from "next/navigation";

export function generateStaticParams() {
  return [
    { slug: 'smart-lead-follow-up-system' },
    { slug: 'ai-viral-news-scraper' },
    { slug: 'ecommerce-chatbot' },
    { slug: 'cross-platform-publishing-bot' },
  ];
}

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="p-12 text-white">
      Template Detail: {params.slug}
    </div>
  );
}