import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { obtenerDocumentos, obtenerTotalAutores } from "../../../../api/services";
import Highcharts from "highcharts";
import Loading from "../../../common/Loading";
import { debounce } from "../../../../utils/debounce";

const EXCLUDED_AUTHOR_IDS = ["56902581400", "57200970000", "57201023602"];

const Charts = memo(({ chartType }) => {
  const [loading, setLoading] = useState(true);
  const [authorsData, setAuthorsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const citationsChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        setLoading(true);
        const [documentos, { data: autores }] = await Promise.all([
          obtenerDocumentos(),
          obtenerTotalAutores(),
        ]);

        const autoresFiltrados = (autores || []).filter(
          (autor) =>
            !EXCLUDED_AUTHOR_IDS.includes(
              autor["dc:identifier"]?.split(":")[1]
            )
        );
        setDocumentsData(documentos);
        setAuthorsData(autoresFiltrados);
        createCharts(autoresFiltrados, documentos);
      } catch (error) {
        setAuthorsData([]);
        setDocumentsData({});
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  const createBarChart = useCallback((authorsData, forceRecreate = false) => {
    if (!barChartRef.current) return;
    
    const isMobile = window.innerWidth < 768;
    const containerWidth = barChartRef.current.offsetWidth || 800;
    
    if (chartInstancesRef.current.bar && !forceRecreate) {
      try {
        chartInstancesRef.current.bar.setSize(containerWidth, isMobile ? 400 : 500, false);
      } catch (e) {
        chartInstancesRef.current.bar = null;
        forceRecreate = true;
      }
    }
    
    if (forceRecreate || !chartInstancesRef.current.bar) {
      chartInstancesRef.current.bar = Highcharts.chart(barChartRef.current, {
        chart: {
          type: "bar",
          height: isMobile ? 400 : 500,
          width: containerWidth,
        },
        title: {
          text: "Número de Documentos por Autor (Top 20)",
          style: {
            fontSize: isMobile ? "14px" : "18px",
          },
        },
        xAxis: {
          type: "category",
          title: {
            text: "Autores",
          },
          labels: {
            style: {
              fontSize: isMobile ? "10px" : "12px",
            },
          },
        },
        yAxis: {
          title: {
            text: "Número de Documentos",
          },
          labels: {
            style: {
              fontSize: isMobile ? "10px" : "12px",
            },
          },
        },
        legend: {
          enabled: false,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 768,
              },
              chartOptions: {
                chart: {
                  height: 400,
                },
                title: {
                  style: {
                    fontSize: "14px",
                  },
                },
              },
            },
          ],
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
              style: {
                fontSize: isMobile ? "10px" : "12px",
              },
            },
            tooltip: {
              pointFormat: "Documentos: <b>{point.y}</b><br>",
            },
            colorByPoint: true,
          },
        ],
      });
    }
  }, []);

  const pieChartData = useMemo(() => {
    if (authorsData.length === 0) return [];
    
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

    return Object.entries(areaCounts).map(([name, count]) => ({
      name: name,
      y: (count / totalAuthors) * 100,
    }));
  }, [authorsData]);

  const createPieChart = useCallback((seriesData, forceRecreate = false) => {
    if (!pieChartRef.current || !seriesData || seriesData.length === 0) return;
    
    const isMobile = window.innerWidth < 768;
    const containerWidth = pieChartRef.current.offsetWidth || 800;
    
    if (chartInstancesRef.current.pie && !forceRecreate) {
      try {
        chartInstancesRef.current.pie.setSize(containerWidth, isMobile ? 400 : 500, false);
        chartInstancesRef.current.pie.series[0].setData(seriesData, true);
      } catch (e) {
        chartInstancesRef.current.pie = null;
        forceRecreate = true;
      }
    }
    
    if (forceRecreate || !chartInstancesRef.current.pie) {
      chartInstancesRef.current.pie = Highcharts.chart(pieChartRef.current, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          height: isMobile ? 400 : 500,
          width: containerWidth,
        },
        title: {
          text: "Distribución de Áreas de Especialización",
          align: "left",
          style: {
            fontSize: isMobile ? "14px" : "18px",
          },
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
              enabled: !isMobile,
              format: "<b>{point.name}</b>: {point.percentage:.1f} %",
              style: {
                fontSize: isMobile ? "10px" : "12px",
              },
            },
            showInLegend: true,
          },
        },
        legend: {
          itemStyle: {
            fontSize: isMobile ? "10px" : "12px",
          },
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 768,
              },
              chartOptions: {
                chart: {
                  height: 400,
                },
                title: {
                  style: {
                    fontSize: "14px",
                  },
                },
                plotOptions: {
                  pie: {
                    dataLabels: {
                      enabled: false,
                    },
                  },
                },
              },
            },
          ],
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
  }, []);

  const citationsData = useMemo(() => {
    if (authorsData.length === 0 || !documentsData || !documentsData.documentos) return [];
    
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

    return seriesData
      .filter(([_, citations]) => citations > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [authorsData, documentsData]);

  const createCitationsChart = useCallback((topCitations, forceRecreate = false) => {
    if (!citationsChartRef.current || !topCitations || topCitations.length === 0) return;
    
    const isMobile = window.innerWidth < 768;
    const containerWidth = citationsChartRef.current.offsetWidth || 800;
    
    if (chartInstancesRef.current.citations && !forceRecreate) {
      try {
        chartInstancesRef.current.citations.setSize(containerWidth, isMobile ? 400 : 500, false);
        chartInstancesRef.current.citations.series[0].setData(topCitations, true);
      } catch (e) {
        chartInstancesRef.current.citations = null;
        forceRecreate = true;
      }
    }
    
    if (forceRecreate || !chartInstancesRef.current.citations) {
      chartInstancesRef.current.citations = Highcharts.chart(citationsChartRef.current, {
        chart: {
          type: "column",
          height: isMobile ? 400 : 500,
          width: containerWidth,
        },
        title: {
          text: "Top 5 Autores por Número de Citas",
          style: {
            fontSize: isMobile ? "14px" : "18px",
          },
        },
        xAxis: {
          type: "category",
          labels: {
            autoRotation: isMobile ? [-90] : [-45, -90],
            style: {
              fontSize: isMobile ? "10px" : "13px",
              fontFamily: "Verdana, sans-serif",
            },
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Total de Citas",
          },
          labels: {
            style: {
              fontSize: isMobile ? "10px" : "12px",
            },
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat: "Citas: <b>{point.y}</b>",
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 768,
              },
              chartOptions: {
                chart: {
                  height: 400,
                },
                title: {
                  style: {
                    fontSize: "14px",
                  },
                },
                xAxis: {
                  labels: {
                    autoRotation: [-90],
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
              },
            },
          ],
        },
        series: [
          {
            name: "Citas",
            data: topCitations,
            dataLabels: {
              enabled: true,
              format: "{point.y:.0f}",
              style: {
                fontSize: isMobile ? "10px" : "12px",
              },
            },
            colorByPoint: true,
          },
        ],
      });
    }
  }, []);

  const createCharts = useCallback(
    (forceRecreate = false) => {
      if (chartType === "bar-chart" || chartType === "all-charts") {
        createBarChart(authorsData, forceRecreate);
      }
      if (chartType === "pie-chart" || chartType === "all-charts") {
        createPieChart(pieChartData, forceRecreate);
      }
      if (chartType === "citations-chart" || chartType === "all-charts") {
        createCitationsChart(citationsData, forceRecreate);
      }
    },
    [chartType, authorsData, pieChartData, citationsData, createBarChart, createPieChart, createCitationsChart]
  );

  useEffect(() => {
    if (!loading && authorsData.length > 0 && documentsData) {
      createCharts(true);
    }
  }, [loading, createCharts]);

  useEffect(() => {
    if (loading || authorsData.length === 0 || !documentsData) return;

    const debouncedResize = debounce(() => {
      createCharts(false);
    }, 250);

    const resizeObserver = new ResizeObserver((entries) => {
      let hasValidEntry = false;
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          hasValidEntry = true;
          break;
        }
      }
      if (hasValidEntry) {
        debouncedResize();
      }
    });

    const chartContainers = [
      barChartRef.current,
      pieChartRef.current,
      citationsChartRef.current,
    ].filter(Boolean);

    chartContainers.forEach((container) => {
      if (container) {
        resizeObserver.observe(container);
      }
    });

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      resizeObserver.disconnect();
      Object.values(chartInstancesRef.current).forEach((chart) => {
        if (chart && chart.destroy) {
          chart.destroy();
        }
      });
      chartInstancesRef.current = {};
    };
  }, [loading, authorsData, documentsData, createCharts]);

  if (loading || authorsData.length === 0) {
    return (
      <div id="charts" className="chart-container">
        <Loading message="Cargando gráficos..." />
      </div>
    );
  }

  return (
    <div id="charts" className="chart-container">
      {chartType === "bar-chart" && (
        <div className="chart-wrapper">
          <div id="bar-chart-container" ref={barChartRef}></div>
        </div>
      )}
      {chartType === "pie-chart" && (
        <div className="chart-wrapper">
          <div id="pie-chart-container" ref={pieChartRef}></div>
        </div>
      )}
      {chartType === "citations-chart" && (
        <div className="chart-wrapper">
          <div id="citations-chart-container" ref={citationsChartRef}></div>
        </div>
      )}
      {chartType === "all-charts" && (
        <>
          <div className="chart-wrapper">
            <div id="bar-chart-container" ref={barChartRef}></div>
          </div>
          <div className="chart-wrapper">
            <div id="pie-chart-container" ref={pieChartRef}></div>
          </div>
          <div className="chart-wrapper">
            <div id="citations-chart-container" ref={citationsChartRef}></div>
          </div>
        </>
      )}
    </div>
  );
});

Charts.displayName = "Charts";

export default Charts;

