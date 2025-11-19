
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Activity, Clock, ThumbsUp } from 'lucide-react';

// --- Mock Data ---
const ACCURACY_DATA = Array.from({ length: 20 }, (_, i) => ({
  epoch: i + 1,
  value: 0.6 + Math.log(i + 1) * 0.1 + Math.random() * 0.02
}));

const LATENCY_DATA = Array.from({ length: 50 }, () => Math.floor(d3.randomNormal(300, 50)()));

const FEEDBACK_DATA = [
  { label: '采纳', value: 65, color: '#10b981' },
  { label: '修改', value: 25, color: '#f59e0b' },
  { label: '拒绝', value: 10, color: '#ef4444' },
];

// --- 1. Accuracy Line Chart ---
const AccuracyChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("height", 200)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain(d3.extent(ACCURACY_DATA, d => d.epoch) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0.5, 1])
      .range([height, 0]);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `R${d}`))
      .attr("color", "#94a3b8");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d.valueOf() * 100).toFixed(0)}%`))
      .attr("color", "#94a3b8");

    // Line
    const line = d3.line<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.epoch))
      .y(d => y(d.value));

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "accuracy-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#8b5cf6");

    svg.append("path")
      .datum(ACCURACY_DATA)
      .attr("fill", "none")
      .attr("stroke", "url(#accuracy-gradient)")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Dots
    svg.selectAll(".dot")
      .data(ACCURACY_DATA.slice(-5)) // last 5
      .enter().append("circle")
      .attr("cx", d => x(d.epoch))
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("stroke", "#7c3aed")
      .attr("stroke-width", 2);

  }, []);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Activity size={18} className="text-blue-500" /> 全局准确率
        </h3>
        <span className="text-xs font-mono text-slate-400">Live</span>
      </div>
      <svg ref={svgRef} className="w-full flex-1" style={{ minHeight: '200px' }} />
    </div>
  );
};

// --- 2. Latency Bar Chart ---
const LatencyChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("height", 200)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Histogram
    const x = d3.scaleLinear()
      .domain([100, 500])
      .range([0, width]);

    const histogram = d3.bin()
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(15));

    const bins = histogram(LATENCY_DATA);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(bins, d => d.length) || 10]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}ms`))
      .attr("color", "#94a3b8");

    // Bars
    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", d => `translate(${x(d.x0!)},${y(d.length)})`)
      .attr("width", d => Math.max(0, x(d.x1!) - x(d.x0!) - 1))
      .attr("height", d => height - y(d.length))
      .attr("fill", "#60a5fa")
      .attr("rx", 2);
      
    // Mean Line
    const mean = d3.mean(LATENCY_DATA) || 300;
    svg.append("line")
        .attr("x1", x(mean))
        .attr("x2", x(mean))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#ef4444")
        .attr("stroke-dasharray", "4,2")
        .attr("stroke-width", 2);
        
    svg.append("text")
        .attr("x", x(mean) + 5)
        .attr("y", 10)
        .text(`Avg: ${mean.toFixed(0)}ms`)
        .attr("font-size", "10px")
        .attr("fill", "#ef4444");

  }, []);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Clock size={18} className="text-blue-500" /> 响应时间
        </h3>
        <span className="text-xs font-mono text-slate-400">ms</span>
      </div>
      <svg ref={svgRef} className="w-full flex-1" style={{ minHeight: '200px' }} />
    </div>
  );
};

// --- 3. Feedback Donut Chart ---
const FeedbackChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("height", 200)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(FEEDBACK_DATA.map(d => d.label))
      .range(FEEDBACK_DATA.map(d => d.color));

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);
      
    const hoverArc = d3.arc<any>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius + 5);

    const path = svg.selectAll("path")
      .data(pie(FEEDBACK_DATA))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d: any) => color(d.data.label) as string)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.9);

      // Add interactions
      path.on("mouseover", function(e, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", hoverArc);
      })
      .on("mouseout", function(e, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", arc);
      });

    // Center Text
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .text("90%")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", "#334155");
    
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .text("有帮助")
      .attr("font-size", "12px")
      .attr("fill", "#64748b");

  }, []);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <ThumbsUp size={18} className="text-blue-500" /> 反馈评分
        </h3>
        <div className="flex gap-2 text-[10px]">
            {FEEDBACK_DATA.map(d => (
                <div key={d.label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                    <span className="text-slate-500">{d.label}</span>
                </div>
            ))}
        </div>
      </div>
      <svg ref={svgRef} className="w-full flex-1" style={{ minHeight: '200px' }} />
    </div>
  );
};

export const RAGMetrics = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AccuracyChart />
            <LatencyChart />
            <FeedbackChart />
        </div>
    );
};
