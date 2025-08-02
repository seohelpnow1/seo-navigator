import React from 'react';
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentAnalyses({ websites, isLoading }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Globe className="w-5 h-5 text-blue-600" />
          Recent Website Analyses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : websites.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No websites analyzed yet</h3>
            <p className="text-slate-600">Start by analyzing your first website to see SEO insights here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {websites.slice(0, 5).map((website) => (
              <div key={website.id} className="group p-4 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getScoreBgColor(website.seo_score)} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">{website.seo_score}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 truncate">{website.title}</h4>
                      <a 
                        href={website.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{website.url}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>Performance: {website.performance_score}</span>
                      <span>•</span>
                      <span>Analyzed {format(new Date(website.last_analyzed), "MMM d")}</span>
                    </div>
                  </div>
                  
                  <Badge className={`${getScoreColor(website.seo_score)} border font-medium`}>
                    {website.seo_score >= 80 ? 'Excellent' : 
                     website.seo_score >= 60 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}