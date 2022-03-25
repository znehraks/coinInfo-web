import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ReactApexChart from "react-apexcharts";

interface IHistoricalData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
interface ChartProps {
  coinId: string;
  chartStyle: string;
}
const Chart = ({ coinId, chartStyle }: ChartProps) => {
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000,
    }
  );
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <>
          {chartStyle === "LINE" && (
            <ReactApexChart
              type="line"
              series={[
                {
                  name: "price",
                  data: data?.map((price) => +price.close.toFixed(4)) ?? [],
                },
              ]}
              options={{
                theme: {
                  mode: "dark",
                },
                chart: {
                  height: 300,
                  width: 500,
                  toolbar: {
                    show: false,
                  },
                  background: "transparent",
                },
                grid: {
                  show: false,
                },
                xaxis: {
                  labels: {
                    show: true,
                  },
                  axisTicks: {
                    show: true,
                  },
                  axisBorder: {
                    show: true,
                  },
                  categories: data?.map((value) =>
                    value.time_close.slice(2, 10)
                  ),
                },
                yaxis: {
                  show: true,
                },
                fill: {
                  type: "gradient",
                  // gradient: {
                  //   gradientToColors: ["blue"],
                  //   stops: [0, 100],
                  // },
                },
                colors: ["#4cd137"],
                stroke: {
                  curve: "smooth",
                  width: 4,
                },
                tooltip: {
                  y: {
                    formatter: (value) => `$ ${value.toFixed(4)}`,
                  },
                },
              }}
            />
          )}
          {chartStyle === "CANDLE" && (
            <ReactApexChart
              type="candlestick"
              series={[
                {
                  data:
                    data?.map((price) => {
                      return {
                        x: price.time_close.slice(2, 10),
                        y: [
                          price.open.toFixed(4),
                          price.high.toFixed(4),
                          price.low.toFixed(4),
                          price.close.toFixed(4),
                        ],
                      };
                    }) ?? [],
                },
              ]}
              options={{
                theme: {
                  mode: "dark",
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
                  background: "transparent",
                },
                grid: {
                  show: false,
                },
                stroke: {
                  curve: "smooth",
                  width: 1,
                },
                xaxis: {
                  axisBorder: {
                    color: "#fff",
                    show: true,
                  },
                  axisTicks: {
                    color: "#fff",
                    show: true,
                  },
                  labels: {
                    show: true,
                  },
                },
                yaxis: {
                  show: true,
                  axisTicks: {
                    color: "#fff",
                  },
                },
                tooltip: {
                  y: {
                    formatter: (value) => `$ ${value.toFixed(4)}`,
                  },
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
export default Chart;
