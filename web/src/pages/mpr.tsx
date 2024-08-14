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
  rank: number | null;
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

        if (aValue === null && bValue === null) return 0;
        if (aValue === null)
          return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue === null)
          return sortConfig.direction === "ascending" ? -1 : 1;

        let compareResult;
        if (typeof aValue === "string" && typeof bValue === "string") {
          compareResult = aValue
            .toLowerCase()
            .localeCompare(bValue.toLowerCase());
        } else {
          compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }

        if (compareResult !== 0) {
          return sortConfig.direction === "ascending"
            ? compareResult
            : -compareResult;
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

    // Assign ranks to cards with ratings
    let currentRank = 1;
    sortableItems.forEach((card, index) => {
      if (card.rep !== 0) {
        card.rank = currentRank++;
      } else {
        card.rank = null;
      }
    });

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
            const memeName =
              (
                cardData?.metadata?.attributes as Array<{
                  trait_type: string;
                  value: string;
                }>
              )?.find((attr) => attr.trait_type === "Meme Name")?.value ?? "";

            return {
              id,
              name,
              rep: typedData.count > 0 ? typedData.total / typedData.count : 0,
              lastRepTimestamp: typedData.lastTimestamp,
              cardName: cardData?.name ?? "",
              artist: cardData?.artist ?? "",
              url: `https://seize.io/the-memes/${id}`,
              season: seasonValue ? Number(seasonValue) : 0,
              thumbnailUrl: cardData?.thumbnail ?? "",
              memeName,
              rank: null,
            };
          }
        );

        // Add missing cards (1 through 155)
        for (let i = 1; i <= 155; i++) {
          if (!memeCards.some((card) => card.id === i)) {
            const cardData = cardInfo[i.toString() as keyof typeof cardInfo];
            const seasonValue = (
              cardData?.metadata?.attributes as Array<{
                trait_type: string;
                value: string | number;
              }>
            )?.find((attr) => attr.trait_type === "Type - Season")?.value;
            const memeName =
              (
                cardData?.metadata?.attributes as Array<{
                  trait_type: string;
                  value: string;
                }>
              )?.find((attr) => attr.trait_type === "Meme Name")?.value ?? "";

            memeCards.push({
              id: i,
              name: `Card ${i}`,
              rep: 0,
              lastRepTimestamp: 0,
              cardName: cardData?.name ?? "",
              artist: cardData?.artist ?? "",
              url: `https://seize.io/the-memes/${i}`,
              season: seasonValue ? Number(seasonValue) : 0,
              thumbnailUrl: cardData?.thumbnail ?? "",
              memeName,
              rank: null,
            });
          }
        }

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
        <title>Memetic Power Ratings | The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/mpr`} />
        <meta
          property="og:title"
          content={`Memetic Power Ratings | The OM Pub`}
        />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container
        className={`${styles.main}`}
        style={{ maxWidth: "850px", margin: "auto", padding: "20px", fontSize: "1.3rem" }}
      >
        <Row>
          <Col>
            <h1>Memetic Power Ratings</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              Memetic Power Ratings (MPR) by MintFace empowers frens on Seize to
              upvote or downvote any meme. You can:
            </p>
            <ul style={{ listStyleType: "none" }}>
              <li>🍒 rate your favorite SZN1 - SZN4 memes between +1 and +5 rep</li>
              <li>🪨 downrate memes you love to hate between -1 and -5 rep</li>
              <li>
                👉 place an MPR vote by sending "Card xx" rep from -5 to +5 rep per card to{" "}
                <a
                  href="https://seize.io/mintface/rep"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  /mintface
                </a>{" "}
              </li>
              <li>
                {" "}
                📊 eg:{" "}
                <pre style={{ display: "inline" }}>
                  Category: Card 53 | Total Rep: 5
                </pre>{" "}
              </li>
            </ul>
            <p>
              Votes are totalled and given a live Memetic Power Rating between
              -5 and +5.
            </p>
            <p>🍒 All positive meme ratings get cherry emojis.</p>
            <p>🪨 All negative meme ratings get rock emojis.</p>
          </Col>
          </Row>
          <Row>
          <Col>
            <aside
              style={{
                backgroundColor: "#f8f9fa",
                padding: "0.5em",
                borderRadius: "0.5em",
                fontSize: "0.8em",
                fontStyle: "italic",
              }}
            >
              <p>Dashboard created by <a href="https://seize.io/brookr/rep" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>/brookr</a>.
                If you got value from the MPR Dashboard, send rep, Ξ, memes, or
                +vibes. <br />Get a Dashboard for YOUR project via ✅ CheckID FlashDash</p>
            </aside>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => requestSort("rank")}>Rank</th>
                  <th onClick={() => requestSort("rep")}>MPR</th>
                  <th onClick={() => requestSort("cardName")}>Card Name</th>
                  <th onClick={() => requestSort("memeName")}>Meme Name</th>
                  <th onClick={() => requestSort("id")}>Card</th>
                  <th onClick={() => requestSort("season")}>Season</th>
                  <th onClick={() => requestSort("lastRepTimestamp")}>
                    Last Rep
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMemeCards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.rank !== null ? card.rank : "--"}</td>
                    <td
                      title={card.rep.toString()}
                      style={{ minWidth: "130px" }}
                    >
                      {card.rep > 0
                        ? "🍒".repeat(Math.min(5, Math.round(card.rep)))
                        : "🪨".repeat(
                            Math.min(5, Math.abs(Math.round(card.rep)))
                          )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={card.thumbnailUrl}
                          alt={card.cardName}
                          style={{
                            width: "50px",
                            height: "auto",
                            marginRight: "10px",
                            flexShrink: 0,
                            objectFit: "contain",
                          }}
                        />
                        <a
                          href={card.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textDecoration: "none",
                          }}
                        >
                          {card.cardName}
                        </a>
                      </div>
                    </td>
                    <td>{card.memeName}</td>
                    <td>{card.id}</td>
                    <td>{card.season}</td>
                    <td
                      title={
                        card.lastRepTimestamp > 0
                          ? card.lastRepTimestamp.toString()
                          : "--"
                      }
                    >
                      {card.lastRepTimestamp
                        ? timeAgo(new Date(card.lastRepTimestamp).getTime())
                        : "--"}
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
