import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import Chart from "./Chart";
import Price from "./Price";
import LineChartImg from "../images/line.PNG";
import CandleChartImg from "../images/candle.PNG";
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  img {
    width: 45px;
    margin-right: 5px;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;
const GoBackBtn = styled.button`
  font-size: 16px;
  background-color: inherit;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  margin-bottom: 5px;
  border-radius: 10px;
  cursor: pointer;
  :hover {
    color: ${(props) => props.theme.accentColor};
  }
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;
const ChartTabs = styled(Tabs)`
  grid-template-columns: repeat(2, 1fr);
`;
const ChartTab = styled(Tab)`
  font-size: 12px;
  img {
    width: 80%;
    height: 50px;
  }
`;
interface ILocation {
  state: {
    name: string;
  };
}
interface IinfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface ITickersData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: string;
      percent_from_price_ath: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as ILocation;
  const navigate = useNavigate();
  const chartMatch = useMatch("/:coinId/chart");
  const [chartStyle, setChartStyle] = useState("LINE");
  const { isLoading: infoLoading, data: infoData } = useQuery<IinfoData>(
    ["info", coinId!],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<ITickersData>(
      ["tickers", coinId!],
      () => fetchCoinTickers(coinId!),
      {
        refetchInterval: 5000,
      }
    );
  //   const [loading, setLoading] = useState(true);
  //   const [info, setinfo] = useState<IinfoData>();
  // const [priceinfo, setPriceinfo] = useState<ITickersData>();
  //   useEffect(() => {
  //     (async () => {
  //       const infoData = await (
  //         await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //       ).json();
  //       console.log(infoData);
  //       setinfo(infoData);
  //       const priceData = await (
  //         await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //       ).json();
  //       console.log(priceData);
  //       setPriceinfo(priceData);
  //       setLoading(false);
  //     })();
  //   }, [coinId]);
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          <img
            src={`https://cryptocurrencyliveprices.com/img/${coinId}.png`}
            alt="logo"
          ></img>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <GoBackBtn onClick={() => navigate(-1)}>GoBack</GoBackBtn>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs></Tabs>
          {chartMatch !== null && (
            <>
              Chart Select
              <ChartTabs>
                <ChartTab
                  isActive={chartStyle === "LINE"}
                  onClick={() => setChartStyle("LINE")}
                >
                  LineChart
                  <img src={LineChartImg} alt="line-chart"></img>
                </ChartTab>
                <ChartTab
                  isActive={chartStyle === "CANDLE"}
                  onClick={() => setChartStyle("CANDLE")}
                >
                  Candle
                  <img src={CandleChartImg} alt="candle-chart"></img>
                </ChartTab>
              </ChartTabs>
            </>
          )}
          <Routes>
            <Route path={`price`} element={<Price />} />
            <Route
              path={`chart`}
              element={<Chart coinId={coinId!} chartStyle={chartStyle!} />}
            />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
