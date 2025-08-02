import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function KeywordForm({ websites, onSubmit, onCancel }) {
  const [keywordData, setKeywordData] = useState({
    keyword: '',
    website_id: '',
    current_rank: '',
    target_rank: '10',
    category: 'primary'
  });

  const handleChange = (field, value) => {
    setKeywordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...keywordData,
      current_rank: keywordData.current_rank ? parseInt(keywordData.current_rank) : null,
      target_rank: keywordData.target_rank ? parseInt(keywordData.target_rank) : null
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Plus className="w-5 h-5 text-blue-600" />
          Add New Keyword
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keyword">Keyword</Label>
              <Input id="keyword" value={keywordData.keyword} onChange={(e) => handleChange('keyword', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="website">Associate with Website</Label>
              <Select onValueChange={(value) => handleChange('website_id', value)}>
                <SelectTrigger id="website"><SelectValue placeholder="Select website" /></SelectTrigger>
                <SelectContent>
                  {websites.map(site => <SelectItem key={site.id} value={site.id}>{site.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="current_rank">Current Rank</Label>
              <Input id="current_rank" type="number" value={keywordData.current_rank} onChange={(e) => handleChange('current_rank', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="target_rank">Target Rank</Label>
              <Input id="target_rank" type="number" value={keywordData.target_rank} onChange={(e) => handleChange('target_rank', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={keywordData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="long-tail">Long-tail</SelectItem>
                  <SelectItem value="competitor">Competitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Add Keyword</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}