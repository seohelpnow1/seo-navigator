import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";

export default function IssuesSummary({ issues, isLoading }) {
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');

  const severityStyles = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Issues Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{criticalIssues.length}</p>
                <p className="text-sm text-red-700">Critical</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{warningIssues.length}</p>
                <p className="text-sm text-yellow-700">Warnings</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Top Priority Issues:</h4>
              {criticalIssues.length > 0 ? (
                criticalIssues.slice(0, 3).map(issue => (
                  <div key={issue.id} className="p-3 border rounded-lg bg-slate-50/50">
                    <p className="font-medium text-sm text-slate-900">{issue.title}</p>
                    <Badge variant="outline" className={`mt-1 text-xs ${severityStyles[issue.severity]}`}>
                      {issue.severity}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600 text-center py-4">No critical issues found. Great job!</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}