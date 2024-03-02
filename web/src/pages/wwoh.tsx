import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchMomoReps, timeAgo } from "@/services/seizeApi";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface StoryLine {
  id: number;
  author: string;
  text: string;
  timestamp: number;
}

const StoryPage = () => {
  const [storyLines, setStoryLines] = useState<StoryLine[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedStoryLines = [...storyLines].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };
  useEffect(() => {
    const getStoryLines = async () => {
      try {
        const data = await fetchMomoReps();
        setStoryLines(data);
      } catch (error) {
        console.error("Error fetching story lines:", error);
      }
    };

    getStoryLines();
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>Story Page | The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/wwoh`} />
        <meta
          property="og:title"
          content={`Woman with Orange Hat | The OM Pub`}
        />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container
        className={`${styles.main}`}
        style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}
      >
        <h1>Woman with Orange Hat</h1>
        <p>
          Who is WwOH? What is her story? Details are in <a style={{textDecoration: 'none'}} href="https://discord.com/channels/963043925554237482/1203782401843793971/1212814004255195136" target="_blank">Proposal #25</a>.
        </p>
        <p style={{ overflow: 'auto' }}>
          <button onClick={toggleSortOrder} style={{float: 'right', border: 'none', backgroundColor: '#fff'}}>
            {sortOrder === "asc" ? "🔼" : "🔽"}
          </button>
        </p>
        {sortedStoryLines.map((storyLine) => (
          <Card className="story-line" style={{border: 'none'}}>
            <Card.Body>
              <Card.Text style={{ fontFamily: "Lora, serif", fontSize: 'large' }}>
                {storyLine.text}
              </Card.Text>
              <Card.Subtitle
                className="mb-2"
                style={{ textAlign: "right", color: "#ccc" }}
              >
                by {storyLine.author} at&nbsp;
                <span title={new Date(storyLine.timestamp)}>
                  {timeAgo(storyLine.timestamp)}
                </span>
              </Card.Subtitle>
            </Card.Body>
          </Card>
        ))}
      </Container>
      <style jsx>{`
        .story-container {
          ,         
          .story-line {
          margin-bottom: 20px;
        }
        .story-line-info {
          text-align: right;
          color: #00f;
        }      
      `}</style>
    </>
  );
};

export default StoryPage;
