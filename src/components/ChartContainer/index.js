import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ChartContainer = ({ autor }) => {
  const subjectAreaData = useMemo(() => {
    if (!autor || !autor.subjectArea) return [];
    return Array.isArray(autor.subjectArea)
      ? autor.subjectArea.map((area) => ({
          name: area["$"],
          y: parseInt(area["@frequency"]) || 0,
        }))
      : [];
  }, [autor]);

  const options = {
    chart: {
      type: "pie",
      height: 200, // Establece la altura del gráfico aquí
      backgroundColor: "transparent", // Fondo del gráfico transparente
    },
    title: {
      text: "Áreas Temáticas",
      style: {
        color: "#000", // Color del texto del título
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Porcentaje",
        colorByPoint: true,
        data: subjectAreaData,
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "180px !important" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ChartContainer;
