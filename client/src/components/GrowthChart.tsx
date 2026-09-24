import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GrowthRecord } from "../context/PediatricContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart as LineChartIcon } from "lucide-react";

interface GrowthChartProps {
  records: GrowthRecord[];
}

export function GrowthChart({ records }: GrowthChartProps) {
  if (!records || records.length === 0) {
    return (
      <Card className="rounded-2xl border-white/10 bg-card solaris-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center">
            <LineChartIcon className="w-5 h-5 mr-2 text-primary" />
            Growth Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No growth records available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const data = records.map(r => ({
    date: new Date(r.date).toLocaleDateString(undefined, {
      year: "2-digit",
      month: "short",
    }),
    height: r.heightCm,
    weight: r.weightKg,
    percentileH: r.percentileHeight,
    percentileW: r.percentileWeight,
  }));

  return (
    <Card className="rounded-2xl border-white/10 bg-card solaris-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <LineChartIcon className="w-5 h-5 mr-2 text-primary" />
          Growth Tracking (Percentiles)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Height (cm)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Weight (kg)",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="height"
                stroke="#fff"
                name="Height (cm)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weight"
                stroke="#22c55e"
                name="Weight (kg)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-muted p-3 border border-border text-center">
            <div className="text-xs text-muted-foreground uppercase">
              Latest Height
            </div>
            <div className="text-lg font-bold text-primary">
              {records[records.length - 1].heightCm} cm
            </div>
            <div className="text-xs text-muted-foreground">
              {records[records.length - 1].percentileHeight}th percentile
            </div>
          </div>
          <div className="bg-muted p-3 border border-border text-center">
            <div className="text-xs text-muted-foreground uppercase">
              Latest Weight
            </div>
            <div className="text-lg font-bold text-primary">
              {records[records.length - 1].weightKg} kg
            </div>
            <div className="text-xs text-muted-foreground">
              {records[records.length - 1].percentileWeight}th percentile
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
