"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getAllLetter } from "@/hooks/letter/letterAction";

const chartConfig = {
  on_progress: {
    label: "On Progress",
    color: "#66B82F",
  },
  finish: {
    label: "Finish",
    color: "#019BE1",
  },
} satisfies ChartConfig;

export function ChartLetterStatus() {
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
          on_progress: 0,
          finish: 0,
        };
      }

      if (letter.status === "ON_PROGRESS") {
        monthlyData[monthYear].on_progress++;
      } else if (letter.status === "FINISH") {
        monthlyData[monthYear].finish++;
      }
    });

    return Object.keys(monthlyData).map((monthYear) => ({
      month: monthYear,
      on_progress: monthlyData[monthYear].on_progress,
      finish: monthlyData[monthYear].finish,
    }));
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle>Letter Status</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={letterData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="on_progress" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Bar
              dataKey="on_progress"
              layout="vertical"
              fill={chartConfig.on_progress.color}
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="on_progress"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>

            <Bar
              dataKey="finish"
              layout="vertical"
              fill={chartConfig.finish.color}
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="finish"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total letter status by month
        </div>
      </CardFooter>
    </Card>
  );
}
