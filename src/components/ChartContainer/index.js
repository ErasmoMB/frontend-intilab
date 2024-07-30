import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const ChartContainer = ({ authorId }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = null;

    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/autores");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const subjectAreaData = getSubjectAreaData(data.autores, authorId);

        if (chartRef.current) {
          if (chart) {
            chart.dispose();
          }
          chart = echarts.init(chartRef.current);
          const option = {
            title: {
              text: "Áreas Temáticas",
              subtext: "",
              left: "center",
              textStyle: {
                fontSize: 10,
              },
              subtextStyle: {
                fontSize: 10,
              },
            },
            tooltip: {
              trigger: "item",
              textStyle: {
                fontSize: 10,
              },
            },
            legend: {
              orient: "vertical",
              left: "left",
              textStyle: {
                fontSize: 10,
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
                  fontSize: 10,
                },
                labelLine: {
                  fontSize: 10,
                },
              },
            ],
          };

          chart.setOption(option);
          window.addEventListener("resize", chart.resize);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (chart) {
        window.removeEventListener("resize", chart.resize);
        chart.dispose();
      }
    };
  }, [authorId]);

  const getSubjectAreaData = (autores, authorId) => {
    const author = autores.find((autor) => autor["dc:identifier"] === authorId);
    if (!author || !author["subject-area"]) return [];

    return author["subject-area"].map((area) => ({
      value: parseInt(area["@frequency"]) || 0,
      name: area["$"],
    }));
  };

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
