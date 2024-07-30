import React, { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";

const ChartContainer = ({ autor }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const subjectAreaData = useMemo(() => {
    if (!autor || !autor.subjectArea) return [];
    return Array.isArray(autor.subjectArea)
      ? autor.subjectArea.map((area) => ({
          value: parseInt(area["@frequency"]) || 0,
          name: area["$"],
        }))
      : [];
  }, [autor]);

  useEffect(() => {
    if (subjectAreaData.length > 0 && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }
      chartInstanceRef.current = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "Áreas temáticas",
            type: "pie",
            radius: "50%",
            data: subjectAreaData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      chartInstanceRef.current.setOption(option);
    }
  }, [subjectAreaData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "200px",
        marginTop: "20px",
      }}
    ></div>
  );
};

export default ChartContainer;
