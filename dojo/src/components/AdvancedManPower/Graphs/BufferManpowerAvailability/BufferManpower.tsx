import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts';

interface BufferData {
  month: string;
  buffer_manpower_required_ctq: number;
  buffer_manpower_availability_ctq: number;
}

interface Props {
  factoryId: number | null;
  departmentId: number | null;
}

const BufferManpowerAvailability: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<BufferData[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(560);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('buffer-chart-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!factoryId || !departmentId) return;

    const url = `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${factoryId}&department_id=${departmentId}`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((json) => {
        const bufferTrend = json.buffer_trend || [];
        setData(bufferTrend);
      })
      .catch((err) => {
        console.error('Error fetching buffer manpower data:', err);
      });
  }, [factoryId, departmentId]);

  const formatMonth = (value: string) => {
    if (containerWidth < 400) {
      return value.split(' ')[0].substring(0, 3);
    }
    return value.split(' ')[0];
  };

  const CustomLegend = () => (
    <div className="bg-white rounded-full px-3 py-1 inline-flex gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#339CFF] rounded-full" />
        <span>Required</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#1a365d] rounded-full" />
        <span>Available</span>
      </div>
    </div>
  );

  const labelFontSize = containerWidth < 500 ? 10 : 12;
  const tickFontSize = containerWidth < 500 ? 10 : 12;

  return (
    <div 
      id="buffer-chart-container"
      className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
      style={{ minWidth: '300px' }}
    >
      <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Buffer Manpower Trend
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart 
          data={data} 
          margin={{ 
            top: 20, 
            right: containerWidth < 500 ? 5 : 10, 
            left: 0, 
            bottom: 5 
          }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: tickFontSize }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatMonth}
          />
          <YAxis
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 10']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: labelFontSize,
            }}
            formatter={(value: number, name: string) => [
              value, 
              name.includes('required') ? 'Required' : 'Available'
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            content={<CustomLegend />} 
          />
          
          <Area
            type="linear"
            name="buffer_manpower_required_ctq"
            dataKey="buffer_manpower_required_ctq"
            stroke="#339CFF"
            strokeWidth={2}
            fill="rgba(51, 156, 255, 0.3)"
            fillOpacity={1}
            dot={false}
            activeDot={false}
          >
            <LabelList
              dataKey="buffer_manpower_required_ctq"
              position="top"
              fontSize={labelFontSize}
              fill="#333"
              offset={5}
              formatter={(value: number) => value || ''}
            />
          </Area>

          <Area
            type="linear"
            name="buffer_manpower_availability_ctq"
            dataKey="buffer_manpower_availability_ctq"
            stroke="#1a365d"
            strokeWidth={2}
            fill="rgba(26, 54, 93, 0.3)"
            fillOpacity={1}
            dot={false}
            activeDot={false}
          >
            <LabelList
              dataKey="buffer_manpower_availability_ctq"
              position="top"
              fontSize={labelFontSize}
              fill="#333"
              offset={5}
              formatter={(value: number) => value || ''}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BufferManpowerAvailability;