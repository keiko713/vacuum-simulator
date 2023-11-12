import "chart.js/auto";
import "chartjs-adapter-moment";
import { ChartData, ChartOptions } from "chart.js";
import React from "react";

import { Line } from "react-chartjs-2";

export type Props = {
  data: ChartData<"line">;
};

const TimeSeriesChart: React.FunctionComponent<Props> = (props) => {
  const { data } = props;

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
        ticks: {maxTicksLimit: 5}
      }
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    aspectRatio:4
  };
  return <div className="bg-white p-4"><Line data={data} options={options} /></div>;
};

export default TimeSeriesChart;
