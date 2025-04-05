
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Download, ExternalLink } from "lucide-react";

interface CampusMapImage {
  id: string;
  name: string;
  description: string;
  dataUrl: string;
}

const CampusMap = () => {
  const [maps, setMaps] = useState<CampusMapImage[]>([]);
  const [selectedMapIndex, setSelectedMapIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Load maps from localStorage
    const storedData = localStorage.getItem("campus_maps_data");
    if (storedData) {
      const parsedMaps = JSON.parse(storedData);
      setMaps(parsedMaps);
      
      // Select the first map by default if available
      if (parsedMaps.length > 0) {
        setSelectedMapIndex(0);
      }
    }
  }, []);

  const handleDownloadMap = (map: CampusMapImage) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = map.dataUrl;
    link.download = `${map.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If no maps are available, show a placeholder
  if (maps.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Campus Map</h1>
          <p className="text-muted-foreground">
            Navigate around IITGN campus
          </p>
        </div>
        
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Campus Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Maps Available</h3>
              <p className="text-muted-foreground max-w-md">
                The admin has not uploaded any campus maps yet. Please check back later.
              </p>
              
              <Button variant="outline" className="mt-6" asChild>
                <a 
                  href="https://iitgn.ac.in/campus/visit-us" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Official Campus Page
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const selectedMap = selectedMapIndex !== null ? maps[selectedMapIndex] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campus Map</h1>
        <p className="text-muted-foreground">
          Navigate around IITGN campus
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="border shadow-sm h-full">
            <CardHeader>
              <CardTitle>Available Maps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {maps.map((map, index) => (
                  <Button
                    key={map.id}
                    variant={selectedMapIndex === index ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedMapIndex(index)}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {map.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="border shadow-sm h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{selectedMap?.name}</CardTitle>
                {selectedMap && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadMap(selectedMap)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
              {selectedMap && (
                <p className="text-muted-foreground text-sm">{selectedMap.description}</p>
              )}
            </CardHeader>
            <CardContent>
              {selectedMap ? (
                <div className="border rounded-md overflow-hidden">
                  <img
                    src={selectedMap.dataUrl}
                    alt={selectedMap.name}
                    className="w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border rounded-md">
                  <p className="text-muted-foreground">Select a map to view</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;
