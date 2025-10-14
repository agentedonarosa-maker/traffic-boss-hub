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
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-foreground break-words">{value}</p>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "p-2 sm:p-2.5 rounded-lg flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "success" && "bg-success/10 text-success",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "default" && "bg-muted"
          )}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-2 sm:mt-3 flex items-center text-[10px] sm:text-xs">
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-success flex-shrink-0" />
            <span className="text-success font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
