import { Button } from "@/components/ui/button";
import { Camera, MapPin } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { motion } from "framer-motion";

interface CameraButtonProps {
  onPhotoTaken?: (photo: any, location?: any) => void;
  disabled?: boolean;
  className?: string;
}

export const CameraButton = ({ onPhotoTaken, disabled, className }: CameraButtonProps) => {
  const { takePicture, getCurrentLocation, isLoading } = useCamera();

  const handleTakePhoto = async () => {
    const photo = await takePicture();
    if (photo) {
      const location = await getCurrentLocation();
      onPhotoTaken?.(photo, location);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={handleTakePhoto}
        disabled={disabled || isLoading}
        className={`flex items-center gap-2 ${className}`}
        variant="outline"
      >
        <Camera className="h-4 w-4" />
        {isLoading ? "Taking Photo..." : "Take Photo"}
        <MapPin className="h-3 w-3 opacity-60" />
      </Button>
    </motion.div>
  );
};