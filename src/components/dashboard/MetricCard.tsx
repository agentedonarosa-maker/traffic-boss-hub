import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative";
  icon?: React.ReactNode;
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "primary";
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  subtitle,
  variant = "default",
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-success text-success-foreground";
      case "primary":
        return "bg-gradient-primary text-primary-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-card text-card-foreground";
    }
  };

  return (
    <Card className={cn("p-6 shadow-card border-0", getVariantStyles())}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={cn(
                "p-2 rounded-lg",
                variant === "default" ? "bg-primary/10 text-primary" : "bg-white/20 text-current"
              )}>
                {icon}
              </div>
            )}
            <div>
              <p className={cn(
                "text-sm font-medium",
                variant === "default" ? "text-muted-foreground" : "text-current/80"
              )}>
                {title}
              </p>
              {subtitle && (
                <p className={cn(
                  "text-xs",
                  variant === "default" ? "text-muted-foreground" : "text-current/60"
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex items-end justify-between">
            <p className={cn(
              "text-3xl font-bold",
              variant === "default" ? "text-foreground" : "text-current"
            )}>
              {value}
            </p>
            
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                changeType === "positive" 
                  ? variant === "default" ? "text-success" : "text-current"
                  : variant === "default" ? "text-destructive" : "text-current/80"
              )}>
                {changeType === "positive" ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                {Math.abs(change)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}