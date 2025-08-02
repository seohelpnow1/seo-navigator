import React, { useState, useEffect } from "react";
import { Website, Keyword, SeoIssue } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  Globe, 
  Search, 
  AlertTriangle,
  Plus,
  BarChart3,
  Zap,
  Target
} from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentAnalyses from "../components/dashboard/RecentAnalyses";
import KeywordPerformance from "../components/dashboard/KeywordPerformance";
import IssuesSummary from "../components/dashboard/IssuesSummary";

export default function Dashboard() {
  const [websites, setWebsites] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [websitesData, keywordsData, issuesData] = await Promise.all([
        Website.list('-created_date', 10),
        Keyword.list('-created_date', 20),
        SeoIssue.list('-created_date', 20)
      ]);
      
      setWebsites(websitesData);
      setKeywords(keywordsData);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const avgScore = websites.length > 0 
    ? Math.round(websites.reduce((sum, site) => sum + (site.seo_score || 0), 0) / websites.length)
    : 0;

  const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
  const topKeywords = keywords.filter(k => k.current_rank <= 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">SEO Dashboard</h1>
            <p className="text-slate-600 text-lg">Monitor and optimize your website's search performance</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Keywords")} className="flex-1 lg:flex-none">
              <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50">
                <Search className="w-4 h-4 mr-2" />
                Research Keywords
              </Button>
            </Link>
            <Link to={createPageUrl("Analysis")} className="flex-1 lg:flex-none">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Analyze Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsOverview
            title="Websites Tracked"
            value={websites.length}
            change="+12% this month"
            icon={Globe}
            trend="up"
            bgGradient="from-blue-500 to-blue-600"
          />
          <StatsOverview
            title="Average SEO Score"
            value={avgScore}
            change={avgScore > 70 ? "Excellent" : avgScore > 50 ? "Good" : "Needs Work"}
            icon={BarChart3}
            trend={avgScore > 70 ? "up" : "stable"}
            bgGradient="from-green-500 to-emerald-600"
          />
          <StatsOverview
            title="Top 10 Keywords"
            value={topKeywords}
            change={`${keywords.length} total tracked`}
            icon={Target}
            trend="up"
            bgGradient="from-purple-500 to-purple-600"
          />
          <StatsOverview
            title="Critical Issues"
            value={criticalIssues}
            change={criticalIssues > 0 ? "Needs attention" : "All good"}
            icon={AlertTriangle}
            trend={criticalIssues > 0 ? "down" : "up"}
            bgGradient="from-amber-500 to-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentAnalyses websites={websites} isLoading={isLoading} />
            <KeywordPerformance keywords={keywords} isLoading={isLoading} />
          </div>
          
          <div className="space-y-8">
            <IssuesSummary issues={issues} isLoading={isLoading} />
            
            {/* Quick Actions Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to={createPageUrl("Analysis")}>
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                    <Globe className="w-4 h-4 mr-2" />
                    Analyze New Website
                  </Button>
                </Link>
                <Link to={createPageUrl("Keywords")}>
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                    <Search className="w-4 h-4 mr-2" />
                    Research Keywords
                  </Button>
                </Link>
                <Link to={createPageUrl("Reports")}>
                  <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}