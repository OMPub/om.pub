import styles from "./ArtistProfile.module.scss";
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import { alignPropType } from "react-bootstrap/esm/types";

const ArtistProfile = () => {
  const images = [
    '/artist-83/work-1.jpeg',
    '/artist-83/work-2.jpeg',
    '/artist-83/work-3.jpeg',
  ];
  const artworkUrl = '/artist-83/poster.png';
  const artistInfo = 
`We are proud to welcome Luna Leonis to the 6529 Meme artist family. 

She's well known for creating whimsical and magical digital art. Her artwork tells stories conveyed through vibrant colors and bold patterns, capturing the imagination of her viewers. Her use of the moon (thus the name Luna) creates a dreamlike quality in her pieces.

Luna's style uniquely blends color, texture, and form. Her pieces often incorporate intricate details inviting viewers to explore and discover hidden meanings. Her artwork reflects her creative spirit, allowing her to share her vision with the world.

Luna has been recognized for her work in the NFT community and has gained a following of notable collectors, including @blocknoob, PAK, and Cozomo. Her pieces have been sold on SuperRare, Foundation, and she has even minted on Tezos.

In addition to her work as an artist, Luna also advocates for women's empowerment through her artwork. Her statement:

"I am me. Plain. Simple. Thriving. Loving. Invincible. I am a woman." Speaks volumes. 

Luna's art embodies a sense of wonder and imagination, inviting the viewer to experience a world of whimsy and magic. We can't wait to see what she has created for our community...and the world.`;

  return (
    <div className="pb-5">
      <Container className={`${styles.main}`}>
        <Row>
          <Col 
            className={`${styles.artistPoster}`}
            md={5}>
            <img src={artworkUrl} alt="Artwork" className={`img-fluid ${styles.shadow}`} />

          </Col>
          <Col
            md={4}>
            <Row>
              <h3 className={`${styles.artistName}`}>
                Luna Leonis: Meme Artist 83
              </h3>
              <ReactMarkdown>{artistInfo}</ReactMarkdown>
            </Row>

          </Col>
          <Col className={`${styles.artistWorks}`}>
            <Row>
              <Carousel interval={3000}>
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img src={image} alt={`carousel item ${index}`} className="d-block w-100" />
                  </Carousel.Item>
                ))}
              </Carousel>
              <h3>Previous Work</h3>
            </Row>
            <Row className={`${styles.artistLinks}`}>
                <a href="https://twitter.com/lunaleonis" target="_blank">Luna's Twitter</a> 
                <a href="https://linktr.ee/lunaleonis" target="_blank">Luna's Linktree</a>
                <a href="https://discord.gg/JAhzGprv" target="_blank">Luna's Wonderland Discord Server</a>
            </Row>
            <Row>
              <Button
                variant="outline-dark"
                size="lg"
                className={`${styles.seizeButton}`}>
                Seize in 24:42!
              </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ArtistProfile;
