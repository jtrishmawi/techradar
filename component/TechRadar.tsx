import { radar_visualization } from "lib/radar";
import { useEffect, useRef } from "react";

const TechRadar = ({ blips, quadrants, rings }: Props) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    radar_visualization({
      quadrants,
      rings: rings.map((r, i) => ({
        ...r,
        color: `#${i.toString(16).padStart(6, "0")}`,
      })),
      entries: blips.map((blip) => ({
        ...blip,
        label: blip.name,
        moved: blip.isNew ? 1 : 0,
        quadrant: quadrants.findIndex((q) => q.id === blip.quadrant.id),
        ring: rings.findIndex((r) => r.id === blip.ring.id),
      })),
      print_layout: true,
      colors: {
        inactive: "#333333",
        background: "#ffffff",
        grid: "#000000",
        blipColor: "red",
      },
      svg_id: "techradar",
      width: window.innerWidth,
      height: window.innerHeight,
      title: "",
    });
  }, [blips, quadrants, rings]);

  return <svg id="techradar" ref={ref}></svg>;
};

export default TechRadar;
