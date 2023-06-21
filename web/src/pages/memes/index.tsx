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
        <Row>
          <Col>
            <h4>The Prememes</h4>
            <p>
              Before new meme cards are minted, the artists are announced on Twitter.
              In that magical time between the announcement and the minting, we can only guess what artist wonders the artist's vision will bring.
              That guess is a PREMEME: an introduction to the artist's style, paired with notes on their background and some highlights of their previous work.
            </p>
            <p>
              The prememe is a way to get to know the artist, and to get share our excitement about the upcoming mint.
            </p>
            <ul>
              <li>Season 3</li>
              <ul>
                <li>Artist Preview: <a href="/memes/118/artist">Meme Artist 118 - ???</a></li>
                <li>Artist Preview: <a href="/memes/117/artist">Meme Artist 117 - CARDELUCCI</a></li>
                <li>Artist Preview: <a href="/memes/116/artist">Meme Artist 116 - ???</a></li>
                <li>Artist Preview: <a href="/memes/115/artist">Meme Artist 115 - ???</a></li>
                <li>Artist Preview: <a href="/memes/114/artist">Meme Artist 114 - Camibus</a></li>
                <li>Artist Preview: <a href="/memes/113/artist">Meme Artist 113 - Laura El</a></li>
                <li>Artist Preview: <a href="/memes/112/artist">Meme Artist 112 - Nikolina Petolas</a></li>
                <li>Artist Preview: <a href="/memes/111/artist">Meme Artist 111 - yakob</a></li>
                <li>Artist Preview: <a href="/memes/110/artist">Meme Artist 110 - YuYu</a></li>
                <li>Artist Preview: <a href="/memes/109/artist">Meme Artist 109 - Unknown</a></li>
                <li>Artist Preview: <a href="/memes/108/artist">Meme Artist 108 - Donglu Yu</a></li>
                <li>Artist Preview: <a href="/memes/107/artist">Meme Artist 107 - yungwknd</a></li>
                <li>Artist Preview: <a href="/memes/106/artist">Meme Artist 106 - ICKI / noCreative</a></li>
                <li>Artist Preview: <a href="/memes/105/artist">Meme Artist 105 - José Ramos</a></li>
                <li>Artist Preview: <a href="/memes/104/artist">Meme Artist 104 - Timpers</a></li>
                <li>Artist Preview: <a href="/memes/103/artist">Meme Artist 103 - Jack Butcher</a></li>
                <li>Artist Preview: <a href="/memes/102/artist">Meme Artist 102 - GxngYxng</a></li>
                <li>Artist Preview: <a href="/memes/101/artist">Meme Artist 101 - LordJamieVShiLL</a></li>
                <li>Artist Preview: <a href="/memes/100/artist">Meme Artist 100 - 6529er</a></li>
                <li>Artist Preview: <a href="/memes/99/artist">Meme Artist 99 - Mike Hirshon</a></li>
                <li>Artist Preview: <a href="/memes/98/artist">Meme Artist 98 - Degen Alfie</a></li>
                <li>Artist Preview: <a href="/memes/97/artist">Meme Artist 97 - Matt Doogue</a></li>
                <li>Artist Preview: <a href="/memes/96/artist">Meme Artist 96 - Billy Dinh</a></li>
                <li>Artist Preview: <a href="/memes/95/artist">Meme Artist 95 - Andreas Preis</a></li>
                <li>Artist Preview: <a href="/memes/94/artist">Meme Artist 94 - Jeff Soto</a></li>
                <li>Artist Preview: <a href="/memes/93/artist">Meme Artist 93 - mbsjq</a></li>
                <li>Artist Preview: <a href="/memes/92/artist">Meme Artist 92 - Angela Nikolau</a></li>
                <li>Artist Preview: <a href="/memes/90/artist">Meme Artist 90 - Meg Thorpe</a></li>
                <li>Artist Preview: <a href="/memes/89/artist">Meme Artist 89 - CyptoClimates: Made by Megan</a></li>
                <li>Artist Preview: <a href="/memes/88/artist">Meme Artist 88 - Ryan Koopmans</a></li>
                <li>Artist Preview: <a href="/memes/87/artist">Meme Artist 87 - DeeKay Motion</a></li>
              </ul>
              <li>Season 2</li>
              <ul>
                <li>Artist Preview: <a href="/memes/86/artist">Meme Artist 86 - Pop Wonder</a></li>
                <li>Artist Preview: <a href="/memes/85/artist">Meme Artist 85 - 6529er</a></li>
                <li>Artist Preview: <a href="/memes/83/artist">Meme Artist 83 - Luna Leonis</a></li>
              </ul>
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  )
}
