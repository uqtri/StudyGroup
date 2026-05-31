import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../common/Card';
import { useChartColors } from '../../hooks/useChartColors';

export const BarChartCard = ({ title, data, dataKey = 'value', nameKey = 'name' }) => {
  const colors = useChartColors();

  return (
    <Card title={title}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.accent} />
                <stop offset="100%" stopColor={colors.secondary} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis dataKey={nameKey} tick={{ fontSize: 12, fill: colors.tooltipText }} />
            <YAxis tick={{ fontSize: 12, fill: colors.tooltipText }} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.grid}`,
                borderRadius: '12px',
                color: colors.tooltipText,
              }}
            />
            <Bar dataKey={dataKey} fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
