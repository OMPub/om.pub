import { fetchRep, timeAgo } from "@/services/seizeApi";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.scss";
import { Form, Button, Card, Col, Row, Container } from "react-bootstrap";

const RepPage = () => {
  const [username, setUsername] = useState("");
  const [direction, setDirection] = useState("inbound");
  const [matchText, setMatchText] = useState("");
  const [repText, setRepText] = useState<RepResponse[]>([]);
  const delay = 500; // delay in milliseconds
  const timeoutRef = useRef<number | null>(null);

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

  const handleSubmit = async () => {
    try {
      const data = await fetchRep(username, direction, matchText);
      setRepText(data);
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
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Enter match text"
              value={matchText}
              onChange={(e) => setMatchText(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Check
              inline
              label="Inbound"
              type="radio"
              id="inbound"
              checked={direction === "inbound"}
              onChange={() => setDirection("inbound")}
            />
            <Form.Check
              inline
              label="Outbound"
              type="radio"
              id="outbound"
              checked={direction === "outbound"}
              onChange={() => setDirection("outbound")}
            />
          </Col>
        </Row>
      </Form>

      {repText.map((rep) => (
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
                from {' '}
                <a href={rep.profile_handle} target="_blank">
                  {rep.profile_handle}
                </a> {' '}
                to {' '}
                <a href={rep.target_profile_handle} target="_blank">
                  {rep.target_profile_handle}
                </a>
                , {' '}
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
