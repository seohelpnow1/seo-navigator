import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lightbulb } from 'lucide-react';

export default function Recommendations({ recommendations }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          Top Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-slate-700">{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-slate-600">
            No specific recommendations at this time.
          </div>
        )}
      </CardContent>
    </Card>
  );
}