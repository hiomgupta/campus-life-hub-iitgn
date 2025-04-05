
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Save, MapPin, Image, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CampusMapImage {
  id: string;
  name: string;
  description: string;
  dataUrl: string;
}

const AdminCampusMap = () => {
  const navigate = useNavigate();
  const [maps, setMaps] = useState<CampusMapImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem("campus_maps_data");
    if (storedData) {
      setMaps(JSON.parse(storedData));
    }
  }, []);

  const handleSaveChanges = () => {
    localStorage.setItem("campus_maps_data", JSON.stringify(maps));
    toast.success("Campus maps saved successfully");
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // Create a new map object
      const newMap: CampusMapImage = {
        id: `map-${Date.now()}`,
        name: file.name.split('.')[0], // Use filename without extension
        description: "Campus map description",
        dataUrl
      };
      
      setMaps([...maps, newMap]);
      setIsEditing(true);
    };
    
    reader.readAsDataURL(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveMap = (id: string) => {
    setMaps(maps.filter(map => map.id !== id));
    setIsEditing(true);
  };

  const handleUpdateMapField = (index: number, field: keyof CampusMapImage, value: string) => {
    const updatedMaps = [...maps];
    updatedMaps[index][field] = value;
    setMaps(updatedMaps);
    setIsEditing(true);
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
          <h1 className="text-3xl font-bold tracking-tight">Campus Map Editor</h1>
          <p className="text-muted-foreground">
            Upload and update campus maps
          </p>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Upload New Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed rounded-lg p-8 text-center">
              <Image className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 font-medium">Upload map image</h3>
              <p className="text-sm text-muted-foreground mb-4">
                PNG, JPG or SVG (max. 5MB)
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Maps</CardTitle>
          </CardHeader>
          <CardContent>
            {maps.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-muted-foreground">No maps uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {maps.map((map, index) => (
                  <div key={map.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2 w-full mr-4">
                        <Input 
                          value={map.name}
                          onChange={(e) => handleUpdateMapField(index, 'name', e.target.value)}
                          className="font-medium"
                          placeholder="Map name"
                        />
                        <Input 
                          value={map.description}
                          onChange={(e) => handleUpdateMapField(index, 'description', e.target.value)}
                          placeholder="Map description"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMap(map.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="border rounded overflow-hidden h-40">
                      <img 
                        src={map.dataUrl} 
                        alt={map.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCampusMap;
