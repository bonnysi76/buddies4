"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function TrendingTopics() {
  const trendingTopics = [
    {
      id: 1,
      topic: "#MachineLearning",
      posts: 1243,
    },
    {
      id: 2,
      topic: "#StudyTips",
      posts: 876,
    },
    {
      id: 3,
      topic: "#Internships",
      posts: 654,
    },
    {
      id: 4,
      topic: "#ResearchPapers",
      posts: 542,
    },
    {
      id: 5,
      topic: "#CampusLife",
      posts: 421,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <TrendingUp className="mr-2 h-4 w-4" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="flex items-center justify-between text-sm">
              <Button variant="link" className="p-0 h-auto font-normal">
                {topic.topic}
              </Button>
              <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

