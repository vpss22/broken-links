import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Lead, ScanConfig } from '@/types';
import { ArrowLeft, RefreshCw, Users, Instagram, Link2, Activity, Settings, Brain, Info, Save } from 'lucide-react';
import { Link } from 'react-router';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getTierColor(tier: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (tier) {
    case 'HOT':
      return 'destructive';
    case 'WARM':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ScanConfig>(() => {
    const saved = localStorage.getItem('scan_config');
    return saved ? JSON.parse(saved) : {
      mode: 'manual',
      model: 'gpt-4o-mini',
      apiKey: ''
    };
  });

  const saveConfig = () => {
    localStorage.setItem('scan_config', JSON.stringify(config));
  };

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (config.mode === 'ai' && config.apiKey) {
        headers['X-API-Key'] = config.apiKey;
      }

      const response = await fetch(`${API_BASE}/api/scan?mode=${config.mode}&model=${config.model}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
      }
      const data = (await response.json()) as Lead[];
      setLeads(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const hotCount = leads.filter((l) => l.score.tier === 'HOT').length;
  const warmCount = leads.filter((l) => l.score.tier === 'WARM').length;
  const coldCount = leads.filter((l) => l.score.tier === 'COLD').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Lead Scanner Results
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchLeads}
              disabled={loading}
              variant="default"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Run Scan ({config.mode.toUpperCase()})
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList>
            <TabsTrigger value="results" className="gap-2">
              <Activity className="h-4 w-4" /> Results
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <Info className="h-4 w-4" /> Manual Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Leads</CardDescription>
                  <CardTitle className="text-3xl">{leads.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>HOT Leads</CardDescription>
                  <CardTitle className="text-3xl text-destructive">{hotCount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Activity className="h-4 w-4 text-destructive" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>WARM Leads</CardDescription>
                  <CardTitle className="text-3xl text-secondary-foreground">{warmCount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>COLD Leads</CardDescription>
                  <CardTitle className="text-3xl">{coldCount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Leads List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Scanned Leads</h2>
                <Badge variant="outline" className="gap-1">
                  {config.mode === 'ai' ? <Brain className="h-3 w-3" /> : <Settings className="h-3 w-3" />}
                  {config.mode === 'ai' ? 'AI Powered' : 'Manual Mode'}
                </Badge>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : leads.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No leads found. Click refresh to scan.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>{lead.name}</CardTitle>
                          <Badge variant={getTierColor(lead.score.tier)}>
                            {lead.score.tier}
                          </Badge>
                        </div>
                        <CardDescription>
                          Heuristic Score: {lead.score.score} / 8
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Instagram className="h-4 w-4 text-muted-foreground" />
                              <span>Insta: <Badge variant={lead.instagram_status === '404' ? 'destructive' : 'default'}>{lead.instagram_status}</Badge></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link2 className="h-4 w-4 text-muted-foreground" />
                              <span>Linktree: {lead.linktree ? '✅' : '❌'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-muted-foreground" />
                              <span>Status: {lead.inactive ? 'Inactive' : 'Active'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>Subs: {lead.subscribers.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {lead.score.ai_insight && (
                            <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
                              <div className="flex items-center gap-2 mb-1">
                                <Brain className="h-3.5 w-3.5 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Insight</span>
                              </div>
                              <p className="text-sm italic text-muted-foreground">"{lead.score.ai_insight}"</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Scan Configuration</CardTitle>
                <CardDescription>Configure how your leads are scanned and analyzed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label>AI Powered Analysis</Label>
                    <p className="text-sm text-muted-foreground">Use Large Language Models to provide insights on leads.</p>
                  </div>
                  <Switch 
                    checked={config.mode === 'ai'} 
                    onCheckedChange={(checked) => setConfig({ ...config, mode: checked ? 'ai' : 'manual' })}
                  />
                </div>
                
                <Separator />

                {config.mode === 'ai' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">OpenAI API Key</Label>
                      <Input 
                        id="api-key" 
                        type="password" 
                        placeholder="sk-..." 
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Your API key is stored locally in your browser.</p>
                    </div>

                    <div className="space-y-2">
                      <Label>AI Model</Label>
                      <Select 
                        value={config.model} 
                        onValueChange={(val) => setConfig({ ...config, model: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini (Recommended)</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o (High Quality)</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button onClick={saveConfig} className="gap-2">
                    <Save className="h-4 w-4" /> Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Manual Scanning Guide</CardTitle>
                <CardDescription>The best free approach to finding broken funnels manually.</CardDescription>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold">1. Search Strategy</h3>
                <p className="text-sm text-muted-foreground">Use Google "Dorks" to find specific patterns in bio links:</p>
                <ul className="text-sm list-disc pl-5 space-y-2">
                  <li><code>site:instagram.com "linktr.ee" "music"</code> - Find musicians using Linktree</li>
                  <li><code>site:instagram.com "biolink" "producer"</code> - Find producers</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">2. The "404" Hunt</h3>
                <p className="text-sm text-muted-foreground">Identify broken funnels by looking for these red flags:</p>
                <ul className="text-sm list-disc pl-5 space-y-2">
                  <li><strong>Broken Bio Link:</strong> Links that lead to parked domains or 404 pages.</li>
                  <li><strong>Dead Linktree:</strong> Accounts where the Linktree profile exists but all buttons are broken.</li>
                  <li><strong>Old Campaign:</strong> Links still pointing to a 2022 release.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">3. Scaling for Free</h3>
                <p className="text-sm text-muted-foreground">Use browser extensions like "Link Checker" or "Check My Links" to quickly scan an artist's landing page for dead ends without needing a paid API.</p>
                
                <div className="mt-6 p-4 bg-muted rounded-md border">
                  <h4 className="font-bold flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Pro Tip</h4>
                  <p className="text-xs mt-1">Focus on artists with 10k-50k followers. They have enough budget to pay for a funnel fix but often don't have a manager checking their links daily.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
