import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, MessageSquare, BarChart3 } from "lucide-react";
import heroImage from "@assets/generated_images/Ocean_research_hero_image_87edf472.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Underwater oceanographic research" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          FloatChat
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
          Ask the ocean: natural-language queries, interactive maps and profile plots from Argo float data
        </p>
        <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
          Making oceanographic research accessible to non-experts through conversational AI and beautiful visualizations
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            data-testid="button-try-demo"
            onClick={() => console.log('Try Demo clicked')}
          >
            <MapPin className="mr-2 h-5 w-5" />
            Try Interactive Demo
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            data-testid="button-download-data"
            onClick={() => console.log('Download Sample Data clicked')}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Download Sample Data
          </Button>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <MessageSquare className="h-12 w-12 mb-4 text-white" />
            <h3 className="text-lg font-semibold mb-2">Natural Language Queries</h3>
            <p className="text-sm text-primary-foreground/80">Ask complex oceanographic questions in plain English</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <MapPin className="h-12 w-12 mb-4 text-white" />
            <h3 className="text-lg font-semibold mb-2">Interactive Maps</h3>
            <p className="text-sm text-primary-foreground/80">Explore Argo float positions with clickable visualizations</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <BarChart3 className="h-12 w-12 mb-4 text-white" />
            <h3 className="text-lg font-semibold mb-2">Profile Plots</h3>
            <p className="text-sm text-primary-foreground/80">Depth vs temperature/salinity visualizations</p>
          </div>
        </div>
      </div>
    </section>
  );
}