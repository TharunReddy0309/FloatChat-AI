import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer, Waves, Clock } from "lucide-react";
import { useState } from "react";

interface FloatData {
  id: string;
  latitude: number;
  longitude: number;
  temperature: number;
  salinity: number;
  depth: number;
  lastUpdate: string;
  status: 'active' | 'inactive';
}

export default function InteractiveMap() {
  // TODO: Remove mock data - replace with real Argo float data
  const [selectedFloat, setSelectedFloat] = useState<FloatData | null>(null);
  const mockFloats: FloatData[] = [
    { id: "ARGO001", latitude: -10.5, longitude: 75.2, temperature: 28.5, salinity: 34.7, depth: 150, lastUpdate: "2 hours ago", status: 'active' },
    { id: "ARGO002", latitude: -8.3, longitude: 78.1, temperature: 27.8, salinity: 34.9, depth: 200, lastUpdate: "4 hours ago", status: 'active' },
    { id: "ARGO003", latitude: -12.1, longitude: 72.8, temperature: 26.2, salinity: 35.1, depth: 180, lastUpdate: "1 day ago", status: 'inactive' },
    { id: "ARGO004", latitude: -15.7, longitude: 80.5, temperature: 25.9, salinity: 34.8, depth: 220, lastUpdate: "6 hours ago", status: 'active' },
  ];

  return (
    <section id="demo" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Argo Float Map</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore real-time positions of Argo floats in the Indian Ocean. Click on any marker to view detailed oceanographic data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-96 md:h-[500px]">
              <CardContent className="p-6 h-full">
                <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 rounded-lg overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-950 dark:to-blue-800">
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%" className="text-primary/20">
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>
                  </div>

                  {/* Float Markers */}
                  {mockFloats.map((float, index) => (
                    <button
                      key={float.id}
                      className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg hover-elevate transition-all duration-200 ${
                        float.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'
                      } ${selectedFloat?.id === float.id ? 'scale-125 ring-4 ring-primary/30' : ''}`}
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`,
                      }}
                      onClick={() => setSelectedFloat(float)}
                      data-testid={`marker-${float.id}`}
                    >
                      <MapPin className="w-4 h-4 text-white absolute -top-1 -left-1" />
                    </button>
                  ))}

                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      Indian Ocean Region
                    </Badge>
                    <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm p-2 rounded">
                      {mockFloats.filter(f => f.status === 'active').length} Active Floats
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Float Details Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Float Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFloat ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{selectedFloat.id}</span>
                      <Badge variant={selectedFloat.status === 'active' ? 'default' : 'secondary'}>
                        {selectedFloat.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Latitude</div>
                        <div className="font-medium">{selectedFloat.latitude}°</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Longitude</div>
                        <div className="font-medium">{selectedFloat.longitude}°</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-4 w-4 text-chart-3" />
                        <div>
                          <div className="text-sm text-muted-foreground">Temperature</div>
                          <div className="font-semibold">{selectedFloat.temperature}°C</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Waves className="h-4 w-4 text-chart-2" />
                        <div>
                          <div className="text-sm text-muted-foreground">Salinity</div>
                          <div className="font-semibold">{selectedFloat.salinity} PSU</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-chart-4" />
                        <div>
                          <div className="text-sm text-muted-foreground">Last Update</div>
                          <div className="font-semibold">{selectedFloat.lastUpdate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click on a float marker to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ocean Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Floats</span>
                  <Badge variant="default">{mockFloats.filter(f => f.status === 'active').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Temperature</span>
                  <span className="font-semibold">27.1°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Salinity</span>
                  <span className="font-semibold">34.9 PSU</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}