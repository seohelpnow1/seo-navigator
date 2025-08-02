import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KeywordTable({ keywords, isLoading }) {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "down": return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-slate-400" />;
    }
  };

  const categoryColors = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    'long-tail': "bg-green-100 text-green-800",
    competitor: "bg-orange-100 text-orange-800"
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Target className="w-5 h-5 text-blue-600" />
          Tracked Keywords
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="w-5 h-5 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : (
              keywords.map(keyword => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell><Badge className={categoryColors[keyword.category]}>{keyword.category}</Badge></TableCell>
                  <TableCell>{keyword.search_volume}</TableCell>
                  <TableCell>{keyword.difficulty}</TableCell>
                  <TableCell>{keyword.current_rank || "N/A"}</TableCell>
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