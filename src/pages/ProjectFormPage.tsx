import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useProjectStore } from "@/store/projectStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Save } from "lucide-react";
import { getStandardData } from "@/lib/certification-data";
import { ImageUploader } from "@/components/certification/ImageUploader";

export const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentProject, setCurrentProject, updateProject, projects } = useProjectStore();
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [otherAutomationText, setOtherAutomationText] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id && projects.length > 0) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
        setSelectedOptions(project.criteriaSelections || {});
        setOtherAutomationText(project.otherAutomationDetails || {});
      }
    }
  }, [id, projects, setCurrentProject]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  const standardData = getStandardData(
    currentProject.certificationStandard,
    currentProject.buildingType
  );

  const getCriterionScore = (criterionId: string): number => {
    const criterion = [...standardData.mandatoryCriteria, ...standardData.creditCriteria]
      .find(c => c.id === criterionId);
    
    if (!criterion || criterion.type === 'Mandatory') return 0;
    
    const selection = selectedOptions[criterionId];
    if (!selection) return 0;

    if (criterion.selectionType === 'single-checkbox') {
      return selection === true ? criterion.maxPoints : 0;
    } else if (criterion.selectionType === 'dropdown') {
      const option = criterion.options?.find(opt => opt.label === selection);
      return option?.points || 0;
    } else if (criterion.selectionType === 'multiple-checkbox') {
      if (Array.isArray(selection)) {
        let total = 0;
        selection.forEach(selected => {
          const option = criterion.options?.find(opt => opt.label === selected);
          if (option) total += option.points;
        });
        return Math.min(total, criterion.maxPoints);
      }
    }
    return 0;
  };

  const { currentScore, certificationLevel, levelColor } = useMemo(() => {
    let score = 0;
    standardData.creditCriteria.forEach(criterion => {
      score += getCriterionScore(criterion.id);
    });

    let level = 'Not Certified';
    let color = 'default';
    
    for (const lvl of standardData.levels) {
      if (score >= lvl.minScore) {
        level = lvl.name;
        color = lvl.color;
      }
    }

    return { currentScore: score, certificationLevel: level, levelColor: color };
  }, [selectedOptions, standardData]);

  const handleSelectionChange = async (criterionId: string, value: any) => {
    const newSelections = { ...selectedOptions, [criterionId]: value };
    setSelectedOptions(newSelections);
    
    await updateProject(currentProject.id, {
      criteriaSelections: newSelections
    });
  };

  const handleOtherTextChange = async (criterionId: string, text: string) => {
    const newDetails = { ...otherAutomationText, [criterionId]: text };
    setOtherAutomationText(newDetails);
    
    await updateProject(currentProject.id, {
      otherAutomationDetails: newDetails
    });
  };

  const handleSave = async () => {
    toast({
      title: "Progress Saved",
      description: "Your certification data has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader 
        title={currentProject.title}
        showBack
        onBack={() => navigate('/dashboard')}
        rightAction={
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSave}
            className="h-8 w-8 p-0"
          >
            <Save className="h-4 w-4" />
          </Button>
        }
      />

      <main className="px-mobile py-6 space-y-6">
        {/* Score Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-elevated sticky top-16 z-40 bg-card/95 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Project Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {currentScore} / {standardData.maxScore} Points
                  </span>
                </div>
                <Progress value={(currentScore / standardData.maxScore) * 100} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Certification Level:</span>
                <Badge 
                  variant={levelColor === 'default' ? 'secondary' : 'default'}
                  className="font-semibold"
                  style={{ 
                    backgroundColor: levelColor !== 'default' ? `hsl(var(--${levelColor}))` : undefined 
                  }}
                >
                  {certificationLevel}
                </Badge>
              </div>

              <div className="pt-3 border-t border-border space-y-1">
                {standardData.levels.map(level => (
                  <div key={level.name} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{level.name}</span>
                    <span className="text-foreground">{level.minScore}+ pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mandatory Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-destructive" />
            Mandatory Requirements
          </h2>
          <Accordion type="multiple" className="space-y-3">
            {standardData.mandatoryCriteria.map((criterion) => (
              <AccordionItem key={criterion.id} value={criterion.id} className="border-0">
                <Card className="shadow-card">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <CheckCircle2 className="h-5 w-5 text-destructive shrink-0" />
                      <span className="font-medium text-foreground">{criterion.name}</span>
                      <Badge variant="secondary" className="ml-auto">Mandatory</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-muted-foreground">{criterion.requirements}</p>
                      <ImageUploader 
                        projectId={currentProject.id}
                        criterionId={criterion.id}
                      />
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Credit Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Credit Criteria
          </h2>
          <Accordion type="multiple" className="space-y-3">
            {standardData.creditCriteria.map((criterion) => {
              const score = getCriterionScore(criterion.id);
              const isAchieved = score > 0;

              return (
                <AccordionItem key={criterion.id} value={criterion.id} className="border-0">
                  <Card className="shadow-card">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3 text-left flex-1">
                        <CheckCircle2 
                          className={`h-5 w-5 shrink-0 ${isAchieved ? 'text-success' : 'text-muted-foreground'}`} 
                        />
                        <span className="font-medium text-foreground flex-1">{criterion.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="shrink-0">
                            {score} / {criterion.maxPoints}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">{criterion.requirements}</p>
                        
                        {/* Render appropriate input based on selectionType */}
                        {criterion.selectionType === 'single-checkbox' && (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={criterion.id}
                              checked={selectedOptions[criterion.id] === true}
                              onCheckedChange={(checked) => handleSelectionChange(criterion.id, checked)}
                            />
                            <Label htmlFor={criterion.id} className="text-sm font-normal">
                              Achieved ({criterion.maxPoints} point{criterion.maxPoints > 1 ? 's' : ''})
                            </Label>
                          </div>
                        )}

                        {criterion.selectionType === 'dropdown' && (
                          <Select 
                            value={selectedOptions[criterion.id] || ''}
                            onValueChange={(value) => handleSelectionChange(criterion.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {criterion.options?.map(option => (
                                <SelectItem key={option.label} value={option.label}>
                                  {option.label} ({option.points} pt{option.points > 1 ? 's' : ''})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {criterion.selectionType === 'multiple-checkbox' && (
                          <div className="space-y-2">
                            {criterion.options?.map(option => (
                              <div key={option.label} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`${criterion.id}-${option.label}`}
                                  checked={(selectedOptions[criterion.id] || []).includes(option.label)}
                                  onCheckedChange={(checked) => {
                                    const current = selectedOptions[criterion.id] || [];
                                    const updated = checked
                                      ? [...current, option.label]
                                      : current.filter((item: string) => item !== option.label);
                                    handleSelectionChange(criterion.id, updated);
                                  }}
                                />
                                <Label htmlFor={`${criterion.id}-${option.label}`} className="text-sm font-normal">
                                  {option.label} ({option.points} pt{option.points > 1 ? 's' : ''})
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}

                        <ImageUploader 
                          projectId={currentProject.id}
                          criterionId={criterion.id}
                        />
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </main>
    </div>
  );
};