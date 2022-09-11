import { Quadrant, Ring } from "@prisma/client";
import * as d3 from "d3";

type Entry = {
  label: string;
  // quadrant: Quadrant;
  // ring: Ring;
  quadrant: number;
  ring: number;
  moved: number;
  segment?: {
    clipx: (d: Cartesian) => number;
    clipy: (d: Cartesian) => number;
    random: () => Cartesian;
  };
  id?: string;
  x?: number;
  y?: number;
  color?: string;
  active?: boolean;
  link?: string;
};

interface RadarConfig {
  entries: Array<Entry>;
  print_layout: boolean;
  rings: Array<{
    name: string;
    color: string;
  }>;
  colors: {
    inactive: string;
    background: string;
    grid: string;
    blipColor: string;
  };
  svg_id: string;
  width: number;
  height: number;
  zoomed_quadrant?: number;
  title: string;
  quadrants: Array<{
    name: string;
  }>;
}

type Cartesian = {
  x: number;
  y: number;
};

type Polar = {
  r: number;
  t: number;
};

const RADIUS = 400;

function translate(x: number, y: number) {
  return "translate(" + x + "," + y + ")";
}

function polar(cartesian: Cartesian) {
  var x = cartesian.x;
  var y = cartesian.y;
  return {
    t: Math.atan2(y, x),
    r: Math.sqrt(x * x + y * y),
  };
}

function cartesian(polar: Polar) {
  return {
    x: polar.r * Math.cos(polar.t),
    y: polar.r * Math.sin(polar.t),
  };
}

export function radar_visualization(config: RadarConfig) {
  const svg = d3
    .select("svg#" + config.svg_id)
    .style("background-color", config.colors.background)
    .attr("width", config.width)
    .attr("height", config.height);

  // clear svg first
  svg.selectAll("g").remove();
  console.clear();

  const radar = svg.append("g").attr("id", "radar");
  radar.attr("transform", translate(config.width / 2, config.height / 2));

  const grid = radar.append("g").attr("id", "grid");
  const rink = radar.append("g").attr("id", "rink");

  const entriesLength = config.entries.length;
  const quadrantsLength = config.quadrants.length;
  const quadrantsAngle = (2 * Math.PI) / quadrantsLength;
  const ringsLength = config.rings.length;
  const ringsSize = RADIUS / ringsLength;

  let angle = 0;
  for (let i = 0; i <= quadrantsLength; i++) {
    const point = cartesian({ r: RADIUS, t: angle });
    grid
      .append("line")
      .attr("id", `line-${i}`)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", point.x)
      .attr("y2", point.y)
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
    angle += quadrantsAngle;
  }

  for (let j = 0; j < ringsLength; j++) {
    const radius = ringsSize * (j + 1);
    grid
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius)
      .style("fill", "none")
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
    if (config.print_layout) {
      grid
        .append("text")
        .text(config.rings[j].name)
        .attr("y", -radius + 62)
        .attr("text-anchor", "middle")
        .style("fill", "#e5e5e5")
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  }

  for (let k = 0; k < entriesLength; k++) {
    const entry = config.entries[k];
    const coords = cartesian({
      t: entry.quadrant * quadrantsAngle,
      r: entry.ring * ringsSize,
    });
    const coordsMax = cartesian({
      t: ((entry.quadrant + 1) % quadrantsLength) * quadrantsAngle,
      r: ((entry.ring + 1) % ringsLength) * ringsSize,
    });

    const blip = rink.append("g").attr("id", `blip-${entry.id}`);
    if (entry.moved > 0) {
      blip
        .append("path")
        .attr("d", "M -11,5 11,5 0,-13 z") // triangle pointing up
        .style("fill", config.colors.blipColor);
    } else if (entry.moved < 0) {
      blip
        .append("path")
        .attr("d", "M -11,-5 11,-5 0,13 z") // triangle pointing down
        .style("fill", config.colors.blipColor);
    } else {
      blip.append("circle").attr("r", 9).attr("fill", config.colors.blipColor);
    }
    blip.attr("transform", translate(coords.x, coords.y));

    console.log(
      ((entry.quadrant + 1) % quadrantsLength),
      entry,
      coords,
      coordsMax
    );
  }
}
