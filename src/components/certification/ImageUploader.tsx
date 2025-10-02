import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProjectStore } from "@/store/projectStore";
import { supabase } from "@/integrations/supabase/client";
import { CapacitorService } from "@/lib/capacitor-plugins";
import { Camera, Upload, X, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  projectId: string;
  criterionId: string;
}

export const ImageUploader = ({ projectId, criterionId }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { addImage, currentProject } = useProjectStore();

  const images = currentProject?.uploadedEvidence?.[criterionId] || [];

  const uploadImage = async (file: Blob, location?: { latitude: number; longitude: number }) => {
    setIsUploading(true);
    try {
      const fileName = `${projectId}/${criterionId}/${Date.now()}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-evidence')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-evidence')
        .getPublicUrl(fileName);

      await addImage(projectId, criterionId, {
        storagePath: fileName,
        downloadUrl: publicUrl,
        description: description || 'Evidence photo',
        location,
        uploadedAt: new Date(),
      });

      setDescription("");
      toast({
        title: "Image uploaded",
        description: "Evidence has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const photo = await CapacitorService.takePicture();
      const location = await CapacitorService.getCurrentLocation();
      
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      
      await uploadImage(blob, location);
    } catch (error: any) {
      toast({
        title: "Camera error",
        description: error.message || "Failed to capture photo",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadImage(file);
  };

  const handleDelete = async (storagePath: string) => {
    try {
      await supabase.storage
        .from('project-evidence')
        .remove([storagePath]);

      const updatedEvidence = {
        ...currentProject?.uploadedEvidence,
        [criterionId]: images.filter(img => img.storagePath !== storagePath)
      };

      await useProjectStore.getState().updateProject(projectId, {
        uploadedEvidence: updatedEvidence
      });

      toast({
        title: "Image deleted",
        description: "Evidence has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`desc-${criterionId}`} className="text-sm">
          Photo Description (Optional)
        </Label>
        <Input
          id={`desc-${criterionId}`}
          placeholder="e.g., Front view showing feature"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUploading}
        />
      </div>

      <div className="flex gap-2">
        {CapacitorService.isNative() && (
          <Button
            onClick={handleCameraCapture}
            disabled={isUploading}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            Take Photo
          </Button>
        )}
        
        <Button
          variant="outline"
          className="flex-1"
          size="sm"
          asChild
          disabled={isUploading}
        >
          <label htmlFor={`file-${criterionId}`} className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
            <input
              id={`file-${criterionId}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Uploaded Evidence ({images.length})
          </Label>
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.storagePath}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={image.downloadUrl}
                        alt={image.description}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {image.description}
                        </p>
                        {image.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {image.location.latitude.toFixed(4)}, {image.location.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(image.storagePath)}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};