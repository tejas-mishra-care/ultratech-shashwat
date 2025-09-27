import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Simple, clean hero section */}
      <section className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Ready to Build
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Your clean, empty repository is ready. Start building something amazing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Simple feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <Card className="border border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Clean Setup</h3>
              <p className="text-sm text-muted-foreground">
                Modern stack with TypeScript, React, and Tailwind CSS
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Ready to Scale</h3>
              <p className="text-sm text-muted-foreground">
                Built with best practices and scalable architecture
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 hover:border-border transition-colors">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Your Vision</h3>
              <p className="text-sm text-muted-foreground">
                Start with a clean slate and build exactly what you need
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Index;