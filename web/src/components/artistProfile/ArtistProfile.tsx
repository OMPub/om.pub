import styles from "./ArtistProfile.module.scss";
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';

const ArtistProfile = () => {
  const images = [
    '/artist-83/work-1.jpeg',
    '/artist-83/work-2.jpeg',
    '/artist-83/work-3.jpeg',
  ];
  const artworkUrl = '/artist-83/poster.png';

  return (
    <div className="pb-5">
      <Container className={`${styles.main}`}>
        <Row>
          <Col 
            className={`${styles.artistPoster}`}
            md={6}>
            <img src={artworkUrl} alt="Artwork" className={`img-fluid ${styles.shadow}`} />
            <Button
              variant="outline-dark"
              size="lg"
              className={`${styles.seizeButton}`}>
              Seize in 24:42!
            </Button>
          </Col>
          <Col
            md={{ span: 5, offset: 1 }}>
            <Row>
              <h3 className={`${styles.artistName}`}>
                Luna Leonis
              </h3>
              <p className={`${styles.artistInfo}`}>
                Meme Artist 83
              </p>
              <p className={`${styles.artistInfo}`}>
                With a background in color and photogeometricnessly merger of 3d images and et cetera.
              </p>
            </Row>
            <Row className={`${styles.artistLinks}`}>
              <p>
              <a href="https://twitter.com/lunaleonis" target="_blank">Luna's Twitter</a>
              </p> 
              <p>
                <a href="https://linktr.ee/lunaleonis" target="_blank">Luna's Linktree</a>
              </p>
              <p>
                <a href="https://discord.gg/JAhzGprv" target="_blank">Luna's Wonderland Discord Server</a>
              </p>
            </Row>
            <Row className={`${styles.artistWorks}`}>
              <h3>Previous Work</h3>
              <Carousel interval={3000}>
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img src={image} alt={`carousel item ${index}`} className="d-block w-100" />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ArtistProfile;
