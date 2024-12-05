"use client";

import React, { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { Label, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"; // Import Cell

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

import {
  getAllEmployees,
  Employee,
  FetchEmployeesResult,
} from "@/hooks/employee/employeesAction";
import { Button } from "../ui/button";

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ChartEmployee() {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [genderData, setGenderData] = useState<{
    male: number;
    female: number;
  }>({
    male: 0,
    female: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: FetchEmployeesResult = await getAllEmployees();
        if (res.success) {
          setEmployee(res.data);
          const maleCount = res.data.filter(
            (emp: Employee) => emp.gender === "MALE"
          ).length;
          const femaleCount = res.data.filter(
            (emp: Employee) => emp.gender === "FEMALE"
          ).length;
          setGenderData({ male: maleCount, female: femaleCount });
        } else {
          setEmployee([]);
          setGenderData({ male: 0, female: 0 });
        }
      } catch (error: any) {
        console.log(error.message);
        setEmployee([]);
        setGenderData({ male: 0, female: 0 });
      }
    };

    fetchData();
  }, []);

  const pieChartData = [
    {
      name: "Male",
      value: genderData.male,
      color: chartConfig.male.color,
    },
    {
      name: "Female",
      value: genderData.female,
      color: chartConfig.female.color,
    },
  ];

  return (
    <Card className="h-96">
      <CardHeader className="items-center pb-0">
        <CardTitle>Employee Gender Distribution</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
                paddingAngle={5}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Male" ? "#019BE1" : "#66B82F"}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {employee.length.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Employees
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total employees for Angkasa Pura I
        </div>
      </CardFooter>
    </Card>
  );
}
