import React, { useState, useEffect } from "react";
import { Website, Keyword, SeoIssue } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FileText, TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

export default function Reports() {
  const [websites, setWebsites] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [websitesData, keywordsData, issuesData] = await Promise.all([
        Website.list('-created_date'),
        Keyword.list('-created_date'),
        SeoIssue.list('-created_date')
      ]);
      setWebsites(websitesData);
      setKeywords(keywordsData);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  // Prepare chart data
  const scoreData = websites.map((site, index) => ({
    name: site.title?.substring(0, 20) + '...' || `Site ${index + 1}`,
    seo: site.seo_score || 0,
    performance: site.performance_score || 0,
    accessibility: site.accessibility_score || 0,
    bestPractices: site.best_practices_score || 0
  }));

  const issuesByCategory = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {});

  const issuesChartData = Object.entries(issuesByCategory).map(([category, count]) => ({
    name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));

  const keywordDifficultyData = keywords.reduce((acc, keyword) => {
    const difficulty = keyword.difficulty || 0;
    let range;
    if (difficulty <= 25) range = 'Easy (0-25)';
    else if (difficulty <= 50) range = 'Medium (26-50)';
    else if (difficulty <= 75) range = 'Hard (51-75)';
    else range = 'Very Hard (76-100)';
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const difficultyChartData = Object.entries(keywordDifficultyData).map(([range, count]) => ({
    name: range,
    keywords: count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">SEO Reports</h1>
            <p className="text-slate-600 text-lg">Comprehensive analytics and insights for your SEO performance</p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 bg-white border-slate-200">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* SEO Scores Comparison */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                SEO Scores by Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="seo" fill="#3B82F6" name="SEO Score" />
                    <Bar dataKey="performance" fill="#10B981" name="Performance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Issues by Category */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                Issues by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issuesChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {issuesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Difficulty Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Keyword Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="keywords" fill="#8B5CF6" name="Keywords" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <FileText className="w-5 h-5 text-blue-600" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{websites.length}</div>
                    <div className="text-sm text-slate-600">Websites Tracked</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{keywords.length}</div>
                    <div className="text-sm text-slate-600">Keywords Monitored</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{issues.length}</div>
                    <div className="text-sm text-slate-600">Issues Identified</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {websites.length > 0 ? Math.round(websites.reduce((sum, site) => sum + (site.seo_score || 0), 0) / websites.length) : 0}
                    </div>
                    <div className="text-sm text-slate-600">Avg SEO Score</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}