// src/components/AreaChart.js

import React, { useEffect, useState } from "react";
import * as echarts from "echarts";

const AutorSlider = () => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/autores");
        const data = await response.json();
        const authorId = "AUTHOR_ID:36659719000"; // Cambiar al ID del autor deseado
        const subjectAreaData = getSubjectAreaData(data.autores, authorId);

        // Inicializar el gráfico de ECharts
        const chartDom = document.getElementById("main");
        const myChart = echarts.init(chartDom);
        const option = {
          title: {
            text: "Áreas Temáticas del Autor",
            subtext: "Datos obtenidos de la API",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
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
            },
          ],
        };

        // Establecer las opciones y renderizar el gráfico
        myChart.setOption(option);
        setChart(myChart);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Limpiar el gráfico al desmontar el componente
    return () => {
      if (chart !== null) {
        chart.dispose();
      }
    };
  }, []);

  // Función para procesar y obtener los datos de "Áreas Temáticas"
  const getSubjectAreaData = (autores, authorId) => {
    const author = autores.find((autor) => autor["dc:identifier"] === authorId);
    if (!author) return [];

    return author["subject-area"].map((area) => ({
      value: parseInt(area["@frequency"]),
      name: area["$"],
    }));
  };

  return <div id="main" style={{ width: "600px", height: "400px" }}></div>;
};

export default AutorSlider;
