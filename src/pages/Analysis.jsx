import React, { useState } from "react";
import { Website, SeoIssue } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Globe, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  TrendingUp,
  Zap
} from "lucide-react";

import AnalysisForm from "../components/analysis/AnalysisForm";
import ScoreCard from "../components/analysis/ScoreCard";
import IssuesList from "../components/analysis/IssuesList";
import Recommendations from "../components/analysis/Recommendations";

export default function Analysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeWebsite = async (url) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Clean URL
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Use LLM to analyze the website
      const analysisPrompt = `
        Analyze the SEO performance of the website: ${cleanUrl}
        
        Please provide a comprehensive SEO analysis including:
        1. Overall SEO score (0-100)
        2. Performance score (0-100) 
        3. Accessibility score (0-100)
        4. Best practices score (0-100)
        5. List of specific SEO issues found
        6. Recommendations for improvement
        
        For each issue, include:
        - Title of the issue
        - Description
        - Severity (critical, warning, info)
        - Category (technical, content, performance, accessibility, meta)
        - How to fix it
        - Impact score (0-10)
      `;

      const result = await InvokeLLM({
        prompt: analysisPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            website_info: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                seo_score: { type: "number" },
                performance_score: { type: "number" },
                accessibility_score: { type: "number" },
                best_practices_score: { type: "number" }
              }
            },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  severity: { type: "string" },
                  category: { type: "string" },
                  fix_suggestion: { type: "string" },
                  impact_score: { type: "number" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Save website to database
      const website = await Website.create({
        url: cleanUrl,
        title: result.website_info?.title || 'Unknown Title',
        description: result.website_info?.description || '',
        seo_score: result.website_info?.seo_score || 0,
        performance_score: result.website_info?.performance_score || 0,
        accessibility_score: result.website_info?.accessibility_score || 0,
        best_practices_score: result.website_info?.best_practices_score || 0,
        status: 'completed',
        last_analyzed: new Date().toISOString()
      });

      // Save issues to database
      if (result.issues && result.issues.length > 0) {
        for (const issue of result.issues) {
          await SeoIssue.create({
            website_id: website.id,
            title: issue.title,
            description: issue.description,
            severity: issue.severity,
            category: issue.category,
            fix_suggestion: issue.fix_suggestion,
            impact_score: issue.impact_score || 5
          });
        }
      }

      setAnalysisResult({
        website,
        issues: result.issues || [],
        recommendations: result.recommendations || []
      });

    } catch (err) {
      setError('Failed to analyze website. Please check the URL and try again.');
      console.error('Analysis error:', err);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Website SEO Analysis</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Get comprehensive insights into your website's SEO performance and receive 
            actionable recommendations to improve your search rankings.
          </p>
        </div>

        {/* Analysis Form */}
        <AnalysisForm onAnalyze={analyzeWebsite} isLoading={isAnalyzing} />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing Your Website</h3>
                  <p className="text-slate-600">This may take a few moments while we examine your site's SEO performance...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Score Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard
                title="SEO Score"
                score={analysisResult.website.seo_score}
                icon={TrendingUp}
                color="blue"
              />
              <ScoreCard
                title="Performance"
                score={analysisResult.website.performance_score}
                icon={Zap}
                color="green"
              />
              <ScoreCard
                title="Accessibility"
                score={analysisResult.website.accessibility_score}
                icon={CheckCircle}
                color="purple"
              />
              <ScoreCard
                title="Best Practices"
                score={analysisResult.website.best_practices_score}
                icon={Globe}
                color="orange"
              />
            </div>

            {/* Issues and Recommendations */}
            <div className="grid lg:grid-cols-2 gap-8">
              <IssuesList issues={analysisResult.issues} />
              <Recommendations recommendations={analysisResult.recommendations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}