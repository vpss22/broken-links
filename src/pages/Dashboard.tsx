import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Lead } from '@/types';
import { ArrowLeft, RefreshCw, Users, Instagram, Link2, Activity } from 'lucide-react';
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

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/scan`);
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
          <Button
            onClick={fetchLeads}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
          <h2 className="text-xl font-semibold">Scanned Leads</h2>

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
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{lead.name}</CardTitle>
                      <Badge variant={getTierColor(lead.score.tier)}>
                        {lead.score.tier}
                      </Badge>
                    </div>
                    <CardDescription>
                      Score: {lead.score.score} / 8
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Instagram:{" "}
                          <Badge
                            variant={
                              lead.instagram_status === '404'
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {lead.instagram_status}
                          </Badge>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Linktree:{" "}
                          {lead.linktree ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="destructive">Missing</Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Status:{" "}
                          {lead.inactive ? (
                            <Badge variant="secondary">Inactive</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Subscribers:{" "}
                          <Badge variant="outline">
                            {lead.subscribers.toLocaleString()}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
