import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  MapPin, 
  BarChart3, 
  Download, 
  Zap, 
  Database,
  Brain,
  Globe,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function FeatureSections() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Language Queries",
      description: "Ask complex oceanographic questions in plain English and get precise data insights",
      examples: [
        "Show me temperature anomalies in the Arabian Sea",
        "Find floats with salinity greater than 35 PSU",
        "What's the average temperature at 200m depth?"
      ],
      color: "text-chart-1"
    },
    {
      icon: MapPin,
      title: "Interactive Maps",
      description: "Explore Argo float positions with real-time data visualization and spatial analysis",
      examples: [
        "Click on float markers for detailed info",
        "Filter by region, depth, or measurement type",
        "View historical float trajectories"
      ],
      color: "text-chart-2"
    },
    {
      icon: BarChart3,
      title: "Profile Visualizations",
      description: "Beautiful depth profiles showing temperature and salinity changes with ocean depth",
      examples: [
        "Interactive depth vs temperature charts",
        "Salinity gradient visualizations",
        "Multi-float comparison plots"
      ],
      color: "text-chart-3"
    }
  ];

  const techStack = [
    { name: "PostgreSQL + PostGIS", description: "Spatial database for ocean data" },
    { name: "FastAPI", description: "High-performance backend API" },
    { name: "Next.js", description: "Modern React framework" },
    { name: "Leaflet", description: "Interactive mapping library" },
    { name: "ChromaDB", description: "Vector database for AI search" },
    { name: "LLM Integration", description: "Natural language processing" }
  ];

  const roadmapPhases = [
    { phase: "PoC", status: "current", title: "Interactive Demo", description: "Map + Chat + Visualizations" },
    { phase: "MVP", status: "next", title: "Full AI Integration", description: "LLM-powered queries + Exports" },
    { phase: "Beta", status: "future", title: "Production Ready", description: "Containerized + Scalable" }
  ];

  return (
    <div className="space-y-24">
      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Ocean Data Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              FloatChat combines AI-powered natural language processing with beautiful data visualizations to make oceanographic research accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.examples.map((example, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              FloatChat leverages cutting-edge technologies to deliver fast, reliable, and scalable oceanographic data access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              onClick={() => console.log('GitHub repository clicked')}
              data-testid="button-view-github"
            >
              <Globe className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Development Roadmap */}
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

      {/* Sample Data Section */}
      <section id="data" className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sample Oceanographic Data</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download sample Argo float datasets from the Indian Ocean to explore FloatChat's capabilities with real oceanographic measurements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Indian Ocean Dataset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Curated dataset containing 50 Argo floats with temperature and salinity profiles from the Indian Ocean region.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File Format:</span>
                    <span className="font-medium">CSV, NetCDF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date Range:</span>
                    <span className="font-medium">Jan 2024 - Dec 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="font-medium">~12 MB</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => console.log('Download Indian Ocean dataset')}
                  data-testid="button-download-indian-ocean"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Dataset
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  NetCDF Converter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Convert complex NetCDF files to CSV format for easy analysis and integration with FloatChat's data processing pipeline.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Input:</span>
                    <span className="font-medium">NetCDF (.nc)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Output:</span>
                    <span className="font-medium">CSV, JSON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing:</span>
                    <span className="font-medium">Automated</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => console.log('Try NetCDF converter')}
                  data-testid="button-try-converter"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Try Converter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}