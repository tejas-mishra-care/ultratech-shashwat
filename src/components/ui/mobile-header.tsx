import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu, User } from "lucide-react";
import { motion } from "framer-motion";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  rightAction?: React.ReactNode;
}

export const MobileHeader = ({ 
  title, 
  showBack, 
  onBack, 
  showMenu, 
  onMenuToggle,
  rightAction 
}: MobileHeaderProps) => {
  return (
    <motion.header 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between h-14 px-mobile">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {rightAction || (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};