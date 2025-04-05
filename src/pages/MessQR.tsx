
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, RefreshCw } from "lucide-react";

const MessQR = () => {
  // This would typically be generated based on user authentication
  // For now, we'll just use a placeholder QR image
  const qrCodeUrl = "/placeholder.svg";
  
  const handleDownload = () => {
    // In a real implementation, this would download the QR code image
    alert("QR code download functionality would be implemented here");
  };
  
  const handleRefresh = () => {
    // In a real implementation, this would regenerate the QR code
    alert("QR code refresh functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Mess QR Code</h1>
        <p className="text-muted-foreground">
          Use this QR code for mess entry and payments
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Personal QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="border p-4 rounded-lg shadow-sm bg-white dark:bg-black">
              <img 
                src={qrCodeUrl} 
                alt="Your Mess QR Code" 
                className="w-64 h-64 max-w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Mess Entry</h3>
                <p className="text-sm text-muted-foreground">
                  Show this QR code to the mess staff at entry to verify your access.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Meal Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Use this code for cashless payment at the mess counter.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Offline Access</h3>
                <p className="text-sm text-muted-foreground">
                  This QR code is stored offline for access without internet.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Mess Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-2">Your current mess balance</p>
                <p className="text-3xl font-bold">₹2,500</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" className="w-full">Transaction History</Button>
                <Button className="w-full">Add Money</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessQR;
