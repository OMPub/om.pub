import { useState, useEffect } from "react";
import Head from "next/head";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import dynamic from "next/dynamic";
import { Container, Row, Col, Table } from "react-bootstrap";
import { getLatestCardNumber } from "../../services/seizeApi";

const Header = dynamic(() => import("../../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface ArtistInfo {
  cardId: string;
  artistName: string;
  seizeProfile: string;
  season: number;
  mintDate: string;
}

interface CardAttribute {
  trait_type: string;
  value: string;
}

interface CardMetadata {
  attributes: CardAttribute[];
}

interface CardInfo {
  metadata: CardMetadata;
}

interface CardInfoMap {
  [key: string]: CardInfo;
}

const ArtistsPage = () => {
  const [artists, setArtists] = useState<ArtistInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArtistInfo;
    direction: 'asc' | 'desc';
  }>({ key: 'cardId', direction: 'asc' });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/cardInfo.json');
        const cardInfo: CardInfoMap = await response.json();
        const lastKnownCard = Math.max(...Object.keys(cardInfo).map(Number));
        
        const latestCardNumber = await getLatestCardNumber();
        if (latestCardNumber > lastKnownCard) {
          console.log(`Found ${latestCardNumber - lastKnownCard} new cards that need to be added to cardInfo.json`);
        }
        
        const artistsList: ArtistInfo[] = Object.entries(cardInfo).map(([cardId, card]) => {
          const artistAttr = card.metadata.attributes.find(
            (attr: CardAttribute) => attr.trait_type === "Artist"
          );
          const seizeProfileAttr = card.metadata.attributes.find(
            (attr: CardAttribute) => attr.trait_type === "SEIZE Artist Profile"
          );
          const seasonAttr = card.metadata.attributes.find(
            (attr: CardAttribute) => attr.trait_type === "Type - Season"
          );

          return {
            cardId,
            artistName: artistAttr?.value || "",
            seizeProfile: seizeProfileAttr?.value || artistAttr?.value?.toLowerCase().replace(/ /g, '_') || "",
            season: parseInt(seasonAttr?.value || "0"),
            mintDate: card.mint_date ? new Date(card.mint_date).toLocaleDateString() : ""
          };
        }).filter(artist => artist.artistName !== "");

        setArtists(artistsList);
      } catch (err) {
        console.error("Error loading cardInfo.json:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const sortData = (key: keyof ArtistInfo) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...artists].sort((a, b) => {
      if (key === 'cardId') {
        return direction === 'asc' 
          ? parseInt(a[key]) - parseInt(b[key])
          : parseInt(b[key]) - parseInt(a[key]);
      }
      
      return direction === 'asc'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setArtists(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof ArtistInfo) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Artists | The OM Pub</title>
          <meta property="og:url" content="https://om.pub/memes/artists" />
          <meta property="og:title" content="Artists | The OM Pub" />
          <meta property="og:image" content="/om-pub-logo.webp" />
        </Head>
        <Header />
        <Container>
          <Row>
            <Col>
              <h2>Loading artists...</h2>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Artists | The OM Pub</title>
        <meta property="og:url" content="https://om.pub/memes/artists" />
        <meta property="og:title" content="Artists | The OM Pub" />
        <meta property="og:image" content="/om-pub-logo.webp" />
      </Head>
      <Header />
      <Container>
        <Row>
          <Col>
            <h2>The Memes Artists</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table hover responsive>
              <thead>
                <tr>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => sortData('cardId')}
                  >
                    Card ID{getSortIndicator('cardId')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => sortData('season')}
                  >
                    Season{getSortIndicator('season')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => sortData('artistName')}
                  >
                    Artist Name{getSortIndicator('artistName')}
                  </th>
                  <th>Seize Profile</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => sortData('mintDate')}
                  >
                    Minted{getSortIndicator('mintDate')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist.cardId}>
                    <td>
                      <a
                        href={`https://seize.io/the-memes/${artist.cardId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {artist.cardId}
                      </a>
                    </td>
                    <td>{artist.season}</td>
                    <td>{artist.artistName}</td>
                    <td>
                      <a
                        href={`https://seize.io/${artist.seizeProfile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {artist.seizeProfile}
                      </a>
                    </td>
                    <td>{artist.mintDate}</td>
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

export default ArtistsPage;
