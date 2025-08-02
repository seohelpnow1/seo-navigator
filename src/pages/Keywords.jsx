import React, { useState, useEffect } from "react";
import { Keyword, Website } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Plus,
  Target,
  Zap
} from "lucide-react";

import KeywordForm from "../components/keywords/KeywordForm";
import KeywordTable from "../components/keywords/KeywordTable";
import KeywordInsights from "../components/keywords/KeywordInsights";

export default function Keywords() {
  const [keywords, setKeywords] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isResearching, setIsResearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [keywordsData, websitesData] = await Promise.all([
        Keyword.list('-created_date'),
        Website.list('-created_date')
      ]);
      setKeywords(keywordsData);
      setWebsites(websitesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleAddKeyword = async (keywordData) => {
    try {
      await Keyword.create(keywordData);
      loadData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding keyword:', error);
    }
  };

  const researchKeywords = async (seedKeyword) => {
    setIsResearching(true);
    try {
      const prompt = `
        Research and suggest keyword opportunities for: "${seedKeyword}"
        
        Provide 10-15 related keywords with the following information:
        - The keyword phrase
        - Estimated monthly search volume (number)
        - Keyword difficulty (0-100 scale)
        - Category (primary, secondary, long-tail)
        - Brief explanation of why this keyword is valuable
        
        Focus on a mix of high-volume competitive keywords and lower-volume long-tail opportunities.
      `;

      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  search_volume: { type: "number" },
                  difficulty: { type: "number" },
                  category: { type: "string" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Add researched keywords to database
      if (result.keywords) {
        for (const kw of result.keywords) {
          await Keyword.create({
            keyword: kw.keyword,
            search_volume: kw.search_volume,
            difficulty: kw.difficulty,
            category: kw.category || 'secondary',
            current_rank: null,
            target_rank: 10,
            trend: 'stable'
          });
        }
        loadData();
      }
    } catch (error) {
      console.error('Error researching keywords:', error);
    }
    setIsResearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Keyword Research</h1>
            <p className="text-slate-600 text-lg">Discover and track keywords to improve your search rankings</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowForm(!showForm)}
              className="border-slate-200 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Keyword
            </Button>
          </div>
        </div>

        {/* Keyword Research Tool */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Search className="w-5 h-5 text-blue-600" />
              Keyword Research Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordResearchForm onResearch={researchKeywords} isLoading={isResearching} />
          </CardContent>
        </Card>

        {/* Add Keyword Form */}
        {showForm && (
          <KeywordForm 
            websites={websites}
            onSubmit={handleAddKeyword}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <KeywordTable keywords={keywords} isLoading={isLoading} />
          </div>
          <div>
            <KeywordInsights keywords={keywords} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KeywordResearchForm({ onResearch, isLoading }) {
  const [seedKeyword, setSeedKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (seedKeyword.trim()) {
      onResearch(seedKeyword.trim());
      setSeedKeyword('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        placeholder="Enter a seed keyword (e.g., 'digital marketing')"
        value={seedKeyword}
        onChange={(e) => setSeedKeyword(e.target.value)}
        className="flex-1 border-slate-300 focus:border-blue-500"
        disabled={isLoading}
      />
      <Button 
        type="submit"
        disabled={!seedKeyword.trim() || isLoading}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      >
        {isLoading ? (
          <>
            <Zap className="w-4 h-4 mr-2 animate-pulse" />
            Researching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Research
          </>
        )}
      </Button>
    </form>
  );
}