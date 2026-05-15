import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router';
import { Music, Scan, BarChart3, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Music className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Music Funnel AI
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Find broken creator funnels automatically. Discover high-value leads
          with broken Instagram links, missing Linktrees, and inactive accounts.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              <Scan className="h-4 w-4" />
              Open Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Scan className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Automated Scanning</CardTitle>
              <CardDescription>
                Automatically scan and discover music creators with broken funnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our system continuously scans for creators with broken Instagram links,
                missing Linktrees, and inactive accounts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Lead Scoring</CardTitle>
              <CardDescription>
                AI-powered lead scoring to prioritize your outreach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each lead is scored based on multiple factors including subscriber count,
                broken links, and activity status.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Tier Classification</CardTitle>
              <CardDescription>
                Leads classified into COLD, WARM, and HOT tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Focus on HOT leads with the highest conversion potential and broken
                funnels that need your services.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
