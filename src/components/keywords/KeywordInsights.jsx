import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function KeywordInsights({ keywords }) {
  const top10Keywords = keywords.filter(k => k.current_rank <= 10).length;
  const avgDifficulty = keywords.length > 0
    ? Math.round(keywords.reduce((sum, k) => sum + (k.difficulty || 0), 0) / keywords.length)
    : 0;
  
  const categoryCounts = keywords.reduce((acc, kw) => {
    acc[kw.category] = (acc[kw.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          Keyword Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">Keywords in Top 10</span>
            <span className="font-bold text-lg text-green-600">{top10Keywords}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-700">Avg. Difficulty</span>
            <span className="font-bold text-lg text-blue-600">{avgDifficulty}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            Category Distribution
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Quick Tips
          </h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>Focus on keywords with low difficulty for quick wins.</li>
            <li>Target long-tail keywords to capture specific user intent.</li>
            <li>Monitor competitor keywords for strategic opportunities.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}