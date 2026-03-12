import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const categories = ['All', 'Technology', 'Business', 'Finance', 'Health', 'World', 'Sports', 'Entertainment'];

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  author?: string;
  created_at: string;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data) setArticles(data as NewsArticle[]);
      if (error) console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breakingNews = filteredArticles.slice(0, 2);
  const trendingNews = filteredArticles.slice(2);

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading news...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News</h1>
        <Button variant="outline" size="sm">
          <Bookmark className="h-4 w-4 mr-2" />
          Saved
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search news..." 
          className="pl-10 h-10 ring-offset-background focus-visible:ring-brand"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Button 
            key={cat} 
            variant={activeCategory === cat ? 'brand' : 'outline'} 
            size="sm" 
            className="flex-shrink-0"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {breakingNews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="animate-pulse">BREAKING</Badge>
            <span className="text-sm font-semibold">Latest Updates</span>
          </div>
          {breakingNews.map((news) => (
            <Card key={news.id} className="glass-card border-l-4 border-l-red-500 cursor-pointer hover:bg-secondary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-xs">{news.category}</Badge>
                    <h3 className="font-semibold leading-tight">{news.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <span>{news.author || 'Editorial Team'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(news.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {news.image_url ? (
                    <img src={news.image_url} alt="" className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-16 bg-secondary/50 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {trendingNews.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gs-coral" />
            <span className="text-lg font-semibold">Trending</span>
          </div>
          <div className="space-y-3">
            {trendingNews.map((news, i) => (
              <Card key={news.id} className="glass-card cursor-pointer hover:bg-secondary/50 transition-colors">
                <CardContent className="p-4 flex gap-4">
                  <span className="text-2xl font-bold text-muted-foreground/30 w-8">{i + 3}</span>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1 text-xs">{news.category}</Badge>
                    <h3 className="font-medium text-sm leading-tight line-clamp-2">{news.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{news.author || 'Guidesoft News'}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(news.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        !loading && breakingNews.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-secondary/10">
            <p className="text-muted-foreground">No news articles found matching your criteria.</p>
          </div>
        )
      )}
    </div>
  );
}
