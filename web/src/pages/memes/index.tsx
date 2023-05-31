import Head from "next/head";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import dynamic from "next/dynamic";
import { Container, Row, Col } from 'react-bootstrap';

const Header = dynamic(() => import("../../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});


export default function Memes() {
  return (
    <>
      <Head>
        <title>About | The OM Pub</title>
        <meta
          property="og:url"
          content={`https://om.pub/faq`}
        />
        <meta
          property="og:title"
          content={`About | The OM Pub`}
        />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Header />
      <Container>
        <Row>
          <Col>
            <h2>The Memes by 6529</h2>
            <h3>A Digital Revolution Unfurls</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Another NFT collection?</h4>
            <p>
              Hardly.
              "The Memes by 6529" is a digital insurgency, an array of meme-themed NFTs on the Ethereum blockchain, devised by the world's most prominent collectooor Punk6529, and the multi-disciplinary artist, 6529er.
              The collection is not just about immortalizing memes in the digital realm; it's about leading the charge in advocating for a decentralized open metaverse (OM).
            </p>
            <p>
              The collection is an assembly of ERC-1155 tokens minted on a standalone Manifold contract, with the art preserved in the globally-distrubted vault of Arweave.
              The collection comprises collaborations with numerous esteemed artists, photographers, and 3D designers, highlighting diversity and versatility of creative expression.
            </p>
            <p>
              But "The Memes by 6529" is more than an art project...
              It's a movement.
              To build up a self-sovereign, decentralized metaverse community, the collection is designed for eventual mass adoption. It's ongoing seasons, edition sizes, and price make it accessible, to ensure many people can pick up a piece as one way to aid in spreading awareness and ownership of the open metaverse ideals.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Does "art" help create an Open Metaverse?</h4>
            <p>
              "The Memes by 6529" is not just a collection; it's a call to action.
              The mission? Amplify the urgency for a decentralized open metaverse - the OM.
              By immortalizing memes on the Ethereum blockchain, Punk6529 and team are offering a shared cultural experience as broad and diverse as the internet itself.
              This mirrors the vision for the open metaverse, a digital space that is owned and operated by the people who inhabit it.
            </p>
            <p>
              The very nature of the collection – its decentralization, its accessibility, and its community focus – reflects the principles of the open metaverse.
              In a world where digital power has consolidated to major corporations, "The Memes by 6529" offers a vision of a different future: one where power is in the hands of the many, not the few.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Join the Uprising: Embrace the Open Metaverse</h4>
            <p>
              Are you ready to be a part of building the future of the open metaverse?
              Eager for a movement that puts power back into the hands of individuals?
              There are many ways you can get involved.
            </p>
            <ol>
              <li>
                First, you can start by learning more about the open metaverse.
                Explore the education Twitter threads of [Punk6529](https://twitter.com/punk6529), and read about the impact of memetic ideas at [seize.io](https://seize.io/about/faq).
              </li>
              <li>
                The artwork of The Memes is always CC0 - free to use, remix, and share.
                When it's minted, it's released into the public domain.
                That means you can use it for your own projects, and even mint your own NFTs with the art or derivative works.
                Permission granted: you don't need to ask.
              </li>
              <li>
                Owning a piece from "The Memes by 6529" collection is another option.
                Not only will you be supporting the artists and the vision, but you'll also be contributing to the spread of awareness about the open metaverse.
                The collection was intentionally designed to be large and affordable, ensuring as many people as possible can participate in this unique cultural moment.
              </li>
              <li>
                Keep an eye out for collaborations with other artists and opportunities to contribute your own work to the growing body of rememes, that remix and share the core ideas.
                Remember, the open metaverse is a community-centric project, and every voice matters.
                Let yours be heard.
              </li>
            </ol>
            <p>
              Join us as we pave the way towards a more open, decentralized future. The revolution is here, and it beckons.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  )
}
