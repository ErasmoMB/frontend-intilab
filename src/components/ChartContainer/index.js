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
            fontSize: 20, // Tamaño de fuente del título
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
          orient: "horizontal", // Orientación horizontal de la leyenda
          top: "bottom", // Posición de la leyenda en la parte inferior
          textStyle: {
            fontSize: 12, // Tamaño de fuente de la leyenda
          },
        },
        series: [
          {
            name: "Área Temática",
            type: "pie",
            radius: ["40%", "70%"], // Ajusta el radio interno y externo
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "outside",
              fontSize: 12, // Tamaño de fuente de las etiquetas de los segmentos
            },
            labelLine: {
              show: true,
              length: 10, // Longitud de las líneas de etiquetas
              length2: 20, // Longitud de la segunda parte de las líneas de etiquetas
              smooth: 0.2, // Suavizar las líneas
            },
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

      // Adjust styles for the canvas element
      const canvas = chartRef.current.querySelector("canvas");
      if (canvas) {
        Object.assign(canvas.style, {
          position: "relative", // Cambiado de "absolute" a "relative"
          left: "0px",
          top: "0px",
          width: "70%", // Cambiado el ancho a 70%
          height: "200px", // Cambiada la altura a 200px
          userSelect: "none",
          WebkitTapHighlightColor: "rgba(0, 0, 0, 0)", // Cambiado a "-webkit-tap-highlight-color"
          padding: "0px",
          margin: "0px",
          borderWidth: "0px", // Cambiado a "border-width"
        });
      }

      // Handle resizing of the chart
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
        height: "300px", // Aumentar la altura del contenedor
        /*         marginTop: "20px", */
      }}
    ></div>
  );
};

export default ChartContainer;
