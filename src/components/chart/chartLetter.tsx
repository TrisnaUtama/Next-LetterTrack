"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllLetter } from "@/hooks/letter/letterAction";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  internal: {
    label: "Internal",
    color: "#019BE1",
  },
  external: {
    label: "External",
    color: "#66B82F",
  },
} satisfies ChartConfig;

export default function ChartLetter() {
  const [letterData, setLetterData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllLetter();
      const formattedData = formatChartData(res.data);
      setLetterData(formattedData);
    };
    fetchData();
  }, []);

  const formatChartData = (letters: any[]) => {
    const monthlyData: any = {};

    letters.forEach((letter) => {
      const monthYear = new Date(letter.letter_date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          internal: 0,
          external: 0,
        };
      }

      if (letter.letter_type_id === 1) {
        monthlyData[monthYear].internal++;
      } else if (letter.letter_type_id === 2) {
        monthlyData[monthYear].external++;
      }
    });

    return Object.keys(monthlyData).map((monthYear) => ({
      month: monthYear,
      internal: monthlyData[monthYear].internal,
      external: monthlyData[monthYear].external,
    }));
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle>Letter Type Chart</CardTitle>
        <CardDescription>
          Showing the amount of letters type per month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={letterData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="internal"
                fill={chartConfig.internal.color}
                radius={4}
              />
              <Bar
                dataKey="external"
                fill={chartConfig.external.color}
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing letter status by month
        </div>
      </CardFooter>
    </Card>
  );
}
