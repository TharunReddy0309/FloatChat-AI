import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight } from "lucide-react";

export default function DevelopmentRoadmap() {
  const roadmapPhases = [
    { phase: "PoC", status: "current", title: "Interactive Demo", description: "Map + Chat + Visualizations" },
    { phase: "MVP", status: "next", title: "Full AI Integration", description: "LLM-powered queries + Exports" },
    { phase: "Beta", status: "future", title: "Production Ready", description: "Containerized + Scalable" }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Roadmap</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our structured approach to building a comprehensive oceanographic data platform for the SIH 2025 competition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roadmapPhases.map((phase, index) => (
            <Card key={index} className={`hover-elevate ${phase.status === 'current' ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant={phase.status === 'current' ? 'default' : phase.status === 'next' ? 'secondary' : 'outline'}
                  >
                    {phase.phase}
                  </Badge>
                  {phase.status === 'current' && (
                    <Badge variant="outline" className="text-primary border-primary">
                      <Zap className="h-3 w-3 mr-1" />
                      Current
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{phase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{phase.description}</p>
                {phase.status === 'current' && (
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      View Demo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
