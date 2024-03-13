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
                Explore the education Twitter threads of <a href="https://twitter.com/punk6529" target="_blank">@Punk6529</a>, and read about the impact of memetic ideas at <a href="https://seize.io/about/faq" target="_blank">seize.io</a>.
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
              <li>Season 6</li>
              <ul>
                <li>Artist Preview: <a href="/memes/211/artist">Meme Artist 211 - Intrepid</a></li>
                <li>Artist Preview: <a href="/memes/210/artist">Meme Artist 210 - @PonderingDraw</a></li>
                <li>Artist Preview: <a href="/memes/209/artist">Meme Artist 209 - Fawkes</a></li>
                <li>Artist Preview: <a href="/memes/208/artist">Meme Artist 208 - BOUBOY</a></li>
                <li>Artist Preview: <a href="/memes/207/artist">Meme Artist 207 - VSTRVL</a></li>
                <li>Artist Preview: <a href="/memes/206/artist">Meme Artist 206 - Cullen Colors</a></li>
                <li>Artist Preview: <a href="/memes/205/artist">Meme Artist 205 - mendezmendez</a></li>
                <li>Artist Preview: <a href="/memes/204/artist">Meme Artist 204 - subwway</a></li>
                <li>Artist Preview: <a href="/memes/203/artist">Meme Artist 203 - 8th Project</a></li>
                <li>Artist Preview: <a href="/memes/202/artist">Meme Artist 202 - Roberta Railaitė</a></li>
                <li>Artist Preview: <a href="/memes/201/artist">Meme Artist 201 - Exolorian</a></li>
                <li>Artist Preview: <a href="/memes/200/artist">Meme Artist 200 - cadmonkey</a></li>
                <li>Artist Preview: <a href="/memes/199/artist">Meme Artist 199 - J_SKY</a></li>
                <li>Artist Preview: <a href="/memes/198/artist">Meme Artist 198 - Orkhan Isayev</a></li>
                <li>Artist Preview: <a href="/memes/197/artist">Meme Artist 197 - Kirill Pobedin</a></li>
                <li>Artist Preview: <a href="/memes/196/artist">Meme Artist 196 - Paul Reid</a></li>
                <li>Artist Preview: <a href="/memes/195/artist">Meme Artist 195 - Louis Dazy</a></li>
                <li>Artist Preview: <a href="/memes/194/artist">Meme Artist 194 - Mr Richi</a></li>
                <li>Artist Preview: <a href="/memes/193/artist">Meme Artist 193 - Alexis Olin</a></li>
                <li>Artist Preview: <a href="/memes/192/artist">Meme Artist 192 - @6529er x Punk 6529</a></li>
                <li>Artist Preview: <a href="/memes/191/artist">Meme Artist 191 - Hasan Göktepe</a></li>
                <li>Artist Preview: <a href="/memes/190/artist">Meme Artist 190 - Emanuele Ferrari</a></li>
                <li>Artist Preview: <a href="/memes/189/artist">Meme Artist 189 - @pixelord</a></li>
                <li>Artist Preview: <a href="/memes/188/artist">Meme Artist 188 - Wÿn Jackz</a></li>
                <li>Artist Preview: <a href="/memes/187/artist">Meme Artist 187 - Viva La Vandal</a></li>
                <li>Artist Preview: <a href="/memes/186/artist">Meme Artist 186 - Nude Yoga Girl</a></li>
                <li>Artist Preview: <a href="/memes/185/artist">Meme Artist 185 - Jæn</a></li>
                <li>Artist Preview: <a href="/memes/184/artist">Meme Artist 184 - Martin Kozlowski</a></li>
                <li>Artist Preview: <a href="/memes/183/artist">Meme Artist 183 - @1dontknows</a></li>
                <li>Artist Preview: <a href="/memes/182/artist">Meme Artist 182 - @atmonez</a></li>
                <li>Artist Preview: <a href="/memes/181/artist">Meme Artist 181 - Tristan Easton</a></li>
              </ul>                
              <li>Season 5</li>
              <ul>
                <li>Artist Preview: <a href="/memes/180/artist">Meme Artist 180 - Victor Mosquera</a></li>
                <li>Artist Preview: <a href="/memes/179/artist">Meme Artist 179 - Lisa Fogarty</a></li>
                <li>Artist Preview: <a href="/memes/178/artist">Meme Artist 178 - Fran Rodríguez</a></li>
                <li>Artist Preview: <a href="/memes/177/artist">Meme Artist 177 - Rare Scrilla</a></li>
                <li>Artist Preview: <a href="/memes/176/artist">Meme Artist 176 - Rocketgirl</a></li>
                <li>Artist Preview: <a href="/memes/175/artist">Meme Artist 175 - Bryan Brinkman</a></li>
                <li>Artist Preview: <a href="/memes/174/artist">Meme Artist 174 - Dutchtide</a></li>
                <li>Artist Preview: <a href="/memes/173/artist">Meme Artist 173 - Ricardo Alves</a></li>
                <li>Artist Preview: <a href="/memes/172/artist">Meme Artist 172 - @6529er & Punku</a></li>
                <li>Artist Preview: <a href="/memes/171/artist">Meme Artist 171 - Dana Ulama</a></li>
                <li>Artist Preview: <a href="/memes/170/artist">Meme Artist 170 - bluugu</a></li>
                <li>Artist Preview: <a href="/memes/169/artist">Meme Artist 169 - Dylan Wade</a></li>
                <li>Artist Preview: <a href="/memes/168/artist">Meme Artist 168 - Li Boar</a></li>
                <li>Artist Preview: <a href="/memes/167/artist">Meme Artist 167 - @toadswiback</a></li>
                <li>Artist Preview: <a href="/memes/166/artist">Meme Artist 166 - Sasha Katz</a></li>
                <li>Artist Preview: <a href="/memes/165/artist">Meme Artist 165 - Jonathan Nash</a></li>
                <li>Artist Preview: <a href="/memes/163/artist">Meme Artist 163 - Camila Nogueira</a></li>
                <li>Artist Preview: <a href="/memes/162/artist">Meme Artist 162 - Eszter Lakatos</a></li>
                <li>Artist Preview: <a href="/memes/161/artist">Meme Artist 161 - Noealz</a></li>
                <li>Artist Preview: <a href="/memes/160/artist">Meme Artist 160 - fesq</a></li>
                <li>Artist Preview: <a href="/memes/159/artist">Meme Artist 159 - Des Lucréce</a></li>
                <li>Artist Preview: <a href="/memes/158/artist">Meme Artist 158 - Mark Constantine Inducil</a></li>
                <li>Artist Preview: <a href="/memes/157/artist">Meme Artist 157 - @6529er</a></li>
                <li>Artist Preview: <a href="/memes/156/artist">Meme Artist 156 - BÈFÈ The Mad</a></li>
                <li>Artist Preview: <a href="/memes/155/artist">Meme Artist 155 - Redrum</a></li>
                <li>Artist Preview: <a href="/memes/154/artist">Meme Artist 154 - PRGuitarman</a></li>
                <li>Artist Preview: <a href="/memes/153/artist">Meme Artist 153 - PhotonTide</a></li>
                <li>Artist Preview: <a href="/memes/152/artist">Meme Artist 152 - Miss AL Simpson</a></li>
              </ul>
              <li>Season 4</li>
              <ul>
                <li>Artist Preview: <a href="/memes/151/artist">Meme Artist 151 - Killer Acid</a></li>
                <li>Artist Preview: <a href="/memes/150/artist">Meme Artist 150 - Efdot</a></li>
                <li>Artist Preview: <a href="/memes/149/artist">Meme Artist 149 - Roger Skaer</a></li>
                <li>Artist Preview: <a href="/memes/148/artist">Meme Artist 148 - Superelmer</a></li>
                <li>Artist Preview: <a href="/memes/147/artist">Meme Artist 147 - Rupture</a></li>
                <li>Artist Preview: <a href="/memes/146/artist">Meme Artist 146 - Vertigo</a></li>
                <li>Artist Preview: <a href="/memes/145/artist">Meme Artist 145 - teexels</a></li>
                <li>Artist Preview: <a href="/memes/144/artist">Meme Artist 144 - Filip Hodas</a></li>
                <li>Artist Preview: <a href="/memes/143/artist">Meme Artist 143 - Hannes Hummel</a></li>
                <li>Artist Preview: <a href="/memes/142/artist">Meme Artist 142 - Leyla Emektar</a></li>
                <li>Artist Preview: <a href="/memes/141/artist">Meme Artist 141 - Bastien</a></li>
                <li>Artist Preview: <a href="/memes/140/artist">Meme Artist 140 - Diogo Sampaio</a></li>
                <li>Artist Preview: <a href="/memes/139/artist">Meme Artist 139 - @synccreation</a></li>
                <li>Artist Preview: <a href="/memes/138/artist">Meme Artist 138 - Eleni Tomadaki</a></li>
                <li>Artist Preview: <a href="/memes/137/artist">Meme Artist 137 - Jan Sladecko</a></li>
                <li>Artist Preview: <a href="/memes/136/artist">Meme Artist 136 - @postwook</a></li>
                <li>Artist Preview: <a href="/memes/135/artist">Meme Artist 135 - @rustnfteth</a></li>
                <li>Artist Preview: <a href="/memes/134/artist">Meme Artist 134 - MiraRuido</a></li>
                <li>Artist Preview: <a href="/memes/133/artist">Meme Artist 133 - mpkoz</a></li>
                <li>Artist Preview: <a href="/memes/132/artist">Meme Artist 132 - Hugo Korhonen</a></li>
                <li>Artist Preview: <a href="/memes/131/artist">Meme Artist 131 - David Fairs</a></li>
                <li>Artist Preview: <a href="/memes/130/artist">Meme Artist 130 - Kelly McDermott</a></li>
                <li>Artist Preview: <a href="/memes/129/artist">Meme Artist 129 - ThreePanelCrimes</a></li>
                <li>Artist Preview: <a href="/memes/128/artist">Meme Artist 128 - Fabiano Speziari</a></li>
                <li>Artist Preview: <a href="/memes/127/artist">Meme Artist 127 - DominikG</a></li>
                <li>Artist Preview: <a href="/memes/126/artist">Meme Artist 126 - Marcel Deneuve</a></li>
                <li>Artist Preview: <a href="/memes/125/artist">Meme Artist 125 - Ryan D. Anderson</a></li>
                <li>Artist Preview: <a href="/memes/124/artist">Meme Artist 124 - Afonso Caravaggio</a></li>
                <li>Artist Preview: <a href="/memes/123/artist">Meme Artist 123 - SamJ Studios</a></li>
                <li>Artist Preview: <a href="/memes/122/artist">Meme Artist 122 - Dre Dogue</a></li>
                <li>Artist Preview: <a href="/memes/121/artist">Meme Artist 121 - Eric Paré</a></li>
                <li>Artist Preview: <a href="/memes/120/artist">Meme Artist 120 - 6529er</a></li>
                <li>Artist Preview: <a href="/memes/119/artist">Meme Artist 119 - Idil Dursun</a></li>
              </ul>
              <li>Season 3</li>
              <ul>
                <li>Artist Preview: <a href="/memes/118/artist">Meme Artist 118 - Botto</a></li>
                <li>Artist Preview: <a href="/memes/117/artist">Meme Artist 117 - CARDELUCCI</a></li>
                <li>Artist Preview: <a href="/memes/116/artist">Meme Artist 116 - Sadboi</a></li>
                <li>Artist Preview: <a href="/memes/115/artist">Meme Artist 115 - Giovanni Motta</a></li>
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
