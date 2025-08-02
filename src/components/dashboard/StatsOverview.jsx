import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsOverview({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "stable",
  bgGradient = "from-blue-500 to-blue-600"
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-slate-500";
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
      
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}