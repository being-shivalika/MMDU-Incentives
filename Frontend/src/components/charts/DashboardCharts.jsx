import React from "react";

// 1. Line Chart for Submissions Trends
export const LineChart = ({ data = [], height = 180 }) => {
  if (data.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-xs text-brand-gray-400">
        No data
      </div>
    );

  const padding = 30;
  const chartHeight = height - padding * 2;
  const width = 400;
  const chartWidth = width - padding * 2;

  const maxVal = Math.max(...data.map((d) => d.value), 5);

  // Calculate points
  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, label: d.label, val: d.value };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, "");

  // Area under path
  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          const val = Math.round(maxVal * (1 - ratio));
          return (
            <g key={idx} className="opacity-10">
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={padding - 6}
                y={y + 3}
                className="text-[9px] fill-current text-right font-medium"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        {areaD && <path d={areaD} fill="url(#line-grad)" opacity="0.05" />}
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Path line */}
        <path d={pathD} fill="none" stroke="black" strokeWidth={1.5} />

        {/* Data Circles */}
        {points.map((p, idx) => (
          <g key={idx} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              className="fill-white stroke-black hover:r-5 cursor-pointer transition-all"
              strokeWidth={1.5}
            />
            {/* Tooltip on hover */}
            <title>
              {p.label}: {p.val} submissions
            </title>
          </g>
        ))}

        {/* X Axis Labels */}
        {data.map((d, idx) => {
          const x = padding + (idx / (data.length - 1)) * chartWidth;
          return (
            <text
              key={idx}
              x={x}
              y={height - padding + 15}
              className="text-[8px] fill-brand-gray-400 font-semibold"
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// 2. Bar Chart for Department Performance
export const BarChart = ({ data = [], height = 180 }) => {
  if (data.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-xs text-brand-gray-400">
        No data
      </div>
    );

  const padding = 35;
  const chartHeight = height - padding * 2;
  const width = 450;
  const chartWidth = width - padding * 2;

  const maxVal = Math.max(...data.map((d) => d.value), 5);
  const barWidth = (chartWidth / data.length) * 0.6;
  const barSpacing = (chartWidth / data.length) * 0.4;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padding + chartHeight * ratio;
          const val = Math.round(maxVal * (1 - ratio));
          return (
            <g key={idx} className="opacity-10">
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
              />
              <text
                x={padding - 6}
                y={y + 3}
                className="text-[9px] fill-current text-right font-medium"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, idx) => {
          const x = padding + idx * (barWidth + barSpacing) + barSpacing / 2;
          const barH = (d.value / maxVal) * chartHeight;
          const y = padding + chartHeight - barH;

          return (
            <g key={idx} className="group">
              {/* Actual Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                className="fill-brand-gray-900 group-hover:fill-black transition-colors"
                rx={1}
              />
              {/* Tooltip */}
              <title>
                {d.label}: {d.value}
              </title>

              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 15}
                className="text-[8px] fill-brand-gray-400 font-semibold"
                textAnchor="middle"
              >
                {d.shortLabel || d.label.substring(0, 5) + "..."}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. Donut Chart for Submissions by Category
export const DonutChart = ({ data = [], size = 160 }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentAngle = 0;

  // Modern Neutral Colors array for donut segments
  const colors = ["#09090b", "#4b5563", "#9ca3af", "#d1d5db", "#e5e7eb"];

  return (
    <div className="flex items-center gap-6 justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {total === 0 ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
        ) : (
          data.map((d, idx) => {
            const percentage = d.value / total;
            const strokeDashoffset = circumference - percentage * circumference;
            const rotation = (currentAngle * 360) / circumference;
            currentAngle += percentage * circumference;

            return (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={colors[idx % colors.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotation - 90} ${center} ${center})`}
                className="transition-all duration-300 hover:opacity-90 cursor-pointer"
              >
                <title>
                  {d.label}: {d.value} ({Math.round(percentage * 100)}%)
                </title>
              </circle>
            );
          })
        )}

        {/* Inner text */}
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          className="text-sm font-bold fill-brand-gray-900"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="text-[9px] fill-brand-gray-400 font-semibold uppercase tracking-wider"
        >
          Total
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2 text-left">
        {data.map((d, idx) => {
          const percentage =
            total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span
                className="h-3 w-3 rounded-sm shrink-0"
                style={{ backgroundColor: colors[idx % colors.length] }}
              />
              <span className="text-brand-gray-600 font-medium">{d.label}</span>
              <span className="text-brand-gray-400 ml-auto">
                ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
