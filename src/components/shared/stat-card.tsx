import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend?: { value: string; direction: "up" | "down"; label?: string };
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({ label, value, trend, icon: Icon, iconColor, iconBg, className }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        {Icon && (
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg ?? "bg-primary-50")}>
            <Icon className={cn("w-4 h-4", iconColor ?? "text-primary-600")} />
          </div>
        )}
      </div>
      <p className="text-2xl font-extrabold text-neutral-900 mb-1.5">{value}</p>
      {trend && (
        <div className="flex items-center gap-1.5">
          {trend.direction === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-success-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
          )}
          <span className={cn("text-xs font-semibold", trend.direction === "up" ? "text-success-600" : "text-danger-600")}>
            {trend.value}
          </span>
          {trend.label && <span className="text-xs text-neutral-400">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
