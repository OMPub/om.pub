import { fetchRep, timeAgo } from "@/services/seizeApi";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.scss";
import { Form, Button, Card, Col, Row, Container } from "react-bootstrap";

const RepPage = () => {
  const delay = 500; // delay in milliseconds
  const [username, setUsername] = useState("");
  const [direction, setDirection] = useState("inbound");
  const [matchText, setMatchText] = useState("");
  const [reps, setReps] = useState<RepResponse[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const timeoutRef = useRef<number | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const sortedReps = [...reps].sort((a, b) => {
    if (sortOrder === "asc") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  interface RepResponse {
    id: string;
    profile_id: string;
    target_id: string;
    contents: {
      new_rating: number;
      old_rating: number;
      change_reason: string;
      rating_matter: string;
      rating_category: string;
    };
    type: string;
    created_at: string;
    profile_handle: string;
    target_profile_handle: string;
  }

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const data = await fetchRep(username, direction, matchText);
      setReps(data);
    } catch (error) {
      console.error("Error fetching rep:", error);
    }
  };

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      return username && handleSubmit();
    }, delay);

    // Clean up function
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [username, direction, matchText]);

  return (
    <Container
      className={`${styles.main}`}
      style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}
    >
      <h1>Rep Filter</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              ref={usernameRef}
              type="text"
              placeholder="Enter profile"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search text"
              value={matchText}
              onChange={(e) => setMatchText(e.target.value)}
            />
          </Col>
          <Col xs="3">
            <Form.Check
              inline
              label="Rep In"
              type="radio"
              id="inbound"
              checked={direction === "inbound"}
              onChange={() => setDirection("inbound")}
            />
            <Form.Check
              inline
              label="Rep Out"
              type="radio"
              id="outbound"
              checked={direction === "outbound"}
              onChange={() => setDirection("outbound")}
            />
          </Col>
          <Col xs="1">
            <Button
              onClick={toggleSortOrder}
              style={{
                float: "right",
                border: "none",
                backgroundColor: "#fff",
              }}
            >
              {sortOrder === "asc" ? "🔼" : "🔽"}
            </Button>
          </Col>
        </Row>
      </Form>
      {sortedReps.map((rep) => (
        <>
          <Card className="rep" style={{ border: "none" }}>
            <Card.Body>
              <Card.Text
                style={{ fontFamily: "Lora, serif", fontSize: "large" }}
              >
                {rep.contents.rating_category}
              </Card.Text>
              <Card.Subtitle
                className="mb-2"
                style={{ textAlign: "right", color: "#ccc" }}
              >
                from{" "}
                <a href={'https://seize.io/' + rep.profile_handle} target="_blank">
                  {rep.profile_handle}
                </a>{" "}
                to{" "}
                <a href={'https://seize.io/' + rep.target_profile_handle} target="_blank">
                  {rep.target_profile_handle}
                </a>
                ,{" "}
                <span title={new Date(rep.created_at).toISOString()}>
                  {timeAgo(new Date(rep.created_at).getTime())}
                </span>
              </Card.Subtitle>
            </Card.Body>
          </Card>
          <style jsx>{`
            a {
              text-decoration: none;
              color: #2222cc55;
            }
          `}</style>
        </>
      ))}
    </Container>
  );
};

export default RepPage;
