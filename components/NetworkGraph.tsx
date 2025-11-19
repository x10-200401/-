
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HospitalNode } from '../types';

const NetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 500;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // Define Nodes
    const nodes: any[] = [
      { id: "FUWAI", label: "阜外医院 (中心枢纽)", group: 1, r: 45 },
      { id: "TSINGHUA", label: "清华大学 (技术节点)", group: 1, r: 35 },
      { id: "H1", label: "区域医疗中心 A", group: 2, r: 20 },
      { id: "H2", label: "区域医疗中心 B", group: 2, r: 20 },
      { id: "H3", label: "地方医院 C", group: 3, r: 15 },
      { id: "H4", label: "地方医院 D", group: 3, r: 15 },
      { id: "H5", label: "地方医院 E", group: 3, r: 15 },
      { id: "H6", label: "社区诊所 F", group: 3, r: 12 },
      { id: "H7", label: "社区诊所 G", group: 3, r: 12 },
    ];

    const links: any[] = [
      { source: "FUWAI", target: "TSINGHUA" },
      { source: "FUWAI", target: "H1" },
      { source: "FUWAI", target: "H2" },
      { source: "H1", target: "H3" },
      { source: "H1", target: "H4" },
      { source: "H2", target: "H5" },
      { source: "H5", target: "H6" },
      { source: "H5", target: "H7" },
    ];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.r + 10));

    // Link lines
    const link = svg.append("g")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    // Particle animation (Simulate Data Flow)
    const particleGroup = svg.append("g");
    
    const emitParticle = () => {
        if(!links.length) return;
        const randomLink = links[Math.floor(Math.random() * links.length)];
        // Determine direction: Hub -> Spoke (Wisdom), Spoke -> Hub (Feedback)
        // Simply animating random directions for visual effect
        const isWisdom = Math.random() > 0.5;
        const source = isWisdom ? randomLink.source : randomLink.target;
        const target = isWisdom ? randomLink.target : randomLink.source;
        
        const particle = particleGroup.append("circle")
            .attr("r", 3)
            .attr("fill", isWisdom ? "#3b82f6" : "#10b981") // Blue for Wisdom, Green for Feedback
            .attr("cx", source.x)
            .attr("cy", source.y);

        particle.transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .attr("cx", target.x)
            .attr("cy", target.y)
            .remove();
    };

    const interval = setInterval(emitParticle, 200);


    // Node circles
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill", (d: any) => {
        if (d.id === "FUWAI") return "#dc2626"; // Red for Power Plant
        if (d.id === "TSINGHUA") return "#7c3aed"; // Violet for Tech
        return "#3b82f6"; // Blue for Grid users
      })
      .attr("class", "cursor-pointer hover:opacity-80 transition-opacity shadow-lg");

    // Labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", (d: any) => d.r + 5)
      .attr("y", 5)
      .style("font-size", "10px")
      .style("font-weight", "600")
      .style("fill", "#475569")
      .style("pointer-events", "none")
      .attr("stroke", "none")
      .style("font-family", "Microsoft YaHei, sans-serif");

    // Pulse effect for Fuwai
    const pulse = () => {
        const fuwaiNode = svg.select("circle"); // Assuming first node is Fuwai due to order
        fuwaiNode.transition()
            .duration(1000)
            .attr("r", 50)
            .attr("fill-opacity", 0.8)
            .transition()
            .duration(1000)
            .attr("r", 45)
            .attr("fill-opacity", 1)
            .on("end", pulse);
    };
    pulse();

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
       <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 text-xs z-10 shadow-sm">
         <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span>阜外 (知识枢纽)</span>
         </div>
         <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-violet-600"></span>
            <span>清华 (技术电网)</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>医院 (边缘节点)</span>
         </div>
       </div>
      <svg ref={svgRef} className="w-full h-[500px] block cursor-move"></svg>
    </div>
  );
};

export default NetworkGraph;
