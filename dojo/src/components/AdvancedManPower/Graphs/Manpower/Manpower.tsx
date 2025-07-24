import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface OperatorData {
  month: string;
  operator_availability_ctq: number;
  operator_required_ctq: number;
}

interface Props {
  factoryId: number | null;
  departmentId: number | null;
}

const ManpowerTrendChart: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<OperatorData[]>([]);
  const [filteredData, setFilteredData] = useState<OperatorData[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(560); // Default width

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('chart-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const CustomLegend = () => (
    <div
      style={{
        position: 'absolute',
        top: 25,
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '10px',
      }}
      className="bg-white rounded-full px-4 py-1 inline-flex gap-4 text-sm"
    >
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-[#339CFF] rounded-full" />
        <span>Required</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-[#1a365d] rounded-full" />
        <span>Available</span>
      </div>
    </div>
  );

  useEffect(() => {
    if (!factoryId || !departmentId) return;

    const url = `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${factoryId}&department_id=${departmentId}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const operatorTrend = json.operator_trend || [];
        const filtered = operatorTrend.filter(
          (item: OperatorData) =>
            !(
              item.operator_required_ctq === 0 &&
              item.operator_availability_ctq === 0
            )
        );
        setData(operatorTrend);
        setFilteredData(filtered);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, [factoryId, departmentId]);

  const formatMonth = (value: string) => {
    // On small screens, show only first 3 letters of month
    if (containerWidth < 400) {
      return value.split(' ')[0].substring(0, 3);
    }
    return value.split(' ')[0];
  };

  const getYearSpans = () => {
    const spans: { year: string; startIndex: number; endIndex: number }[] = [];
    filteredData.forEach((item, index) => {
      const year = item.month.split(' ')[1];
      if (!spans.length || spans[spans.length - 1].year !== year) {
        spans.push({ year, startIndex: index, endIndex: index });
      } else {
        spans[spans.length - 1].endIndex = index;
      }
    });
    return spans;
  };

  const yearSpans = getYearSpans();

  // Adjust font sizes based on container width
  const labelFontSize = containerWidth < 500 ? 10 : 12;
  const tickFontSize = containerWidth < 500 ? 10 : 12;

  return (
    <div 
      id="chart-container"
      className="relative w-full h-[350px] bg-gray-50 rounded-lg shadow-lg p-4"
      style={{ minWidth: '300px' }} // Minimum width to prevent squishing
    >
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Manpower Availability Trend
        </h2>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={filteredData}
          margin={{ 
            top: 30, 
            right: containerWidth < 500 ? 5 : 20, 
            left: 0, 
            bottom: 10 
          }}
          barCategoryGap={containerWidth < 500 ? 5 : 10}
          barGap={0}
        >
          <Legend content={<CustomLegend />} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={{ fontSize: tickFontSize }}
          />
          <YAxis hide />
          <Tooltip />
          <Bar
            dataKey="operator_required_ctq"
            name="Required"
            fill="#339CFF"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="operator_required_ctq"
              position="top"
              fontSize={labelFontSize}
              formatter={(value: number) => value || ''} // Don't show 0 values
            />
          </Bar>
          <Bar
            dataKey="operator_availability_ctq"
            name="Available"
            fill="#1a365d"
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="operator_availability_ctq"
              position="top"
              fontSize={labelFontSize}
              formatter={(value: number) => value || ''} // Don't show 0 values
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="absolute bottom-12 left-4 right-4 flex justify-between text-xs sm:text-sm text-gray-500 font-medium pointer-events-none">
        {yearSpans.map((span, i) => {
          const total = filteredData.length;
          const widthPercent =
            ((span.endIndex - span.startIndex + 1) / total) * 100;
          const leftPercent = (span.startIndex / total) * 100;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                textAlign: 'center',
              }}
            >
              {span.year}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManpowerTrendChart;