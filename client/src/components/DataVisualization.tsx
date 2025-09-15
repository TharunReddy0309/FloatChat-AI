import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, TrendingUp, TrendingDown, Waves } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface DataPoint {
  depth: number;
  temperature: number;
  salinity: number;
  pressure: number | null;
}

interface FloatData {
  id: string;
  floatId: string;
  status: string;
}

export default function DataVisualization() {
  const [selectedFloat, setSelectedFloat] = useState("ARGO001");
  const [dataType, setDataType] = useState("temperature");
  const { toast } = useToast();

  // Fetch available floats
  const { data: floats = [] } = useQuery<FloatData[]>({
    queryKey: ['/api/floats'],
    queryFn: async (): Promise<FloatData[]> => {
      const response = await fetch('/api/floats');
      if (!response.ok) throw new Error('Failed to fetch floats');
      return response.json();
    }
  });

  // Fetch profile data for selected float
  const { data: profileData = [], isLoading: profileLoading } = useQuery<DataPoint[]>({
    queryKey: ['/api/measurements', selectedFloat, 'profile'],
    queryFn: async (): Promise<DataPoint[]> => {
      const response = await fetch(`/api/measurements/${selectedFloat}/profile`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch profile data');
      }
      return response.json();
    },
    enabled: !!selectedFloat
  });

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/export/csv?floatId=${selectedFloat}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFloat}_measurements.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Data for ${selectedFloat} exported successfully.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export CSV data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const maxValue = profileData.length > 0 ? (
    dataType === 'temperature' 
      ? Math.max(...profileData.map(d => d.temperature))
      : Math.max(...profileData.map(d => d.salinity))
  ) : 1;
  
  const minValue = profileData.length > 0 ? (
    dataType === 'temperature' 
      ? Math.min(...profileData.map(d => d.temperature))
      : Math.min(...profileData.map(d => d.salinity))
  ) : 0;
  
  const maxDepth = profileData.length > 0 ? Math.max(...profileData.map(d => d.depth)) : 500;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ocean Profile Visualization</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore depth profiles showing how temperature and salinity change with ocean depth. Interactive charts powered by real Argo float measurements.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visualization Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Float</label>
                  <Select value={selectedFloat} onValueChange={setSelectedFloat}>
                    <SelectTrigger data-testid="select-float">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {floats.map((float) => (
                        <SelectItem key={float.id} value={float.floatId}>
                          {float.floatId} ({float.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Data Type</label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger data-testid="select-data-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">Temperature (°C)</SelectItem>
                      <SelectItem value="salinity">Salinity (PSU)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleExportData}
                  data-testid="button-export-csv"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Max Depth</span>
                  <Badge variant="outline">
                    {profileLoading ? 'Loading...' : `${maxDepth}m`}
                  </Badge>
                </div>
                {profileData.length > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Surface {dataType === 'temperature' ? 'Temp' : 'Salinity'}</span>
                      <span className="font-semibold">
                        {dataType === 'temperature' 
                          ? `${profileData[0]?.temperature || 0}°C`
                          : `${profileData[0]?.salinity || 0} PSU`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Deep {dataType === 'temperature' ? 'Temp' : 'Salinity'}</span>
                      <span className="font-semibold">
                        {dataType === 'temperature' 
                          ? `${profileData[profileData.length - 1]?.temperature || 0}°C`
                          : `${profileData[profileData.length - 1]?.salinity || 0} PSU`
                        }
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gradient</span>
                  <div className="flex items-center gap-1">
                    {dataType === 'temperature' ? (
                      <TrendingDown className="h-4 w-4 text-chart-3" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-chart-2" />
                    )}
                    <span className="text-sm font-medium">
                      {dataType === 'temperature' ? 'Decreasing' : 'Increasing'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Depth Profile - {selectedFloat}
                  <Badge variant="secondary" className="ml-auto">
                    <Waves className="h-3 w-3 mr-1" />
                    {dataType === 'temperature' ? 'Temperature' : 'Salinity'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[520px] p-6">
                <div className="relative w-full h-full">
                  {profileLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading profile data...</p>
                      </div>
                    </div>
                  ) : profileData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No profile data available for {selectedFloat}</p>
                      </div>
                    </div>
                  ) : (
                    /* Chart Background */
                    <div className="absolute inset-0 bg-gradient-to-b from-chart-1/5 to-chart-1/20 rounded-lg">
                      <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <linearGradient id="depthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(147, 197, 253)" stopOpacity="0.1"/>
                          <stop offset="100%" stopColor="rgb(29, 78, 216)" stopOpacity="0.3"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Grid lines */}
                      {[0, 20, 40, 60, 80, 100].map((percent) => (
                        <line
                          key={percent}
                          x1="10%" 
                          y1={`${percent}%`} 
                          x2="90%" 
                          y2={`${percent}%`}
                          stroke="currentColor"
                          strokeOpacity="0.1"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Vertical grid */}
                      {[20, 40, 60, 80].map((percent) => (
                        <line
                          key={`v-${percent}`}
                          x1={`${percent}%`} 
                          y1="5%" 
                          x2={`${percent}%`} 
                          y2="95%"
                          stroke="currentColor"
                          strokeOpacity="0.1"
                          strokeWidth="1"
                        />
                      ))}

                        {/* Profile Line */}
                        <polyline
                          fill="none"
                          stroke={dataType === 'temperature' ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          points={profileData.map((point) => {
                            const value = dataType === 'temperature' ? point.temperature : point.salinity;
                            const normalizedValue = (value - minValue) / (maxValue - minValue);
                            const x = 15 + normalizedValue * 70;
                            const y = 5 + (point.depth / maxDepth) * 85;
                            return `${x},${y}`;
                          }).join(' ')}
                        />

                        {/* Data Points */}
                        {profileData.map((point, index) => {
                          const value = dataType === 'temperature' ? point.temperature : point.salinity;
                          const normalizedValue = (value - minValue) / (maxValue - minValue);
                          const x = 15 + normalizedValue * 70;
                          const y = 5 + (point.depth / maxDepth) * 85;
                          return (
                            <circle
                              key={index}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill={dataType === 'temperature' ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'}
                              stroke="white"
                              strokeWidth="2"
                              className="hover:r-6 transition-all cursor-pointer"
                              title={`Depth: ${point.depth}m, ${dataType === 'temperature' ? 'Temperature' : 'Salinity'}: ${value}${dataType === 'temperature' ? '°C' : ' PSU'}`}
                            />
                          );
                        })}
                      </svg>

                      {/* Axis Labels */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground">
                        Depth (m)
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground">
                        {dataType === 'temperature' ? 'Temperature (°C)' : 'Salinity (PSU)'}
                      </div>

                      {/* Depth Scale */}
                      <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-4 text-xs text-muted-foreground">
                        <span>0m</span>
                        <span>{Math.round(maxDepth * 0.2)}m</span>
                        <span>{Math.round(maxDepth * 0.4)}m</span>
                        <span>{Math.round(maxDepth * 0.6)}m</span>
                        <span>{Math.round(maxDepth * 0.8)}m</span>
                        <span>{maxDepth}m</span>
                      </div>

                      {/* Value Scale */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-12 text-xs text-muted-foreground">
                        <span>{minValue.toFixed(1)}{dataType === 'temperature' ? '°C' : ''}</span>
                        <span>{(minValue + (maxValue - minValue) * 0.25).toFixed(1)}{dataType === 'temperature' ? '°C' : ''}</span>
                        <span>{(minValue + (maxValue - minValue) * 0.5).toFixed(1)}{dataType === 'temperature' ? '°C' : ''}</span>
                        <span>{(minValue + (maxValue - minValue) * 0.75).toFixed(1)}{dataType === 'temperature' ? '°C' : ''}</span>
                        <span>{maxValue.toFixed(1)}{dataType === 'temperature' ? '°C' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}