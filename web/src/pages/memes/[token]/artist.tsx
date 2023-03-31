import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from 'next';
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import ArtistProfile from "@/components/artistProfile/ArtistProfile";

interface Link {
  url: string,
  name: string,
  target: string
}

interface Artist {
  tokenId: number,
  images: string[],
  poster: string,
  name: string,
  info: string
  links: Link[]
}

interface Props {
  artists: Artist[];
}

const Header = dynamic(() => import("@/components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function Artist(props: Props) {
  const route = useRouter();
  const artistId = Number(route.query.token);
  
  return (
    <>
      <Head>
        <title>{`Preview: Meme Artist ${artistId} | The OM Pub`}</title>
        <meta
          property="og:url"
          content={`https://om.pub/artist`}
        />
        <meta
          property="og:title"
          content={`Preview: Meme Artist ${artistId} | The OM Pub`}
        />
        <meta property="og:image" content={`https://om.pub/artist-${artistId}/poster.gif`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OM_Pub_" />
        <meta name="twitter:title" content={`Preview: Meme Artist ${artistId}`} />
        <meta name="twitter:description" content="Celebrating the artist of a new card in The Memes fam!" />
        <meta name="twitter:image" content={`https://om.pub/artist-${artistId}/poster.gif`} />
      </Head>
      <Header />
      <ArtistProfile artistsData={props.artists} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = artistsData.artists.map((artist) => ({
    params: { token: artist.tokenId.toString() }
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: artistsData
  }
}

const artistsData = {
  artists: [
    {
      tokenId: 83,
      images: [
        "/artist-83/work-1.jpeg",
        "/artist-83/work-2.jpeg",
        "/artist-83/work-3.jpeg"
      ],
      poster: "/artist-83/poster.gif",
      name: "Luna Leonis",
      info:
        `We are proud to welcome Luna Leonis to the 6529 Meme artist family. 

She's well known for creating whimsical and magical digital art. Her artwork tells stories conveyed through vibrant colors and bold patterns, capturing the imagination of her viewers. Her use of the moon (thus the name Luna) creates a dreamlike quality in her pieces.

Luna's style uniquely blends color, texture, and form. Her pieces often incorporate intricate details inviting viewers to explore and discover hidden meanings. Her artwork reflects her creative spirit, allowing her to share her vision with the world.

Luna has been recognized for her work in the NFT community and has gained a following of notable collectors, including @blocknoob, PAK, and Cozomo. Her pieces have been sold on SuperRare, Foundation, and she has even minted on Tezos.

In addition to her work as an artist, Luna also advocates for women's empowerment through her artwork. Her statement:

"I am me. Plain. Simple. Thriving. Loving. Invincible. I am a woman." Speaks volumes. 

Luna's art embodies a sense of wonder and imagination, inviting the viewer to experience a world of whimsy and magic. We can't wait to see what she has created for our community...and the world.`,
      links: [
        {
          "name": "Luna's Twitter",
          "url": "https://twitter.com/lunaleonis",
          "target": "_blank"
        },
        {
          "name": "Luna's Linktree",
          "url": "https://linktr.ee/lunaleonis",
          "target": "_blank"
        },
        {
          "name": "Luna's Wonderland Discord Server",
          "url": "https://discord.gg/JAhzGprv",
          "target": "_blank"
        }
      ]
    },
    {
      tokenId: 84,
      images: [
        "/artist-84/work-1.jpeg",
        "/artist-84/work-2.jpeg",
        "/artist-84/work-3.jpeg"
      ],
      poster: "/artist-84/poster.png",
      name: "UNNKNOWN",
      info:
        `We are proud to welcome UNNKNOWN to the 6529 Meme artist family. 

...We can't wait to see what she has created for our community...and the world.`,
      links: [
        {
          "name": "UNNKNOWN's Twitter",
          "url": "https://twitter.com/UNNKNOWN",
          "target": "_blank"
        },
        {
          "name": "UNNKNOWN's Linktree",
          "url": "https://linktr.ee/UNNKNOWN",
          "target": "_blank"
        },
        {
          "name": "UNNKNOWN's Discord Server",
          "url": "https://discord.gg/UNNKNOWN",
          "target": "_blank"
        }
      ]
    },
    {
      tokenId: 85,
      images: [
        "/artist-85/work-1.jpeg",
        "/artist-85/work-2.gif",
        "/artist-85/work-3.png",
        "/artist-85/work-4.jpeg"
      ],
      poster: "/artist-85/poster.gif",
      name: "6529er",
      info:
        `We are proud to welcome 6529er back to the 6529 Meme artist family. 

Dive into the mysterious world of 6529er, a visionary NFT artist who captivates collectors with his minimalist masterpieces. 
Emerging in the crypto-art realm in 2021, 6529er has gained a place of prominence as the pre-eminent artist of The Memes by 6529 collection, for his sleek, thought-provoking designs.

With a penchant for geometric shapes, bold colors, and a touch of wry humor, 6529er crafts pieces that invite deep contemplation. 
His works in The Memes are infused with meaning, and blur the lines between digital art and hard-hitting educational experiences.

Despite his enigmatic persona, 6529er actively engages with the NFT community, providing leadership and support to The Memes community. 
As the NFT landscape evolves, 6529er's distinctive artistry continues to intrigue and delight, making them a force to be reckoned with in the metaverse.

Stoked for more from 6529er
        .`,
      links: [
        {
          name: "6529er's Twitter",
          url: "https://twitter.com/6529er",
          target: "_blank"
        },
        {
          name: "6529er on Foundation",
          url: "https://foundation.app/@6529er",
          target: "_blank"
        },
        {
          name: "Find @6529er in the OM Discord Server",
          url: "https://discord.gg/JAhzGprv",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 86,
      images: [
        "/artist-86/work-1.gif",
        "/artist-86/work-2.png",
        "/artist-86/work-3.png"
      ],
      poster: "/artist-86/poster.gif",
      name: "PopWonder",
      info:
`Hailing from the vibrant city of Portland, Oregon, Pop Wonder is an enigmatic NFT artist who has taken the digital world by storm. 
With a particular style that fuses pop culture and vivid imagination, Pop Wonder casts a spell over collectors and enthusiasts alike.

Born in a city known for its quirky individualism, Pop Wonder infuses his art with a healthy dose of whimsy, irony, and humor. 
He masterfully blends memes from popular culture with psychedelic colors and patterns, creating a visual feast that's both nostalgic and futuristic.

A true digital magician, Pop Wonder uses creatures, aliens, and people alike to bring his creations to life. 
Each piece is a distinctive, sometimes animated NFT, with the artist often incorporating intriguing stories and Easter eggs that delight his fans.

If you're seeking a trip down memory lane with a twist, Pop Wonder's NFTs are your golden ticket. 
Learn more with the links here, and join the ranks of those who are captivated by the mesmerizing world of Pop Wonder.

Welcome to the Memes Community, Pop Wonder...we glad we won't have to "wonder" much longer what you have in store for us!
`,
      links: [
        {
          name: "PopWonder's Twitter",
          url: "https://twitter.com/PopWonderNFT",
          target: "_blank"
        },
        {
          name: "PopWonder's Linktree",
          url: "https://linktr.ee/popwonder/",
          target: "_blank"
        },
        {
          name: "PopWonder's Discord",
          url: "https://discord.com/invite/Jxw5CWumEK",
          target: "_blank"
        },
        {
          name: "An Interview with PopWonder",
          url: "https://mirror.xyz/atriumart.eth/RQ9W1aEes7i9PEklaX2IW0xFxmILmyKeu2bFC72ntfM",
          target: "_blank"
        }
      ]
    }]
}
