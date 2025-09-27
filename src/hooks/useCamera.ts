import { useState } from 'react';
import { CapacitorService } from '@/lib/capacitor-plugins';
import { useToast } from '@/hooks/use-toast';

export const useCamera = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const takePicture = async () => {
    setIsLoading(true);
    try {
      const photo = await CapacitorService.takePicture();
      return photo;
    } catch (error: any) {
      toast({
        title: "Camera Error",
        description: error.message || "Failed to take picture",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await CapacitorService.getCurrentLocation();
      return location;
    } catch (error: any) {
      toast({
        title: "Location Error",
        description: error.message || "Failed to get location",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    takePicture,
    getCurrentLocation,
    isLoading
  };
};