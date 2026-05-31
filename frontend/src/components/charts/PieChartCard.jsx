import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';
import { useChartColors } from '../../hooks/useChartColors';

const FALLBACK = ['#2563eb', '#6366f1', '#06b6d4', '#22c55e', '#f59e0b'];

export const PieChartCard = ({ title, data }) => {
  const colors = useChartColors();
  const palette = [colors.accent, colors.secondary, '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <Card title={title}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data?.map((_, index) => (
                <Cell key={`cell-${index}`} fill={palette[index % palette.length] || FALLBACK[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.grid}`,
                borderRadius: '12px',
                color: colors.tooltipText,
              }}
            />
            <Legend wrapperStyle={{ color: colors.tooltipText }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
