import React, { useEffect, useRef } from 'react';

interface SkillPieChartProps {
  level: number;                // Skill level (0-4)
  isRequired?: boolean;         // For required level display (usually disables click)
  onLevelChange?: (newLevel: number) => void; // Optional for inline editing
  size?: number;                // Diameter (px), default 32
  title?: string;               // Tooltip
}

const colors: Record<number, string> = {
  1: '#ef4444', // red
  2: '#f59e0b', // yellow
  3: '#3b82f6', // blue
  4: '#10b981'  // green
};

const SkillPieChart: React.FC<SkillPieChartProps> = ({
  level,
  isRequired = false,
  onLevelChange,
  size = 32,
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);

    // Draw base circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = isRequired ? '#e5e7eb' : '#f3f4f6';
    ctx.fill();
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw skill level pie segment, if level > 0
    if (level > 0) {
      const fillPercent = Math.max(0, Math.min(level/4, 1)); // Safe [0,1]
      ctx.beginPath();
      ctx.moveTo(size/2, size/2);
      ctx.arc(size/2, size/2, size/2 - 2, -Math.PI/2, Math.PI*2*fillPercent - Math.PI/2);
      ctx.closePath();
      ctx.fillStyle = colors[level as 1|2|3|4] || '#6b7280';
      ctx.fill();
    }
  }, [level, isRequired, size]);

  const handleClick = () => {
    if (!isRequired && onLevelChange) {
      const newLevel = level >= 4 ? 0 : level + 1;
      onLevelChange(newLevel);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={`${!isRequired && onLevelChange ? 'cursor-pointer hover:opacity-80' : ''}`}
        onClick={handleClick}
        title={title || (isRequired ? `Required Level: ${level}` : level > 0 ? `Skill Level: ${level}` : 'No level')}
        tabIndex={-1}
        style={{ outline: 'none' }}
      />
    </div>
  );
};

export default SkillPieChart;










// import React, { useEffect, useRef } from 'react';

// interface SkillPieChartProps {
//   level: number;
//   isRequired?: boolean;
//   onLevelChange?: (newLevel: number) => void;
// }

// const SkillPieChart: React.FC<SkillPieChartProps> = ({ 
//   level, 
//   isRequired = false, 
//   onLevelChange 
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;
    
//     const ctx = canvasRef.current.getContext('2d');
//     if (!ctx) return;
//     // Clear canvas
//     ctx.clearRect(0, 0, 32, 32);
//     // Draw background circle
//     ctx.beginPath();
//     ctx.arc(16, 16, 14, 0, Math.PI * 2);
//     ctx.fillStyle = isRequired ? '#e5e7eb' : '#f3f4f6';
//     ctx.fill();
//     ctx.strokeStyle = '#9ca3af';
//     ctx.lineWidth = 1;
//     ctx.stroke();
    
//     // Draw skill level pie if level > 0
//     if (level > 0) {
//       const fillPercentage = level / 4; // 4 levels: 1,2,3,4
//       ctx.beginPath();
//       ctx.moveTo(16, 16);
//       ctx.arc(16, 16, 14, -Math.PI / 2, Math.PI * 2 * fillPercentage - Math.PI / 2);
//       ctx.closePath();
//       // Color based on level
//        const colors = {
//         1: '#ef4444', // red
//         2: '#f59e0b', // yellow
//         3: '#3b82f6', // green
//         4: '#10b981'  // blue
//       }
//       ctx.fillStyle = colors[level as keyof typeof colors] || '#6b7280';
//       ctx.fill();
//     }
//     // Don't draw level number in center - removed as requested
//   }, [level, isRequired]);

//   const handleClick = () => {
//     if (!isRequired && onLevelChange) {
//       const newLevel = level >= 4 ? 0 : level + 1;
//       onLevelChange(newLevel);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center">
//       <canvas
//         ref={canvasRef}
//         width={32}
//         height={32}
//         className={`${!isRequired ? 'cursor-pointer hover:opacity-80' : ''}`}
//         onClick={handleClick}
//         title={isRequired ? `Required Level: ${level}` : `Current Level: ${level} (Click to change)`}
//       />
//     </div>
//   );
// };

// export default SkillPieChart;




  