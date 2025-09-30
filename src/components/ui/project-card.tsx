import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/store/projectStore";
import { motion } from "framer-motion";
import { Calendar, Target, FileText } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard = ({ project, onOpen, onDelete }: ProjectCardProps) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Draft';
    }
  };

  const scorePercentage = (project.score / project.maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="border border-border/50 hover:border-border transition-colors shadow-card hover:shadow-elevated">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.certificationStandard} • {project.buildingType}
                </p>
              </div>
              <Badge className={`${getStatusColor(project.status)} text-xs`}>
                {getStatusText(project.status)}
              </Badge>
            </div>

            {/* Score Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-medium text-foreground">
                  {project.score}/{project.maxScore}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{project.lastModified.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{project.images} photos</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button 
                onClick={() => onOpen(project)}
                className="flex-1 h-9"
              >
                <Target className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};