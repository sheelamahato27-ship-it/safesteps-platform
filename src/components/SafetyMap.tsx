import { useState, useEffect } from "react";
import { MapPin, Navigation, Shield, AlertTriangle, Camera, Users, Lightbulb, Building2, Search, LocateFixed, Route } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'start' | 'destination' | 'police' | 'hospital' | 'safe-point';
}

interface RouteSegment {
  id: string;
  points: { x: number; y: number }[];
  safetyLevel: 'safe' | 'moderate' | 'danger';
  safetyScore: number;
  factors: string[];
}

const safetyFactors = [
  { icon: Lightbulb, label: "Street Lighting", positive: true },
  { icon: Users, label: "Crowd Density", positive: true },
  { icon: Building2, label: "Police Station Nearby", positive: true },
  { icon: Camera, label: "CCTV Coverage", positive: true },
  { icon: AlertTriangle, label: "Crime Reports", positive: false },
  { icon: Shield, label: "User Safety Ratings", positive: true },
];

const mockLocations: Location[] = [
  { id: '1', name: 'City Center', x: 45, y: 30, type: 'safe-point' },
  { id: '2', name: 'Police Station', x: 25, y: 45, type: 'police' },
  { id: '3', name: 'General Hospital', x: 70, y: 55, type: 'hospital' },
  { id: '4', name: 'Metro Station', x: 55, y: 70, type: 'safe-point' },
  { id: '5', name: 'Shopping Mall', x: 35, y: 65, type: 'safe-point' },
];

const mockRoutes: { name: string; segments: RouteSegment[]; totalScore: number; duration: string; distance: string }[] = [
  {
    name: "Safest Route",
    totalScore: 92,
    duration: "18 min",
    distance: "2.4 km",
    segments: [
      { id: 'r1-1', points: [{ x: 15, y: 25 }, { x: 25, y: 30 }, { x: 35, y: 28 }], safetyLevel: 'safe', safetyScore: 95, factors: ['Well-lit', 'CCTV', 'Busy street'] },
      { id: 'r1-2', points: [{ x: 35, y: 28 }, { x: 45, y: 35 }, { x: 55, y: 40 }], safetyLevel: 'safe', safetyScore: 90, factors: ['Near police station', 'Good lighting'] },
      { id: 'r1-3', points: [{ x: 55, y: 40 }, { x: 65, y: 50 }, { x: 75, y: 60 }], safetyLevel: 'safe', safetyScore: 88, factors: ['Near hospital', 'Crowd presence'] },
    ]
  },
  {
    name: "Balanced Route",
    totalScore: 75,
    duration: "14 min",
    distance: "1.8 km",
    segments: [
      { id: 'r2-1', points: [{ x: 15, y: 25 }, { x: 30, y: 35 }, { x: 45, y: 45 }], safetyLevel: 'safe', safetyScore: 85, factors: ['Well-lit', 'Moderate traffic'] },
      { id: 'r2-2', points: [{ x: 45, y: 45 }, { x: 55, y: 50 }, { x: 60, y: 55 }], safetyLevel: 'moderate', safetyScore: 65, factors: ['Less lighting', 'Lower foot traffic'] },
      { id: 'r2-3', points: [{ x: 60, y: 55 }, { x: 70, y: 58 }, { x: 75, y: 60 }], safetyLevel: 'safe', safetyScore: 82, factors: ['Near hospital'] },
    ]
  },
  {
    name: "Avoid Route",
    totalScore: 45,
    duration: "10 min",
    distance: "1.2 km",
    segments: [
      { id: 'r3-1', points: [{ x: 15, y: 25 }, { x: 25, y: 35 }, { x: 35, y: 45 }], safetyLevel: 'moderate', safetyScore: 60, factors: ['Moderate lighting'] },
      { id: 'r3-2', points: [{ x: 35, y: 45 }, { x: 50, y: 55 }, { x: 60, y: 58 }], safetyLevel: 'danger', safetyScore: 35, factors: ['Poor lighting', 'Isolated area', 'Past incidents'] },
      { id: 'r3-3', points: [{ x: 60, y: 58 }, { x: 70, y: 60 }, { x: 75, y: 60 }], safetyLevel: 'moderate', safetyScore: 55, factors: ['Recovering area'] },
    ]
  }
];

