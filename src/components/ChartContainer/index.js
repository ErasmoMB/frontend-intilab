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
        title: {
          text: "Áreas Temáticas",
          subtext: "",
          left: "center",
          textStyle: {
            fontSize: 14, // Tamaño de fuente del título
          },
          subtextStyle: {
            fontSize: 12, // Tamaño de fuente del subtítulo
          },
        },
        tooltip: {
          trigger: "item",
          textStyle: {
            fontSize: 12, // Tamaño de fuente del tooltip
          },
        },
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            fontSize: 12, // Tamaño de fuente de la leyenda
          },
        },
        series: [
          {
            name: "Área Temática",
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
            label: {
              fontSize: 12, // Tamaño de fuente de las etiquetas de los segmentos
            },
            labelLine: {
              fontSize: 12, // Tamaño de fuente de las líneas de etiquetas
            },
          },
        ],
      };
      chartInstanceRef.current.setOption(option);

      // Redimensionar el gráfico automáticamente al cambiar el tamaño de la ventana
      const resizeChart = () => {
        chartInstanceRef.current.resize();
      };
      window.addEventListener("resize", resizeChart);

      return () => {
        window.removeEventListener("resize", resizeChart);
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispose();
        }
      };
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
