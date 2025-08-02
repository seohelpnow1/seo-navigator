import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KeywordPerformance({ keywords, isLoading }) {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Search className="w-5 h-5 text-blue-600" />
          Keyword Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="w-4 h-4 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : keywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-slate-600">
                  No keywords tracked yet.
                </TableCell>
              </TableRow>
            ) : (
              keywords.slice(0, 5).map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium text-slate-800">{keyword.keyword}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      {keyword.current_rank || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{keyword.search_volume}</TableCell>
                  <TableCell>{keyword.difficulty}</TableCell>
                  <TableCell>{getTrendIcon(keyword.trend)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}