import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  AreaChart, Area,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Layers } from 'lucide-react';

export type ChartType = 'bar' | 'pie' | 'line' | 'area';

interface ChartCardProps {
  title: string;
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  height?: number;
  defaultType?: ChartType;
  noDataText?: string;
  barFill?: string;
}

const CHART_TYPES: { type: ChartType; icon: typeof BarChart3; label: string }[] = [
  { type: 'bar', icon: BarChart3, label: 'Bar' },
  { type: 'pie', icon: PieChartIcon, label: 'Pie' },
  { type: 'line', icon: TrendingUp, label: 'Line' },
  { type: 'area', icon: Layers, label: 'Area' },
];

const DEFAULT_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export default function ChartCard({
  title,
  data,
  dataKey,
  nameKey = 'name',
  colors = DEFAULT_COLORS,
  height = 300,
  defaultType = 'bar',
  noDataText = 'No data available',
  barFill,
}: ChartCardProps) {
  const [chartType, setChartType] = useState<ChartType>(defaultType);

  const fillColor = barFill || colors[0];

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={Math.min(height * 0.33, 110)} dataKey={dataKey} nameKey={nameKey} label>
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={fillColor} strokeWidth={2} dot={{ r: 4, fill: fillColor }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke={fillColor} fill={fillColor} fillOpacity={0.2} />
          </AreaChart>
        );
      default: // bar
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={fillColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
          {CHART_TYPES.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setChartType(type)}
              title={label}
              className={`p-1.5 rounded-md transition-all ${
                chartType === type
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      ) : (
        <p className="text-muted-foreground text-sm py-10 text-center">{noDataText}</p>
      )}
    </div>
  );
}
