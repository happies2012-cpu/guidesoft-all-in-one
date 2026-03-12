import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Users, Eye, Heart, 
  MessageCircle, Share2, Calendar, Download, ArrowUpRight
} from 'lucide-react';

const overviewStats = [
  { label: 'Total Views', value: '125.4K', change: '+12.5%', trend: 'up' },
  { label: 'Followers', value: '8,942', change: '+5.2%', trend: 'up' },
  { label: 'Engagement Rate', value: '4.8%', change: '-0.3%', trend: 'down' },
  { label: 'Posts', value: '156', change: '+8', trend: 'up' },
];

const topPosts = [
  { id: 1, title: 'Launching my new project...', likes: 1234, comments: 89, shares: 45, views: 12500 },
  { id: 2, title: 'Quick productivity tip...', likes: 892, comments: 56, shares: 23, views: 8900 },
  { id: 3, title: 'Behind the scenes of...', likes: 567, comments: 34, shares: 12, views: 5600 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-bold">{stat.value}</span>
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className={stat.trend === 'up' ? 'bg-gs-green/20 text-gs-green' : 'bg-red-500/20 text-red-500'}
                >
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-secondary/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization</p>
              <p className="text-xs">Showing views, likes, comments trend</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Top Performing Posts</h2>
        <div className="space-y-3">
          {topPosts.map((post, i) => (
            <Card key={post.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-muted-foreground w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium truncate">{post.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3.5 w-3.5" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Audience Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Audience Demographics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-3">Age Distribution</p>
            <div className="space-y-2">
              {[
                { age: '18-24', pct: 35 },
                { age: '25-34', pct: 42 },
                { age: '35-44', pct: 15 },
                { age: '45+', pct: 8 },
              ].map((item) => (
                <div key={item.age} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">{item.age}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gs-cyan to-gs-purple rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Top Locations</p>
            <div className="space-y-2">
              {[
                { country: 'India', pct: 45 },
                { country: 'United States', pct: 25 },
                { country: 'United Kingdom', pct: 12 },
                { country: 'Canada', pct: 8 },
              ].map((item) => (
                <div key={item.country} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex-1 truncate">{item.country}</span>
                  <span className="text-xs font-medium">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
