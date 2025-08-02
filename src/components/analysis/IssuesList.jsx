import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from 'lucide-react';

export default function IssuesList({ issues }) {
  const severityStyles = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Identified SEO Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {issues.map((issue, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="text-left font-medium">{issue.title}</span>
                    <Badge className={severityStyles[issue.severity]}>{issue.severity}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p className="text-slate-600">{issue.description}</p>
                  <div>
                    <h5 className="font-semibold text-slate-800">Recommendation:</h5>
                    <p className="text-slate-600">{issue.fix_suggestion}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-slate-600">
            No specific issues found. Your SEO looks solid!
          </div>
        )}
      </CardContent>
    </Card>
  );
}