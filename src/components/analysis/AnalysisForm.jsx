import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Globe, Loader2 } from "lucide-react";

export default function AnalysisForm({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
          <Globe className="w-6 h-6 text-blue-600" />
          Enter Website URL
        </CardTitle>
        <p className="text-slate-600 mt-2">
          We'll analyze your website's SEO performance and provide actionable insights
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!url.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-3 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Analyze Website
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}