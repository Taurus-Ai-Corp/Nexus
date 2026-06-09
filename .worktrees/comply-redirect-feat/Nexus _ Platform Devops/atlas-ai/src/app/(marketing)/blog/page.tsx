import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Atlas AI',
  description: 'Latest news, updates, and insights from the Atlas AI team',
};

export default function BlogPage() {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Introducing Atlas AI: The Future of Marketing Automation',
      excerpt: 'Learn how our new platform is changing the game for marketers everywhere.',
      date: 'August 15, 2025',
      author: 'Alex Chen, CEO',
      category: 'Product',
    },
    {
      id: 2,
      title: '5 Ways AI is Transforming Content Creation',
      excerpt: 'Discover how artificial intelligence is making content creation faster and more effective.',
      date: 'August 10, 2025',
      author: 'Maya Johnson, Content Strategist',
      category: 'Insights',
    },
    {
      id: 3,
      title: 'Case Study: How Company X Increased Conversions by 300%',
      excerpt: 'See the impressive results achieved by one of our early adopters using Atlas AI.',
      date: 'August 5, 2025',
      author: 'Daniel Park, Customer Success',
      category: 'Case Study',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Atlas AI Blog</h1>
        <p className="text-xl text-gray-300 mb-12">
          Insights, updates, and stories from the Atlas AI team
        </p>
        
        <div className="space-y-12">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors duration-200">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-indigo-600/20 text-indigo-400 text-sm font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm ml-4">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{post.author}</span>
                  <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Read more →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}