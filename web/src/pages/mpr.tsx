import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import { Container, Row, Col, Table } from "react-bootstrap";
import React, { useEffect, useState, useMemo } from "react";
import { fetchMintfaceReps, timeAgo } from "@/services/seizeApi";
import cardInfo from "../../public/cardInfo.json";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface MemeCard {
  id: number;
  name: string;
  rep: number;
  lastRepTimestamp: number;
  cardName: string;
  artist: string;
  url: string;
  season: number;
  memeName: string;
  thumbnailUrl: string;
}

const MemeRankPage = () => {
  const [memeCards, setMemeCards] = useState<MemeCard[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedMemeCards = React.useMemo(() => {
    let sortableItems = [...memeCards];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof MemeCard];
        const bValue = b[sortConfig.key as keyof MemeCard];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        // Secondary sort by average rep
        const aAvgRep = a.rep;
        const bAvgRep = b.rep;
        if (aAvgRep < bAvgRep) {
          return 1;
        }
        if (aAvgRep > bAvgRep) {
          return -1;
        }

        return 0;
      });
    }
    return sortableItems;
  }, [memeCards, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const getMemeCards = async () => {
      try {
        const data = await fetchMintfaceReps();
        console.log(data);

        const processedCards = data.reduce(
          (
            acc: {
              [key: string]: {
                total: number;
                count: number;
                lastTimestamp: number;
              };
            },
            item: any
          ) => {
            const cardNumber = item.contents.rating_category.match(/\d+/)[0];
            const cardName = `Card ${cardNumber}`;

            if (!acc[cardName]) {
              acc[cardName] = { total: 0, count: 0, lastTimestamp: 0 };
            }

            acc[cardName].total += item.contents.new_rating;
            acc[cardName].count++;
            acc[cardName].lastTimestamp = item.created_at;

            return acc;
          },
          {}
        );

        const memeCards: MemeCard[] = Object.entries(processedCards).map(
          ([name, data]: [string, unknown]) => {
            const typedData = data as {
              total: number;
              count: number;
              lastTimestamp: number;
            };
            const id = parseInt(name.split(" ")[1], 10);
            const cardData = cardInfo[id.toString() as keyof typeof cardInfo];
            const seasonValue = (
              cardData?.metadata?.attributes as Array<{
                trait_type: string;
                value: string | number;
              }>
            )?.find((attr) => attr.trait_type === "Type - Season")?.value;
            const memeName = (
              cardData?.metadata?.attributes as Array<{
                trait_type: string;
                value: string;
              }>
            )?.find((attr) => attr.trait_type === "Meme Name")?.value ?? "";

            return {
              id,
              name,
              rep: typedData.total / typedData.count,
              lastRepTimestamp: typedData.lastTimestamp,
              cardName: cardData?.name ?? "",
              artist: cardData?.artist ?? "",
              url: `https://seize.io/the-memes/${id}`,
              season: seasonValue ? Number(seasonValue) : 0,
              thumbnailUrl: cardData?.thumbnail ?? "",
              memeName,
            };
          }
        );

        setMemeCards(memeCards.sort((a, b) => b.rep - a.rep));
      } catch (error) {
        console.error("Error fetching meme cards:", error);
      }
    };

    getMemeCards();
  }, []);

  return (
    <>
      <Head>
        <title>Meme Card Rankings | The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/mpr`} />
        <meta property="og:title" content={`Meme Card Rankings | The OM Pub`} />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container
        className={`${styles.main}`}
        style={{ maxWidth: "850px", margin: "auto", padding: "20px" }}
      >
        <Row>
          <Col>
            <h1>Meme Power Rankings</h1>
            <p>Rankings of meme cards based on rep sent to mintface.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => requestSort("id")}>Rank</th>
                  <th onClick={() => requestSort("cardName")}>Card Name</th>
                  <th onClick={() => requestSort("memeName")}>Meme Name</th>
                  <th onClick={() => requestSort("season")}>Season</th>
                  <th onClick={() => requestSort("artist")}>Artist</th>
                  <th onClick={() => requestSort("rep")}>Power Rank</th>
                  <th onClick={() => requestSort("lastRepTimestamp")}>
                    Last Rep
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMemeCards.map((card, index) => (
                  <tr key={card.id}>
                    <td>{index + 1}</td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={card.thumbnailUrl} alt={card.cardName} style={{width: '50px', height: '50px', marginRight: '10px', flexShrink: 0}} />
                      <a
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {card.cardName}
                      </a>
                    </td>
                    <td>{card.memeName}</td>
                    <td>{card.season}</td>
                    <td>{card.artist}</td>
                    <td title={card.rep.toString()} style={{ minWidth: '110px' }}>
                      {card.rep > 0
                        ? "🍒".repeat(Math.min(5, Math.round(card.rep)))
                        : "🪨".repeat(Math.min(5, Math.abs(Math.round(card.rep))))}
                    </td>
                    <td title={card.lastRepTimestamp.toString()}>
                      {timeAgo(new Date(card.lastRepTimestamp).getTime())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MemeRankPage;
