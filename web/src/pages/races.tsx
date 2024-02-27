import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchPebbleReps } from "../services/seizeApi";
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
}

const LeaderboardPage = () => {
  const [pebbles, setPebbles] = useState<Pebble[]>([
    { id: 23, name: "Indigenous Journeys", seizer: "ryan", rep: 0 },
    { id: 423, name: "Blue Epoch", seizer: "blocknoob", rep: 0 },
  ]);
  const pebbleNames = pebbles.map((peb) => peb.name.toLowerCase()).join("|");

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = [];
      for (const pebble of pebbles) {
        const res = await fetchPebbleReps(pebble.seizer);
        data.push(res[0]);
      }
      const reps = data.reduce((acc, rep) => {
        let name = rep.contents.rating_category
          .toLowerCase()
          .match(pebbleNames)[0];
        if (name) {
          acc[name] = acc[name] || 0;
          acc[name] = rep.contents.new_rating;
        }
        return acc;
      }, {});

      const validPebbles = pebbles.map((pebble) => {
        pebble.rep = reps[pebble.name.toLowerCase()] || 0;
        return pebble;
      });
      setPebbles(validPebbles);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sortedPebbles = pebbles.sort((a, b) => b.rep - a.rep);
  const colors = [
    "#FFA6FE", // Pink Lavender
    "#00FFFF", // Cyan
    "#FF0099", // Neon Pink
    "#FFFF00", // Neon Yellow
    "#0AFF99", // Bright Green
    "#FF00FF", // Magenta
    "#FF0000", // Bright Red
    "#0000FF", // Blue
    "#01FFFE", // Aqua
    "#FFDB66", // Saffron
    "#006401", // Dark Green
    "#010067", // Midnight Blue
    "#95003A", // Dark Red
    "#007DB5", // Sky Blue
    "#FF00F6", // Bright Magenta
    "#774D00", // Bronze
  ];
  const highestRep = Math.max(...pebbles.map((peb) => peb.rep));

  return (
    <>
      <Head>
        <title>About | The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/faq`} />
        <meta property="og:title" content={`About | The OM Pub`} />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <div className="leaderboard-container">
        <h2>Pebble Race Leaderboard</h2>
        {sortedPebbles.map((pebble, index) => (
          <motion.div
            layout
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            key={pebble.id}
            className="leaderboard-item"
          >
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
                    backgroundColor: colors[index % colors.length],
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
              <span className="rep" style={{ position: "absolute", zIndex: 1 }}>
                <img
                  src={`https://media.generator.seize.io/mainnet/thumbnail/10000000${String(
                    pebble.id
                  ).padStart(3, "0")}`}
                  alt={`${pebble.name}`}
                  className="pebble-image"
                />
                <span className="rank">{index + 1}.</span>
                <span className="name">{pebble.name}</span>
                {pebble.rep}
              </span>
            </div>
          </motion.div>
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
            z-index: 2;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            text-align: center;
          }
          .pebble-image {
            width: 50px;
            height: 50px;
            border-radius: 10%;
            margin-left: 10px;
          }
        `}</style>
      </div>
    </>
  );
};

export default LeaderboardPage;
