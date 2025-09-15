import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer, Waves, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface FloatData {
  id: string;
  floatId: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  region: string | null;
  deploymentDate: string | null;
  lastUpdate: string | null;
}

interface MeasurementData {
  depth: number;
  temperature: number;
  salinity: number;
  pressure: number | null;
}

export default function InteractiveMap() {
  const [selectedFloat, setSelectedFloat] = useState<FloatData | null>(null);
  const [latestMeasurement, setLatestMeasurement] = useState<MeasurementData | null>(null);

  // Fetch all floats
  const { data: floats = [], isLoading: floatsLoading } = useQuery<FloatData[]>({
    queryKey: ['/api/floats'],
    queryFn: async (): Promise<FloatData[]> => {
      const response = await fetch('/api/floats');
      if (!response.ok) throw new Error('Failed to fetch floats');
      return response.json();
    }
  });

  // Fetch latest measurement for selected float
  const { data: measurements = [] } = useQuery<MeasurementData[]>({
    queryKey: ['/api/measurements', selectedFloat?.floatId],
    queryFn: async (): Promise<MeasurementData[]> => {
      if (!selectedFloat?.floatId) return [];
      const response = await fetch(`/api/measurements?floatId=${selectedFloat.floatId}`);
      if (!response.ok) throw new Error('Failed to fetch measurements');
      return response.json();
    },
    enabled: !!selectedFloat?.floatId
  });

  // Get latest measurement (surface or shallowest)
  useEffect(() => {
    if (measurements.length > 0) {
      const surface = measurements.find(m => m.depth === 0) || measurements[0];
      setLatestMeasurement(surface);
    } else {
      setLatestMeasurement(null);
    }
  }, [measurements]);

  const formatLastUpdate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

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
                  {floats.map((float, index) => (
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
                      data-testid={`marker-${float.floatId}`}
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
                      {floatsLoading ? 'Loading...' : `${floats.filter(f => f.status === 'active').length} Active Floats`}
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
                      <span className="font-semibold">{selectedFloat.floatId}</span>
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

                    {latestMeasurement ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Thermometer className="h-4 w-4 text-chart-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">Temperature</div>
                            <div className="font-semibold">{latestMeasurement.temperature}°C</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Waves className="h-4 w-4 text-chart-2" />
                          <div>
                            <div className="text-sm text-muted-foreground">Salinity</div>
                            <div className="font-semibold">{latestMeasurement.salinity} PSU</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-chart-4" />
                          <div>
                            <div className="text-sm text-muted-foreground">Last Update</div>
                            <div className="font-semibold">{formatLastUpdate(selectedFloat.lastUpdate)}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <p className="text-sm">Loading measurement data...</p>
                      </div>
                    )}
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
                  <Badge variant="default">
                    {floatsLoading ? '...' : floats.filter(f => f.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Floats</span>
                  <span className="font-semibold">
                    {floatsLoading ? 'Loading...' : floats.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Region</span>
                  <span className="font-semibold">Indian Ocean</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}