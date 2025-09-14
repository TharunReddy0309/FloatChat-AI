import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, TrendingUp, TrendingDown, Waves } from "lucide-react";
import { useState } from "react";

interface DataPoint {
  depth: number;
  temperature: number;
  salinity: number;
}

export default function DataVisualization() {
  const [selectedFloat, setSelectedFloat] = useState("ARGO001");
  const [dataType, setDataType] = useState("temperature");

  // TODO: Remove mock data - replace with real Argo float profile data
  const mockProfileData: DataPoint[] = [
    { depth: 0, temperature: 28.5, salinity: 34.7 },
    { depth: 50, temperature: 27.8, salinity: 34.8 },
    { depth: 100, temperature: 26.2, salinity: 34.9 },
    { depth: 150, temperature: 24.5, salinity: 35.0 },
    { depth: 200, temperature: 22.8, salinity: 35.1 },
    { depth: 250, temperature: 20.1, salinity: 35.2 },
    { depth: 300, temperature: 18.4, salinity: 35.3 },
    { depth: 400, temperature: 15.7, salinity: 35.4 },
    { depth: 500, temperature: 12.9, salinity: 35.5 }
  ];

  const handleExportData = () => {
    console.log('Exporting CSV data for float:', selectedFloat);
    // TODO: Implement actual CSV export functionality
  };

  const maxValue = dataType === 'temperature' 
    ? Math.max(...mockProfileData.map(d => d.temperature))
    : Math.max(...mockProfileData.map(d => d.salinity));

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
                      <SelectItem value="ARGO001">ARGO001</SelectItem>
                      <SelectItem value="ARGO002">ARGO002</SelectItem>
                      <SelectItem value="ARGO003">ARGO003</SelectItem>
                      <SelectItem value="ARGO004">ARGO004</SelectItem>
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
                  <Badge variant="outline">500m</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Surface {dataType === 'temperature' ? 'Temp' : 'Salinity'}</span>
                  <span className="font-semibold">
                    {dataType === 'temperature' ? '28.5°C' : '34.7 PSU'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Deep {dataType === 'temperature' ? 'Temp' : 'Salinity'}</span>
                  <span className="font-semibold">
                    {dataType === 'temperature' ? '12.9°C' : '35.5 PSU'}
                  </span>
                </div>
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
                  {/* Chart Background */}
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
                        points={mockProfileData.map((point, index) => {
                          const x = 15 + ((dataType === 'temperature' ? point.temperature : point.salinity) / maxValue) * 70;
                          const y = 5 + (point.depth / 500) * 85;
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {/* Data Points */}
                      {mockProfileData.map((point, index) => {
                        const x = 15 + ((dataType === 'temperature' ? point.temperature : point.salinity) / maxValue) * 70;
                        const y = 5 + (point.depth / 500) * 85;
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
                      <span>100m</span>
                      <span>200m</span>
                      <span>300m</span>
                      <span>400m</span>
                      <span>500m</span>
                    </div>

                    {/* Value Scale */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-between px-12 text-xs text-muted-foreground">
                      {dataType === 'temperature' ? (
                        <>
                          <span>10°C</span>
                          <span>15°C</span>
                          <span>20°C</span>
                          <span>25°C</span>
                          <span>30°C</span>
                        </>
                      ) : (
                        <>
                          <span>34.5</span>
                          <span>34.8</span>
                          <span>35.1</span>
                          <span>35.4</span>
                          <span>35.7</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}