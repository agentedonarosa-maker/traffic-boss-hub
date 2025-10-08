import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: string;
  variant?: "default" | "success" | "warning" | "primary";
}

export function MetricCard({ title, value, icon, subtitle, trend, variant = "default" }: MetricCardProps) {
  const variants = {
    default: "bg-card",
    primary: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
    warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
  };

  return (
    <Card className={cn("shadow-card backdrop-blur-sm transition-all duration-200 hover:shadow-lg", variants[variant])}>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1 sm:mt-2 truncate">{value}</p>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "p-2 sm:p-2.5 md:p-3 rounded-lg flex-shrink-0",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "success" && "bg-success/10 text-success",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "default" && "bg-muted"
          )}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-3 sm:mt-4 flex items-center text-[10px] sm:text-xs">
            <TrendingUp className="w-3 h-3 mr-1 text-success flex-shrink-0" />
            <span className="text-success font-medium truncate">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
