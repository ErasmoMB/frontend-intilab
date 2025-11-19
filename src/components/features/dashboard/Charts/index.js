import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { obtenerDocumentos, obtenerAutores } from "../../../../api/services";
import Highcharts from "highcharts";
import Loading from "../../../common/Loading";
import { debounce } from "../../../../utils/debounce";
import { config } from "../../../../config";
import { calculateAuthorCitations, formatAuthorName, getAuthorId } from "../../../../utils/dataHelpers";

const Charts = memo(({ chartType }) => {
  const [loading, setLoading] = useState(true);
  const [authorsData, setAuthorsData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < config.CHARTS.MOBILE_BREAKPOINT);
  const [containersReady, setContainersReady] = useState(false);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const citationsChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < config.CHARTS.MOBILE_BREAKPOINT);
    }, 150);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        setLoading(true);
        setContainersReady(false);
        const [documentos, autoresResponse] = await Promise.all([
          obtenerDocumentos(),
          obtenerAutores(),
        ]);

        const autores = autoresResponse.autores || [];
        const autoresFiltrados = autores.filter(
          (autor) => !config.DATA.EXCLUDED_AUTHOR_IDS.includes(getAuthorId(autor))
        );
        setDocumentsData(documentos);
        setAuthorsData(autoresFiltrados);
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
    
    const rect = barChartRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    if (!containerWidth || containerWidth === 0) return;
    
    if (chartInstancesRef.current.bar && !forceRecreate) {
      try {
        chartInstancesRef.current.bar.setSize(
          containerWidth,
          isMobile ? config.CHARTS.MOBILE_HEIGHT : config.CHARTS.DESKTOP_HEIGHT,
          false
        );
      } catch (e) {
        chartInstancesRef.current.bar = null;
        forceRecreate = true;
      }
    }
    
    if (forceRecreate || !chartInstancesRef.current.bar) {
      chartInstancesRef.current.bar = Highcharts.chart(barChartRef.current, {
        chart: {
          type: "bar",
          height: isMobile ? config.CHARTS.MOBILE_HEIGHT : config.CHARTS.DESKTOP_HEIGHT,
          width: containerWidth,
          animation: false,
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
            rotation: isMobile ? -45 : 0,
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
                maxWidth: config.CHARTS.MOBILE_BREAKPOINT,
              },
              chartOptions: {
                chart: {
                  height: config.CHARTS.MOBILE_HEIGHT,
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
                const fullName = formatAuthorName(author);
                const documentCount = parseInt(author["document-count"]);
                return [fullName, isNaN(documentCount) ? 0 : documentCount];
              })
              .sort((a, b) => b[1] - a[1])
              .slice(0, config.CHARTS.TOP_DOCUMENTS),
            dataLabels: {
              enabled: !isMobile,
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
  }, [isMobile]);

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
    
    const rect = pieChartRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    if (!containerWidth || containerWidth === 0) return;
    
    if (chartInstancesRef.current.pie && !forceRecreate) {
      try {
        chartInstancesRef.current.pie.setSize(
          containerWidth,
          isMobile ? config.CHARTS.MOBILE_HEIGHT : config.CHARTS.DESKTOP_HEIGHT,
          false
        );
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
          height: isMobile ? config.CHARTS.MOBILE_HEIGHT : config.CHARTS.DESKTOP_HEIGHT,
          width: containerWidth,
          animation: false,
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
                maxWidth: config.CHARTS.MOBILE_BREAKPOINT,
              },
              chartOptions: {
                chart: {
                  height: config.CHARTS.MOBILE_HEIGHT,
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
  }, [isMobile]);

  const citationsData = useMemo(() => {
    if (authorsData.length === 0 || !documentsData || !documentsData.documentos) return [];
    
    const seriesData = authorsData.map((author) => {
      const totalCitations = calculateAuthorCitations(author, documentsData);
      const fullName = formatAuthorName(author);
      return [fullName, totalCitations];
    });

    return seriesData
      .filter(([_, citations]) => citations > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, config.CHARTS.TOP_CITATIONS);
  }, [authorsData, documentsData]);

  const createCitationsChart = useCallback((topCitations, forceRecreate = false) => {
    if (!citationsChartRef.current || !topCitations || topCitations.length === 0) return;
    
    const rect = citationsChartRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    if (!containerWidth || containerWidth === 0) return;
    
    if (chartInstancesRef.current.citations && !forceRecreate) {
      try {
        chartInstancesRef.current.citations.setSize(
          containerWidth,
          isMobile ? config.CHARTS.MOBILE_HEIGHT : config.CHARTS.DESKTOP_HEIGHT,
          false
        );
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
          height: isMobile ? config.CHARTS.MOBILE_HEIGHT : config.CHARTS.DESKTOP_HEIGHT,
          width: containerWidth,
          animation: false,
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
            rotation: isMobile ? -90 : -45,
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
                maxWidth: config.CHARTS.MOBILE_BREAKPOINT,
              },
              chartOptions: {
                chart: {
                  height: config.CHARTS.MOBILE_HEIGHT,
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
              enabled: !isMobile,
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
  }, [isMobile]);

  const createCharts = useCallback(
    (forceRecreate = false) => {
      if (loading || authorsData.length === 0) return;
      
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
    [chartType, authorsData, pieChartData, citationsData, createBarChart, createPieChart, createCitationsChart, loading]
  );

  useEffect(() => {
    if (loading || authorsData.length === 0 || !documentsData) {
      setContainersReady(false);
      return;
    }

    setContainersReady(false);
    let retryCount = 0;
    const maxRetries = 50;
    let cancelled = false;
    
    const checkContainers = () => {
      if (cancelled) return;
      
      const containers = [
        chartType === "bar-chart" || chartType === "all-charts" ? barChartRef.current : null,
        chartType === "pie-chart" || chartType === "all-charts" ? pieChartRef.current : null,
        chartType === "citations-chart" || chartType === "all-charts" ? citationsChartRef.current : null,
      ].filter(Boolean);

      if (containers.length === 0) {
        retryCount++;
        if (retryCount < maxRetries) {
          requestAnimationFrame(checkContainers);
        }
        return;
      }

      const allReady = containers.every(container => {
        if (!container) return true;
        const rect = container.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      if (allReady) {
        setContainersReady(true);
        setTimeout(() => {
          if (!cancelled) {
            createCharts(true);
          }
        }, 50);
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          requestAnimationFrame(checkContainers);
        }
      }
    };

    const timer = setTimeout(() => {
      checkContainers();
    }, 50);
    
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [loading, authorsData, documentsData, chartType, createCharts]);

  useEffect(() => {
    if (loading || authorsData.length === 0 || !documentsData || !containersReady) return;

    const debouncedResize = debounce(() => {
      if (!loading && authorsData.length > 0) {
        createCharts(false);
      }
    }, config.UI.CHART_RESIZE_DEBOUNCE);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          debouncedResize();
          break;
        }
      }
    });

    const chartContainers = [
      chartType === "bar-chart" || chartType === "all-charts" ? barChartRef.current : null,
      chartType === "pie-chart" || chartType === "all-charts" ? pieChartRef.current : null,
      chartType === "citations-chart" || chartType === "all-charts" ? citationsChartRef.current : null,
    ].filter(Boolean);

    chartContainers.forEach((container) => {
      if (container) {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          resizeObserver.observe(container);
        }
      }
    });

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      resizeObserver.disconnect();
    };
  }, [loading, authorsData, documentsData, createCharts, containersReady, chartType]);

  useEffect(() => {
    return () => {
      Object.values(chartInstancesRef.current).forEach((chart) => {
        if (chart?.destroy) chart.destroy();
      });
      chartInstancesRef.current = {};
    };
  }, []);

  const showLoading = loading || authorsData.length === 0 || !containersReady;

  return (
    <div id="charts" className="chart-container" style={{ position: 'relative', minHeight: showLoading ? '400px' : 'auto' }}>
      {showLoading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.95)'
        }}>
          <Loading message="Cargando gráficos..." />
        </div>
      )}
      <div style={{ opacity: showLoading ? 0 : 1, transition: 'opacity 0.2s', visibility: showLoading ? 'hidden' : 'visible' }}>
        {chartType === "bar-chart" && (
          <div className="chart-wrapper">
            <div id="bar-chart-container" ref={barChartRef} style={{ minHeight: '400px', width: '100%' }}></div>
          </div>
        )}
        {chartType === "pie-chart" && (
          <div className="chart-wrapper">
            <div id="pie-chart-container" ref={pieChartRef} style={{ minHeight: '400px', width: '100%' }}></div>
          </div>
        )}
        {chartType === "citations-chart" && (
          <div className="chart-wrapper">
            <div id="citations-chart-container" ref={citationsChartRef} style={{ minHeight: '400px', width: '100%' }}></div>
          </div>
        )}
        {chartType === "all-charts" && (
          <>
            <div className="chart-wrapper">
              <div id="bar-chart-container" ref={barChartRef} style={{ minHeight: '400px', width: '100%' }}></div>
            </div>
            <div className="chart-wrapper">
              <div id="pie-chart-container" ref={pieChartRef} style={{ minHeight: '400px', width: '100%' }}></div>
            </div>
            <div className="chart-wrapper">
              <div id="citations-chart-container" ref={citationsChartRef} style={{ minHeight: '400px', width: '100%' }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

Charts.displayName = "Charts";

export default Charts;