export const SafetyMap = () => {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 15, y: 25 });

  const handleFindRoute = () => {
    if (startLocation && destination) {
      setShowRoutes(true);
      setSelectedRoute(0);
    }
  };

  const startNavigation = () => {
    setIsNavigating(true);
  };

  useEffect(() => {
    if (isNavigating) {
      const route = mockRoutes[selectedRoute];
      const allPoints = route.segments.flatMap(s => s.points);
      let pointIndex = 0;

      const interval = setInterval(() => {
        if (pointIndex < allPoints.length) {
          setCurrentPosition(allPoints[pointIndex]);
          pointIndex++;
        } else {
          clearInterval(interval);
          setIsNavigating(false);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isNavigating, selectedRoute]);

  const getSafetyColor = (level: 'safe' | 'moderate' | 'danger') => {
    switch (level) {
      case 'safe': return '#22c55e';
      case 'moderate': return '#eab308';
      case 'danger': return '#ef4444';
    }
  };

  const getSafetyGlow = (level: 'safe' | 'moderate' | 'danger') => {
    switch (level) {
      case 'safe': return 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))';
      case 'moderate': return 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))';
      case 'danger': return 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))';
    }
  };

  const generatePath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x}% ${points[0].y}%`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x}% ${points[i].y}%`;
    }
    return d;
  };

  return (
    <section id="map" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Route className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Safety Map</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Your <span className="text-gradient">Safest Route</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes real-time data to recommend the safest path, even if it's longer.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Location Inputs */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Plan Your Route
              </h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-safe border-2 border-white" />
                  <Input
                    placeholder="Start location..."
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-white" />
                  <Input
                    placeholder="Destination..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="glow" 
                  className="flex-1"
                  onClick={handleFindRoute}
                  disabled={!startLocation || !destination}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Safest Route
                </Button>
                <Button variant="outline" size="icon">
                  <LocateFixed className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Route Options */}
            {showRoutes && (
              <div className="glass rounded-2xl p-6 space-y-4 animate-fade-up">
                <h3 className="font-semibold text-lg">Available Routes</h3>
                <div className="space-y-3">
                  {mockRoutes.map((route, index) => (
                    <button
                      key={route.name}
                      onClick={() => setSelectedRoute(index)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedRoute === index 
                          ? 'bg-primary/20 border-2 border-primary' 
                          : 'bg-background/50 border border-white/10 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{route.name}</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                          index === 0 ? 'bg-safe/20 text-safe' :
                          index === 1 ? 'bg-caution/20 text-caution' :
                          'bg-danger/20 text-danger'
                        }`}>
                          {route.totalScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{route.duration}</span>
                        <span>•</span>
                        <span>{route.distance}</span>
                      </div>
                      {index === 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-safe">
                          <Shield className="w-3 h-3" />
                          Recommended
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <Button 
                  variant="safe" 
                  className="w-full"
                  onClick={startNavigation}
                  disabled={isNavigating}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isNavigating ? 'Navigating...' : 'Start Navigation'}
                </Button>
              </div>
            )}

            {/* Legend */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Safety Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 rounded-full bg-safe shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="text-sm">Safe Zone (Score 80-100)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 rounded-full bg-caution shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  <span className="text-sm">Moderate (Score 50-79)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 rounded-full bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  <span className="text-sm">High Risk (Score 0-49)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium mb-3">Safety Factors</h4>
                <div className="grid grid-cols-2 gap-2">
                  {safetyFactors.map((factor) => (
                    <div key={factor.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <factor.icon className={`w-3 h-3 ${factor.positive ? 'text-safe' : 'text-danger'}`} />
                      <span>{factor.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-2 h-[600px] relative overflow-hidden">
              {/* Map Background with Grid */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5">
                <svg className="w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/30" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Routes SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {showRoutes && mockRoutes[selectedRoute].segments.map((segment) => (
                  <g key={segment.id}>
                    <path
                      d={generatePath(segment.points)}
                      fill="none"
                      stroke={getSafetyColor(segment.safetyLevel)}
                      strokeWidth={hoveredSegment === segment.id ? "1.5" : "1"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: getSafetyGlow(segment.safetyLevel) }}
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredSegment(segment.id)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                    {/* Animated dots on route */}
                    {isNavigating && (
                      <circle r="1" fill="white">
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          path={generatePath(segment.points)}
                        />
                      </circle>
                    )}
                  </g>
                ))}
              </svg>

              {/* Location Markers */}
              {mockLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <div className={`p-2 rounded-full ${
                    loc.type === 'police' ? 'bg-blue-500/20 text-blue-400' :
                    loc.type === 'hospital' ? 'bg-red-500/20 text-red-400' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {loc.type === 'police' ? <Shield className="w-4 h-4" /> :
                     loc.type === 'hospital' ? <Building2 className="w-4 h-4" /> :
                     <MapPin className="w-4 h-4" />}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                    {loc.name}
                  </div>
                </div>
              ))}

              {/* Start Point */}
              {showRoutes && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: '15%', top: '25%' }}
                >
                  <div className="w-6 h-6 rounded-full bg-safe border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs font-medium whitespace-nowrap">
                    Start
                  </span>
                </div>
              )}

              {/* Destination Point */}
              {showRoutes && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: '75%', top: '60%' }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs font-medium whitespace-nowrap">
                    Destination
                  </span>
                </div>
              )}

              {/* Current Position (during navigation) */}
              {isNavigating && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700"
                  style={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary border-3 border-white flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Segment Info Tooltip */}
              {hoveredSegment && (
                <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 animate-fade-up">
                  {mockRoutes[selectedRoute].segments.filter(s => s.id === hoveredSegment).map(segment => (
                    <div key={segment.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Segment Safety Score</span>
                        <span className={`font-bold ${
                          segment.safetyLevel === 'safe' ? 'text-safe' :
                          segment.safetyLevel === 'moderate' ? 'text-caution' :
                          'text-danger'
                        }`}>
                          {segment.safetyScore}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {segment.factors.map(factor => (
                          <span key={factor} className="text-xs px-2 py-1 rounded-full bg-white/10">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Real-time Update Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
                <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                Real-time updates
              </div>

              {/* Empty State */}
              {!showRoutes && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter start and destination to find your safest route</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
