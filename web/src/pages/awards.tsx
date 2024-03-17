import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchAwardReps, timeAgo } from "@/services/seizeApi";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface Rep {
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

interface Vote {
  [category: string]: [
    { name: string; nominee: string; rep: number; voters: string[] }
  ];
}

type Votes = {
  [category: string]: Vote[];
};

const AwardsPage = () => {
  const [reps, setReps] = useState<Rep[]>([]);
  const [votes, setVotes] = useState<Votes>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const getReps = async () => {
      try {
        const data = await fetchAwardReps();
        setReps(data);
      } catch (error) {
        console.error("Error fetching reps:", error);
      }
    };

    getReps();
  }, []);

  // update votes when rep changes
  useEffect(() => {
    const getVotes = async () => {
      try {
        const data = reps.reduce((acc: any, item: any) => {
          // collate reps by category, as key, with total rep for each nominee and their voters as value,
          // e.g. { "SAS6 Best Rememer": [{ nominee: 'RegularDad', rep: 10, voters: ["user1", "user2"] }] }
          let rep = item.contents.new_rating;
          rep = rep > 10 ? 10 : rep < 0 ? 0 : rep;
          if (acc[item.contents.rating_category]) {
            const nominee = acc[item.contents.rating_category].find(
              (x: any) => x.nominee === item.target_profile_handle
            );
            if (nominee) {
              nominee.rep += rep;
              nominee.voters.push(item.profile_handle);
            } else {
              acc[item.contents.rating_category].push({
                name: item.contents.rating_category,
                nominee: item.target_profile_handle,
                rep: rep,
                voters: [item.profile_handle],
              });
            }
          } else {
            acc[item.contents.rating_category] = [
              {
                name: item.contents.rating_category,
                nominee: item.target_profile_handle,
                rep: rep,
                voters: [item.profile_handle],
              },
            ];
          }

          return acc;
        }, []);

        for (let category in data) {
          data[category].sort((a: any, b: any) => b.rep - a.rep);
        }

        setVotes(data);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    getVotes();
  }, [reps]);

  // update categories when votes change
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = Object.keys(votes);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, [votes]);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <title>Awards Page | The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/awards`} />
        <meta property="og:title" content="Seizer Awards Szn 6 | The OM Pub" />
        <meta
          property="og:description"
          content="Seizer Awards Szn 6 | The OM Pub"
        />
        <meta property="og:image" content="https://om.pub/og-image.jpg" />
      </Head>
      <Header />
      <Container>
        <Row>
          <Col>
            <h1>S6 Seizer Awards</h1>
            {categories.map((category: string) => (
              <React.Fragment key={category}>
                <Card className={styles.repCard}>
                  <Card.Body>
                    <Card.Title>{category}</Card.Title>
                    <Card.Text>
                      {votes[category].map((vote: any, index: number) => (
                        <span style={{display: 'block'}} key={index}>
                          {vote.rep} &mdash;{" "}
                          <a
                            href={`https://seize.io/${vote.nominee}`}
                            target="_blank"
                          >
                            {vote.nominee}
                          </a>{" "}
                          from{" "}
                          <span title={vote.voters.join(", ")}>
                            {vote.voters.length +
                              (vote.voters.length > 1 ? " voters" : " voter")}
                          </span>
                        </span>
                      ))}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </React.Fragment>
            ))}
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        a {
          text-decoration: none;
          color: #02c;
        }
      `}</style>
    </>
  );
};

export default AwardsPage;
