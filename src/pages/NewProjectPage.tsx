import { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjectStore } from "@/store/projectStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const certificationStandards = [
  { value: "NEST_PLUS", label: "NEST PLUS" },
  { value: "NEST", label: "NEST" },
];

const buildingTypes = [
  { value: "New", label: "New Building" },
  { value: "Existing", label: "Existing Building" },
];

export const NewProjectPage = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [certificationStandard, setCertificationStandard] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const { createProject } = useProjectStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateProject = async () => {
    if (!projectTitle.trim() || !certificationStandard || !buildingType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const projectDetails = {
      projectTitle: projectTitle.trim(),
      certificationStandard,
      buildingType,
      registrationNumber: '',
      ownerName: '',
      mobileNumber: '',
      emailAddress: '',
      projectLocation: '',
      fullAddress: '',
      permissionAuthority: '',
      projectType: '',
      numberOfFloors: 1,
      totalSiteArea: 0,
      totalBuiltUpArea: 0,
      landscapeArea: 0,
      twoWheelerParking: 0,
    };

    const project = await createProject(projectDetails);
    
    if (project) {
      toast({
        title: "Project Created!",
        description: `${projectTitle} has been created successfully`,
      });
      
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="New Project"
        showBack
        onBack={() => navigate('/dashboard')}
      />

      <main className="px-mobile py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-xl">Project Setup</CardTitle>
              <p className="text-muted-foreground text-sm">
                Configure your certification project details
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Title */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter project name"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="h-11"
                />
              </motion.div>

              {/* Certification Standard */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label>Certification Standard *</Label>
                <Select value={certificationStandard} onValueChange={setCertificationStandard}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select certification standard" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationStandards.map((standard) => (
                      <SelectItem key={standard.value} value={standard.value}>
                        {standard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Building Type */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label>Building Type *</Label>
                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Create Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button 
                  onClick={handleCreateProject}
                  className="w-full h-12 text-base font-medium mt-8"
                  disabled={!projectTitle.trim() || !certificationStandard || !buildingType}
                >
                  Create Project
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};