import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
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
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const authorsWithCount = storyLines.reduce((acc: any, storyLine) => {
    acc[storyLine.author] = (acc[storyLine.author] || 0) + 1;
    return acc;
  }, {});
  
  const sortedAuthors = Object.keys(authorsWithCount).sort();
  
  useEffect(() => {
    const authors = Array.from(new Set(storyLines.map((storyLine) => storyLine.author)));
    setSelectedAuthors(authors);
  }, [storyLines]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const author = event.target.name;
    if (selectedAuthors.includes(author)) {
      setSelectedAuthors(selectedAuthors.filter((a) => a !== author));
    } else {
      setSelectedAuthors([...selectedAuthors, author]);
    }
  };

  const sortedStoryLines = [...storyLines].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const visibleStoryLines = sortedStoryLines.filter((storyLine) =>
    selectedAuthors.includes(storyLine.author)
  );

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
        style={{ maxWidth: "850px", margin: "auto", padding: "20px" }}
      >
        <Row>
          <Col>
            <h1>Woman with Orange Hat</h1>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            {Array.from(
              new Set(storyLines.map((storyLine) => storyLine.author))
            ).sort((a, b) => authorsWithCount[b] - authorsWithCount[a]).map((author) => (
              <div key={author}>
                <Form.Check
                  type="checkbox"
                  id={`checkbox-${author}`}
                  name={author}
                  label={`${author} (${authorsWithCount[author]})`}
                  checked={selectedAuthors.includes(author)}
                  onChange={handleCheckboxChange}
                />
              </div>
            ))}
          </Col>
          <Col md={9}>
            <p>
              Who is WwOH? What is her story? Details are in{" "}
              <a
                style={{ textDecoration: "none" }}
                href="https://discord.com/channels/963043925554237482/1203782401843793971/1212814004255195136"
                target="_blank"
              >
                Proposal #25
              </a>
              .
            </p>
            <p style={{ overflow: "auto" }}>
              <button
                onClick={toggleSortOrder}
                style={{
                  float: "right",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#ccc",
                }}
              >
                {visibleStoryLines.length} / 420{" "}
                {sortOrder === "asc" ? "🔼" : "🔽"}
              </button>
            </p>
            {visibleStoryLines.map((storyLine) => (
              <Card className="story-line" style={{ border: "none" }}>
                <Card.Body>
                  <Card.Text
                    style={{ fontFamily: "Lora, serif", fontSize: "large" }}
                  >
                    {storyLine.text}
                  </Card.Text>
                  <Card.Subtitle
                    className="mb-2"
                    style={{ textAlign: "right", color: "#ccc" }}
                  >
                    by {storyLine.author} at&nbsp;
                    <span title={new Date(storyLine.timestamp).toISOString()}>
                      {timeAgo(storyLine.timestamp)}
                    </span>
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .story-line-info {
          text-align: right;
          color: #00f;
        }
      `}</style>
    </>
  );
};

export default StoryPage;
