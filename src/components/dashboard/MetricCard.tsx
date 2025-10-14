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
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">{value}</p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "p-3 sm:p-3.5 md:p-4 rounded-xl flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "success" && "bg-success/10 text-success",
            variant === "warning" && "bg-warning/10 text-warning",
            variant === "default" && "bg-muted"
          )}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 mr-1.5 text-success flex-shrink-0" />
            <span className="text-success font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
