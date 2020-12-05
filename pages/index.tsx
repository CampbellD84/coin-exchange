import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  Box,
  Grommet,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from "grommet";
import { deepMerge } from 'grommet/utils';


const theme = deepMerge({
  global: {
    font: {
      family: "Inter"
    }
  },
  table: {
    body: {
      align: "center",
      pad: { horizontal: "large", vertical: "xsmall" },
      border: "horizontal"
    },
    extend: () => `font-family: Inter`,
    footer: {
      align: "start",
      border: undefined,
      pad: { horizontal: "large", vertical: "small" },
      verticalAlign: "bottom"
    },
    header: {
      align: "center",
      border: "bottom",
      fill: "horizontal",
      pad: { horizontal: "large", vertical: "xsmall" },
      verticalAlign: "bottom",
      background: {
        color: "accent-4",
        opacity: "strong"
      }
    }
  }
});

type Data = {

}
export default function Home({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {


  const percentFormat = (num: number) => `${Number(num).toFixed(2)}%`;

  const dollarFormat = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(num);
  };

  return (
    <Grommet theme={theme} full>
      <Head>
        <title>Faux Market Cap</title>
      </Head>
      <Box align="center" pad="large">
        <Heading>Faux Market Cap</Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>24Hr Change</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Market Cap</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>
                  <img
                    src={coin.image}
                    alt={`logo for ${coin.symbol}`}
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 15
                    }}
                  />
                  {coin.symbol.toUpperCase()}
                </TableCell>
                <TableCell>
                  <Text
                    color={
                      coin.price_change_percentage_24h > 0
                        ? "status-ok"
                        : "status-critical"
                    }
                  >
                    {percentFormat(coin.price_change_percentage_24h)}
                  </Text>
                </TableCell>
                <TableCell>{dollarFormat(coin.current_price)}</TableCell>
                <TableCell>{dollarFormat(coin.market_cap)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Grommet>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
  const data: Data = await res.json()

  return {
    props: {
      data
    }
  }
};
