import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import styles from "@/styles/Home.module.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
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
  const [votes, setVotes] = useState<Votes>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReps = async () => {
      setLoading(true);
      try {
        const data = await fetchAwardReps();
        setReps(data);
      } catch (error) {
        console.error("Error fetching reps:", error);
      }
      setLoading(false);
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
      {loading ? (
        <span className="center">
          <i className="fas fa-trophy"></i>
        </span>
      ) : (
        <Container>
          <Row>
            <Col>
              <h1>S6 Seizer Awards</h1>
              <h3>Cast your vote at seize.io</h3>
              <ol>
                <li>
                  Review{" "}
                  <a
                    href="https://seize.io/the-memes?szn=6&sort=age&sort_dir=ASC "
                    target="_blank"
                  >
                    SZN 6 Memes on Seize
                  </a>
                </li>
                <li>
                  Find the{" "}
                  <a
                    href="https://seize.io/community?page=1&curation=meme-artists-szn-6-sRm1dSEhAHJhtiKYysoKxb"
                    target="_blank"
                  >
                    SZN 6 artists on Seize
                  </a>
                </li>
                <li>
                  Rep on Seize with <pre>SAS6</pre> followed by the category
                  your want to vote for (existing categories will be listed)
                </li>
                <li>
                  Choose the amount of Rep you want to give: Only up to 10 will
                  count towards the awards, but you can give as much as you want
                </li>
                <li>
                  Create a new award if you want: use <pre>SAS6</pre> as the
                  prefix
                </li>
              </ol>
              {categories.map((category: string) => (
                <React.Fragment key={category}>
                  <Card className={styles.repCard}>
                    <Card.Body>
                      <Card.Title>{category}</Card.Title>
                      <Card.Text>
                        {votes[category].map((vote: any, index: number) => (
                          <span style={{ display: "block" }} key={index}>
                            {vote.rep} &mdash;{" "}
                            <a
                              href={`https://seize.io/${vote.nominee}`}
                              target="_blank"
                            >
                              {vote.nominee}
                            </a>{" "}
                            from{" "}
                            <a
                              data-tooltip-id={`tooltip-${index}`}
                              data-tooltip-content={vote.voters.join(", ")}
                              title={vote.voters.join(", ")}
                            >
                              {vote.voters.length +
                                (vote.voters.length > 1 ? " voters" : " voter")}
                            </a>
                            <Tooltip id={`tooltip-${index}`} place="right" wrapper="span"/>
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
      )}
      <style jsx>{`
        a {
          text-decoration: none;
          color: #02c;
        }
        pre {
          display: inline;
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          background-color: #000;
          border-radius: 0.2em;
        }
        .center {
          display: flex;
          justify-content: center;
        }
        .fas.fa-trophy {
          font-size: 13em;
          animation: pulse 0.69s infinite;
          color: #ddd;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};

export default AwardsPage;
