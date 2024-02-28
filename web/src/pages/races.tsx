import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import { Container, Row, Col, Accordion, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchPebbleReps, raceHistory } from "../services/seizeApi";
import { motion } from "framer-motion";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface Pebble {
  id: number;
  name: string;
  seizer: string;
  rep: number;
  reppers?: string[];
  repGiven?: number[];
}

const LeaderboardPage = () => {
  const lastRace: number = raceHistory.length - 1;
  const currentRace = raceHistory[lastRace];
  const [pebbles, setPebbles] = useState<Pebble[]>(
    currentRace.pebbles
  );
  const pebbleNames = pebbles.map((peb) => peb.name.toLowerCase()).join("|");
  const currentRaces = currentRace.races;
  const [delay, setDelay] = useState(2420);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const reps: { [key: string]: number } = {}; // Add index signature to reps object

      for (const pebble of pebbles) {
        const reppers: string[] = [];
        const repGiven: number[] = [];
        const res = await fetchPebbleReps(pebble.seizer, currentRace);
        reps[pebble.name.toLowerCase()] = res.reduce(
          (
            acc: any,
            rep: {
              profile_handle: string;
              contents: { rating_category: string; new_rating: number };
            }
          ) => {
            if (
              rep.contents.rating_category
                .toLowerCase()
                .match(pebble.name.toLowerCase())
            ) {
              if (!reppers.includes(rep.profile_handle)) {
                reppers.push(rep.profile_handle);
                repGiven.push(rep.contents.new_rating);
                acc += rep.contents.new_rating;
              }
            }
            return acc;
          },
          0
        );
        pebble.reppers = reppers;
        pebble.repGiven = repGiven;
      }

      const validPebbles = pebbles.map((pebble) => {
        pebble.rep = reps[pebble.name.toLowerCase()] || 0;
        return pebble;
      });
      setPebbles(validPebbles);
      setDelay(delay * 1.1); // Increase delay by 10% each time
      // console.log("State of the Race:", JSON.stringify(validPebbles));
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  //const sortedPebbles = pebbles.sort((a, b) => b.rep - a.rep);
  const colors = [
    "#BF92FF80", // Light Purple with 50% transparency
    "#80DEEA80", // Light Cyan with 50% transparency
    "#FF80AB80", // Light Pink with 50% transparency
    "#E6EE9C80", // Light Lime with 50% transparency
    "#A5D6A780", // Light Green with 50% transparency
    "#CE93D880", // Light Magenta with 50% transparency
    "#FFAB9180", // Light Red with 50% transparency
    "#9FA8DA80", // Light Blue with 50% transparency
    "#80CBC480", // Light Aqua with 50% transparency
    "#FFF59D80", // Light Yellow with 50% transparency
    "#80CBC480", // Light Teal with 50% transparency
    "#B39DDB80", // Light Dark Purple with 50% transparency
    "#EF9A9A80", // Light Tomato with 50% transparency
    "#90CAF980", // Light Cerulean with 50% transparency
    "#F48FB180", // Light Crimson with 50% transparency
    "#BCAAA480", // Light Brown with 50% transparency
  ];
  const highestRep = Math.max(...pebbles.map((peb) => peb.rep));

  return (
    <>
      <Head>
        <title>Pebble Racing | Leaderboard at The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/races`} />
        <meta property="og:title" content={`Pebble Racing | The OM Pub`} />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container className={`${styles.main} leaderboard-container`}>
        <h1>Pebble Races</h1>
        <p>
          Welcome to the inaugural Pebble Race, where pebbles compete for glory
          and your precious rep. Add rep on Seize to boost your favorite racers!
        </p>
        {currentRaces.map((race, idx) => (
          <div className="race">
            <h4>Race {idx + 1}</h4>
            {[pebbles[race[0] - 1], pebbles[race[1] - 1]].map(
              (pebble, index) => (
                <div
                  className="progress-container"
                  style={{ position: "relative", flexGrow: 1 }}
                >
                  <div
                    className="progress"
                    style={{
                      backgroundColor: "#f0f0f0",
                      width: "100%",
                      borderRadius: "5px",
                      overflow: "hidden",
                      position: "absolute",
                    }}
                  >
                    <motion.div
                      className="progress-bar"
                      style={{
                        width: `${
                          highestRep ? (pebble.rep / highestRep) * 100 : 0
                        }%`,
                        backgroundColor: colors[idx % colors.length],
                        height: "100%",
                      }}
                      layout
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          highestRep ? (pebble.rep / highestRep) * 100 : 0
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <span
                    className="rep"
                    style={{ position: "absolute", zIndex: 1 }}
                  >
                    <img
                      src={`https://media.generator.seize.io/mainnet/thumbnail/10000000${String(
                        pebble.id
                      ).padStart(3, "0")}`}
                      alt={`${pebble.name}`}
                      className="pebble-image"
                    />
                    <a
                      href={`https://seize.io/${pebble.seizer}`}
                      target="_blank"
                      className="name"
                    >
                      {pebble.name} - {pebble.seizer}
                    </a>
                  </span>
                  <span
                    className="text"
                    title={`Unique reppers: ${pebble.reppers?.length}`}
                  >
                    {pebble.rep}
                  </span>
                </div>
              )
            )}
          </div>
        ))}
        <style jsx>{`
          .leaderboard-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            text-align: center;
          }
          .leaderboard-item {
            display: flex;
            justify-content: space-around;
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 5px;
            position: relative;
          }
          .rank,
          .name {
            margin: 0 10px;
            color: #2222ccaa;
            text-decoration: none;
            vertical-align: middle;
          }
          .progress-container {
            display: flex;
            align-items: center;
            flex-grow: 1;
            position: relative;
            margin: 0 10px;
            height: 80px;
          }
          .progress {
            width: 100%;
            height: 90%;
          }
          .progress-bar {
            transition: width 0.5s ease-in-out;
          }
          .text {
            position: absolute;
            z-index: 0;
            top: 50%;
            transform: translate(0, -50%);
            width: 100%;
            text-align: right;
            font-size: xx-large;
          }
          .pebble-image {
            width: 50px;
            height: 50px;
            border-radius: 10%;
            margin-left: 10px;
          }
        `}</style>
      </Container>
    </>
  );
};

export default LeaderboardPage;
