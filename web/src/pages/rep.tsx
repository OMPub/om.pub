import { fetchRep, timeAgo } from "@/services/seizeApi";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/Home.module.scss";
import { Form, Button, Card, Col, Row, Container } from "react-bootstrap";

const RepPage = () => {
  const delay = 500; // delay in milliseconds
  const [username, setUsername] = useState("");
  const [direction, setDirection] = useState("");
  const [matchText, setMatchText] = useState("");
  const [reps, setReps] = useState<RepResponse[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const timeoutRef = useRef<number | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [displayCount, setDisplayCount] = useState(20); // Number of reps to display initially
  const loader = useRef(null);

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

  const loadMore = (entries: any[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setDisplayCount((prevCount) => prevCount + 20); // Load 20 more reps when the user scrolls to the bottom
    }
  };

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setUsername(queryParams.get("username") || "");
    setDirection(queryParams.get("direction") || "outbound");
    setMatchText(queryParams.get("search") || "");
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
    console.log("queryParams", queryParams);
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
      return handleSubmit();
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
      {sortedReps.slice(0, displayCount).map((rep) => (
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
                {rep.contents.new_rating} from{" "}
                <a
                  href={"https://6529.io/" + rep.profile_handle}
                  target="_blank"
                >
                  {rep.profile_handle}
                </a>{" "}
                to{" "}
                <a
                  href={"https://6529.io/" + rep.target_profile_handle}
                  target="_blank"
                >
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
      <div ref={loader}>--</div>
    </Container>
  );
};

export default RepPage;
