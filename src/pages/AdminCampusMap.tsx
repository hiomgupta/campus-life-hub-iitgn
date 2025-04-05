
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, MapPin, Save, Image } from "lucide-react";
import { toast } from "sonner";

const AdminCampusMap = () => {
  const navigate = useNavigate();
  const [selectedMap, setSelectedMap] = useState<File | null>(null);
  const [mapPreview, setMapPreview] = useState<string | null>(null);
  const [savedMap, setSavedMap] = useState<string | null>(localStorage.getItem("campus_map"));
  
  const handleMapSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large. Please select an image under 2MB");
        return;
      }
      
      setSelectedMap(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMapPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveMap = () => {
    if (mapPreview) {
      localStorage.setItem("campus_map", mapPreview);
      setSavedMap(mapPreview);
      toast.success("Campus map updated successfully");
      setSelectedMap(null);
      setMapPreview(null);
    }
  };
  
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Map</h1>
          <p className="text-muted-foreground">
            Upload and manage campus maps
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Map</CardTitle>
            <CardDescription>
              Upload an image file of the campus map. For best results, use a clear, high-resolution image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop or click to select a map image
                </p>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleMapSelect}
                  className="max-w-xs"
                />
              </div>
              
              {mapPreview && (
                <div className="space-y-4">
                  <h3 className="font-medium">Preview:</h3>
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={mapPreview} 
                      alt="Map preview" 
                      className="w-full h-auto"
                    />
                  </div>
                  <Button onClick={handleSaveMap} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Map
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Map</CardTitle>
            <CardDescription>
              The currently active campus map
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedMap ? (
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={savedMap} 
                  alt="Current campus map" 
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="border rounded-md p-12 flex flex-col items-center justify-center text-muted-foreground">
                <Image className="h-16 w-16 mb-4 opacity-30" />
                <p>No map has been uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Map Usage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The uploaded map will be available to all users of the campus app. Here are some recommendations for maps:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a high-resolution image for clarity on all devices</li>
              <li>Include building names and important landmarks</li>
              <li>For interactive maps, consider adding labeled markers for key locations</li>
              <li>Use color coding to distinguish between different types of buildings</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              In a full implementation, this could be extended to include interactive elements, location markers, search capabilities, and navigation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCampusMap;
