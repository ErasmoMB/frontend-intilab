// components/Charts.js
import React, { useEffect, useState } from "react";
import { obtenerDocumentos, obtenerAutores } from "../Api"; // Asegúrate de que la ruta sea correcta
import Highcharts from "highcharts";

function Charts() {
  const [loading, setLoading] = useState(true);
  const [authorsData, setAuthorsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);

  useEffect(() => {
    const fetchChartsData = async () => {
      setLoading(true); // Mostrar mensaje de carga
      try {
        const documentos = await obtenerDocumentos();
        const autores = await obtenerAutores();
        setDocumentsData(documentos);
        setAuthorsData(autores);
        createCharts(autores, documentos); // Crear gráficos después de obtener los datos
      } catch (error) {
        console.error("Error al obtener datos para gráficos:", error);
      } finally {
        setLoading(false); // Ocultar mensaje de carga
      }
    };

    fetchChartsData();
  }, []);

  const createBarChart = (authorsData) => {
    Highcharts.chart("bar-chart-container", {
      chart: {
        type: "bar",
      },
      title: {
        text: "Número de Documentos por Autor (Top 20)",
      },
      xAxis: {
        type: "category",
        title: {
          text: "Autores",
        },
      },
      yAxis: {
        title: {
          text: "Número de Documentos",
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: "Documentos",
          data: authorsData
            .map((author) => {
              const givenName = author["preferred-name"]?.["given-name"] || "";
              const surname = author["preferred-name"]?.["surname"] || "";
              const fullName =
                `${givenName} ${surname}`.trim() || "Nombre no disponible";
              const documentCount = parseInt(author["document-count"]);

              return [fullName, isNaN(documentCount) ? 0 : documentCount];
            })
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20),
          dataLabels: {
            enabled: true,
            format: "{point.y:.0f}",
          },
          tooltip: {
            pointFormat: "Documentos: <b>{point.y}</b><br>",
          },
          colorByPoint: true,
        },
      ],
    });
  };

  const createPieChart = (authorsData) => {
    const areaCounts = {};
    const totalAuthors = authorsData.length;

    authorsData.forEach((author) => {
      const subjectAreas = author["subject-area"];
      if (Array.isArray(subjectAreas)) {
        subjectAreas.forEach((area) => {
          const areaName = area["$"];
          if (areaCounts[areaName]) {
            areaCounts[areaName]++;
          } else {
            areaCounts[areaName] = 1;
          }
        });
      }
    });

    const seriesData = Object.entries(areaCounts).map(([name, count]) => ({
      name: name,
      y: (count / totalAuthors) * 100,
    }));

    Highcharts.chart("pie-chart-container", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Distribución de Áreas de Especialización",
        align: "left",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Áreas",
          colorByPoint: true,
          data: seriesData,
        },
      ],
    });
  };

  const createCitationsChart = (authorsData, documentsData) => {
    const seriesData = authorsData.map((author) => {
      const authorId = author["dc:identifier"]?.split(":")[1];
      let totalCitations = 0;

      if (authorId && documentsData.documentos[authorId]) {
        documentsData.documentos[authorId].forEach((document) => {
          totalCitations += parseInt(document["citedby-count"]) || 0;
        });
      }

      const fullName = `${author["preferred-name"]["surname"]}, ${author["preferred-name"]["given-name"]}`;
      return [fullName, totalCitations];
    });

    const topCitations = seriesData
      .filter(([_, citations]) => citations > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topCitations.length === 0) {
      console.error("No se encontraron datos para mostrar en el gráfico.");
      return;
    }

    Highcharts.chart("citations-chart-container", {
      chart: {
        type: "column",
      },
      title: {
        text: "Top 5 Autores por Número de Citas",
      },
      xAxis: {
        type: "category",
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: "13px",
            fontFamily: "Verdana, sans-serif",
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Total de Citas",
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: "Citas: <b>{point.y}</b>",
      },
      series: [
        {
          name: "Citas",
          data: topCitations,
          dataLabels: {
            enabled: true,
            format: "{point.y:.0f}",
          },
          colorByPoint: true,
        },
      ],
    });
  };

  const createCharts = (authorsData, documentsData) => {
    createBarChart(authorsData);
    createPieChart(authorsData);
    createCitationsChart(authorsData, documentsData);
  };

  return (
    <div id="charts" className="chart-container">
      {loading ? (
        <div id="loading-message">Cargando...</div>
      ) : (
        <>
          <div id="bar-chart-container"></div>
          <div id="pie-chart-container"></div>
          <div id="citations-chart-container"></div>
        </>
      )}
    </div>
  );
}

export default Charts;
