import React, { useEffect, useRef, useState } from "react";
import { obtenerDocumentos, obtenerAutores } from "../Api";
import Highcharts from "highcharts";

function Charts({ chartType }) {
  const [loading, setLoading] = useState(true);
  const [authorsData, setAuthorsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const citationsChartRef = useRef(null);

  useEffect(() => {
    const fetchChartsData = async () => {
      setLoading(true);
      try {
        const documentos = await obtenerDocumentos();
        const autores = await obtenerAutores();
        setDocumentsData(documentos);
        setAuthorsData(autores);
        createCharts(autores, documentos);
      } catch (error) {
        console.error("Error al obtener datos para gráficos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  const createBarChart = (authorsData) => {
    if (barChartRef.current) {
      Highcharts.chart(barChartRef.current, {
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
                const givenName =
                  author["preferred-name"]?.["given-name"] || "";
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
    }
  };

  const createPieChart = (authorsData) => {
    if (pieChartRef.current) {
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

      Highcharts.chart(pieChartRef.current, {
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
    }
  };

  const createCitationsChart = (authorsData, documentsData) => {
    if (citationsChartRef.current) {
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

      Highcharts.chart(citationsChartRef.current, {
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
    }
  };

  const createCharts = (authorsData, documentsData) => {
    if (chartType === "bar-chart" || chartType === "all-charts") {
      createBarChart(authorsData);
    }
    if (chartType === "pie-chart" || chartType === "all-charts") {
      createPieChart(authorsData);
    }
    if (chartType === "citations-chart" || chartType === "all-charts") {
      createCitationsChart(authorsData, documentsData);
    }
  };

  useEffect(() => {
    if (!loading) {
      createCharts(authorsData, documentsData);
    }
  }, [chartType, loading, authorsData, documentsData]);

  return (
    <div id="charts" className="chart-container">
      {loading ? (
        <div id="loading-message">Cargando...</div>
      ) : (
        <>
          {chartType === "bar-chart" && (
            <div id="bar-chart-container" ref={barChartRef}></div>
          )}
          {chartType === "pie-chart" && (
            <div id="pie-chart-container" ref={pieChartRef}></div>
          )}
          {chartType === "citations-chart" && (
            <div id="citations-chart-container" ref={citationsChartRef}></div>
          )}
          {chartType === "all-charts" && (
            <>
              <div id="bar-chart-container" ref={barChartRef}></div>
              <div id="pie-chart-container" ref={pieChartRef}></div>
              <div id="citations-chart-container" ref={citationsChartRef}></div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Charts;
