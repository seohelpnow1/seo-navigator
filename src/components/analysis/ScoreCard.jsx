import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ScoreCard({ title, score, icon: Icon, color = "blue" }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 text-blue-600",
      green: "from-green-500 to-emerald-600 text-green-600", 
      purple: "from-purple-500 to-purple-600 text-purple-600",
      orange: "from-orange-500 to-orange-600 text-orange-600"
    };
    return colors[color] || colors.blue;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const colorClasses = getColorClasses(color);
  const gradientClass = colorClasses.split(' ')[0] + ' ' + colorClasses.split(' ')[1];
  const textClass = colorClasses.split(' ')[2];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700">{title}</h3>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientClass} shadow-md`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-3xl font-bold text-slate-900">
            <span className={getScoreColor(score)}>{score}</span>
            <span className="text-lg text-slate-500">/100</span>
          </div>
          
          <Progress 
            value={score} 
            className="h-2" 
          />
          
          <p className="text-sm text-slate-600">
            {score >= 80 ? 'Excellent' : 
             score >= 60 ? 'Good' : 
             score >= 40 ? 'Needs Improvement' : 'Poor'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}