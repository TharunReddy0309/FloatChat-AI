import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import DevelopmentRoadmap from "@/components/DevelopmentRoadmap";
import InteractiveMap from "@/components/InteractiveMap";
import ChatInterface from "@/components/ChatInterface";
import DataVisualization from "@/components/DataVisualization";
import FeatureSections from "@/components/FeatureSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <DevelopmentRoadmap />
        <InteractiveMap />
        <ChatInterface />
        <DataVisualization />
        <FeatureSections />
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FloatChat</h3>
              <p className="text-muted-foreground text-sm">
                Making oceanographic research accessible through conversational AI and beautiful data visualizations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#demo" className="block text-muted-foreground hover:text-primary transition-colors">Interactive Demo</a>
                <a href="#features" className="block text-muted-foreground hover:text-primary transition-colors">Features</a>
                <a href="#data" className="block text-muted-foreground hover:text-primary transition-colors">Sample Data</a>
                <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors">About Team</a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 FloatChat. Built for Smart India Hackathon 2025.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}