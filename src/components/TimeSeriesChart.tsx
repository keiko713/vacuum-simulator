import "chart.js/auto";
import "chartjs-adapter-moment";
import { ChartData, ChartOptions, TooltipItem } from "chart.js";
import React from "react";

import { Line } from "react-chartjs-2";

export type Props = {
  data: ChartData<"line">;
};

const TimeSeriesChart: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

  const tooltipLabel = (tooltipItem: TooltipItem<"line">) => {
    const vacuumLabel = tooltipItem.dataset.label?.endsWith("VACUUM");
    return vacuumLabel
      ? ` ${tooltipItem.dataset.label}`
      : ` ${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        type: "time",
        ticks: { maxTicksLimit: 7 },
        time: {
          displayFormats: {
            // Use 24hours format
            datetime: "MMM D, YYYY, HH:mm:ss",
            millisecond: "HH:mm:ss.SSS",
            second: "HH:mm:ss",
            minute: "HH:mm",
            hour: "HH:mm",
          },
        },
      },
      y: {
        ticks: { maxTicksLimit: 5 },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    aspectRatio: 4,
    plugins: {
      legend: {
        labels: {
          boxHeight: 0,
        },
      },
      tooltip: {
        callbacks: {
          label: tooltipLabel,
        },
      },
    },
  };
  return (
    <div className="p-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default TimeSeriesChart;
