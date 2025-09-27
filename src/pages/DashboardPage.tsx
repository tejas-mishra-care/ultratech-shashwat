import { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { ProjectCard } from "@/components/ui/project-card";
import { Button } from "@/components/ui/button";
import { CameraButton } from "@/components/ui/camera-button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore } from "@/store/projectStore";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Plus, Target, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CapacitorService } from "@/lib/capacitor-plugins";

export const DashboardPage = () => {
  const { projects } = useProjectStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    averageScore: projects.length > 0 
      ? Math.round(projects.reduce((acc, p) => acc + (p.score / p.maxScore * 100), 0) / projects.length)
      : 0
  };

  const handleCreateProject = () => {
    navigate('/new-project');
  };

  const handleOpenProject = (project: any) => {
    navigate(`/project/${project.id}`);
  };

  const handlePhotoTaken = (photo: any, location: any) => {
    console.log('Photo taken:', photo);
    console.log('Location:', location);
    // Handle photo and location data
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="UltraCertify"
        showMenu
        rightAction={
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCreateProject}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        }
      />

      <main className="pb-20 px-mobile">
        {/* Welcome Section */}
        <motion.div 
          className="py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h2>
          <p className="text-muted-foreground">
            Manage your certification projects and track progress
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 gap-mobile-gap mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Projects</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mb-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button 
            onClick={handleCreateProject}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start New Certification Project
          </Button>
          
          {CapacitorService.isNative() && (
            <CameraButton 
              onPhotoTaken={handlePhotoTaken}
              className="w-full h-12 text-base font-medium"
            />
          )}
        </motion.div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Projects
            </h3>
            {stats.averageScore > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{stats.averageScore}% avg</span>
              </div>
            )}
          </div>

          {projects.length > 0 ? (
            <div className="space-y-mobile-gap">
              {projects
                .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProjectCard 
                      project={project} 
                      onOpen={handleOpenProject}
                    />
                  </motion.div>
                ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No projects yet
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start your first certification project to begin tracking your progress
                </p>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
};