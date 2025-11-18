
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Sector } from 'recharts';
import { EvaluationResult } from '../../types';

interface MonthlyCompletionData {
  month: string;
  completion: number;
}

export const CompletionLineChart: React.FC<{ data: MonthlyCompletionData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis unit="%" domain={[0, 'dataMax + 10']}/>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="completion" name="Tỷ lệ hoàn thành trung bình" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);


interface ComparisonData {
  name: string;
  completion: number;
}

export const ComparisonBarChart: React.FC<{ data: ComparisonData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" unit="%" domain={[0, 'dataMax + 10']}/>
      <YAxis type="category" dataKey="name" width={100} />
      <Tooltip />
      <Legend />
      <Bar dataKey="completion" name="Tỷ lệ hoàn thành" fill="#3b82f6" />
    </BarChart>
  </ResponsiveContainer>
);

interface StatusData {
  name: EvaluationResult;
  value: number;
}

const COLORS = {
  [EvaluationResult.EXCELLENT]: '#3b82f6',
  [EvaluationResult.GOOD]: '#10b981',
  [EvaluationResult.NEEDS_IMPROVEMENT]: '#f59e0b',
  [EvaluationResult.NOT_MET]: '#ef4444',
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} KPI`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const StatusPieChart: React.FC<{ data: StatusData[] }> = ({ data }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
            </Pie>
            <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
