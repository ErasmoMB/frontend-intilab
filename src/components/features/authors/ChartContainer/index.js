import React, { useMemo, memo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ChartContainer = memo(({ autor }) => {
  const subjectAreaData = useMemo(() => {
    const rawAreas = autor?.subjectArea?.length ? autor.subjectArea : (autor?.areasTematicas || []);
    if (!Array.isArray(rawAreas) || rawAreas.length === 0) return [];

    return rawAreas.map((area) => {
      const name = area?.["$"] || area?.name || area?.label || "Sin área";
      const frequency = parseInt(area?.["@frequency"] || area?.frequency || area?.value || 0, 10);
      return {
        name,
        y: Number.isFinite(frequency) && frequency > 0 ? frequency : 1,
      };
    });
  }, [autor]);

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        height: 200,
        width: null,
        backgroundColor: "transparent",
        spacing: [10, 10, 10, 10],
        margin: [10, 10, 10, 10],
        animation: false,
      },
      title: {
        text: "Áreas Temáticas",
        align: "center",
        style: {
          color: "#000",
          fontSize: "14px",
          fontWeight: "bold",
        },
        margin: 5,
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      legend: {
        enabled: true,
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        width: 150,
        itemStyle: {
          fontSize: "10px",
          fontWeight: "normal",
          textOverflow: "ellipsis",
          width: "135px",
        },
        itemMarginBottom: 6,
        symbolRadius: 0,
        symbolHeight: 10,
        symbolWidth: 10,
        symbolPadding: 5,
        x: 0,
        y: 0,
        labelFormatter: function () {
          const maxLength = 25;
          const name = this.name.length > maxLength 
            ? this.name.substring(0, maxLength) + "..." 
            : this.name;
          return `${name}: <b>${this.percentage.toFixed(1)}%</b>`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          center: ["32%", "50%"],
          size: 140,
          innerSize: 0,
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Porcentaje",
          colorByPoint: true,
          data: subjectAreaData,
        },
      ],
      credits: {
        enabled: false,
      },
      responsive: {
        rules: [
          {
            condition: { maxWidth: 480 },
            chartOptions: {
              chart: { height: 200 },
              title: { style: { fontSize: "12px" } },
              legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
                width: 140,
                itemStyle: { fontSize: "8px", width: "125px" },
                itemMarginBottom: 4,
                symbolHeight: 8,
                symbolWidth: 8,
              },
              plotOptions: {
                pie: {
                  size: 100,
                  center: ["32%", "50%"],
                },
              },
            },
          },
          {
            condition: { maxWidth: 768 },
            chartOptions: {
              chart: { height: 180 },
              title: { style: { fontSize: "13px" } },
              legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
                width: 140,
                itemStyle: { fontSize: "9px", width: "125px" },
                itemMarginBottom: 5,
                symbolHeight: 9,
                symbolWidth: 9,
              },
              plotOptions: {
                pie: {
                  size: 120,
                  center: ["30%", "50%"],
                },
              },
            },
          },
        ],
      },
    }),
    [subjectAreaData]
  );

  if (subjectAreaData.length === 0) {
    return null;
  }

  return (
    <div className="chart-inner">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
});

ChartContainer.displayName = "ChartContainer";

export default ChartContainer;

