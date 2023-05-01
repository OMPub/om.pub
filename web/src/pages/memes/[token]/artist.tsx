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
  posterMintUrl: string,
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
      posterMintUrl: "https://app.manifold.xyz/c/rememeposter",
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
      posterMintUrl: "",
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
      posterMintUrl: "",
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
      posterMintUrl: "",
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
    },
    {
      tokenId: 87,
      images: [
        "/artist-87/work-1.mp4",
        "/artist-87/work-2.mp4",
        "/artist-87/work-3.mp4"
      ],
      poster: "/artist-87/poster.mp4",
      posterMintUrl: "https://app.manifold.xyz/c/Prememe",
      name: "DeeKay",
      info:
`
DeeKay is a South Korean NFT artist based in the Bay Area whose work is known for its striking use of vibrant colors, intricate details, and dynamic motion. 
His digital creations often feature familiar characters and surrealistic themes, blending together elements of nature, technology, and fantasy to create immersive and visually stunning worlds.

DeeKay has gained a significant following within the NFT art community due to his impressive body of work, which showcases a high degree of technical skill, smooth and fluid animation, and attention to detail. 
His NFTs feature looping storylines that allow viewers to discover new details and interpretations with each viewing, adding an additional layer of complexity to his already immersive creations.

In addition to his individual NFT art projects, we now welcome DeeKay as the opening artist for season 3 of The Memes by 6529! DeeKay's contribution to the a theme from the collection is highly anticipated by fans and collectors alike.

DeeKay's unique style and technical skill as an NFT artist have made him stand out within the NFT art community. 
We can't wait to see how The Memes are interpreted in his fun and spirited art!
`,
      links: [
        {
          name: "Deekay's Twitter",
          url: "https://twitter.com/deekaymotion",
          target: "_blank"
        },
        {
          name: "Deekay's Linktree",
          url: "https://linktr.ee/deekaymotion/",
          target: "_blank"
        },
        {
          name: "Deekay's Web Site",
          url: "https://deekaykwon.com/",
          target: "_blank"
        },
        {
          name: "An Interview with Deekay",
          url: "https://hypemoon.com/2022/9/deekay-nft-animator-interview",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 88,
      images: [
        "/artist-88/work-1.webp",
        "/artist-88/work-2.gif",
        "/artist-88/work-3.gif"
      ],
      poster: "/artist-88/poster.png",
      posterMintUrl: "",
      name: "Ryan Koopmans",
      info:
`
Ryan Koopmans is a Canadian-born NFT artist whose work combines elements of photography, digital art, and graphic design to create immersive and visually stunning worlds. 
With a keen eye for detail, Ryan's artwork often features surreal and dreamlike landscapes, juxtaposed against elements of modernity and technology. 
His digital creations showcase a high degree of technical skill, with intricate and thoughtfully composed scenes that are rich in color and texture.

Ryan's work has been widely exhibited in galleries and museums around the world, and his NFT art has garnered a significant following within the NFT art community. 
He has been recognized for his innovative and thought-provoking approach to digital art, and his work has been featured in numerous publications and media outlets.

Beyond his artistic practice, Ryan is also passionate about exploring the possibilities of NFT technology and its potential impact on the art world. 
He is committed to pushing the boundaries of what is possible with NFT art, and his creations reflect his forward-thinking and experimental approach.

Whether you're a fan of surrealism, digital art, or simply looking to explore something new, Ryan's NFT creations are sure to leave a lasting impression.
We are thrilled to welcome Ryan to the ranks of the Memes artist, and can't wait to see how he'll push the boundaries of The Memes as we know it! 
`,
      links: [
        {
          name: "Ryan's Twitter",
          url: "https://twitter.com/ryankoopmans",
          target: "_blank"
        },
        {
          name: "Ryan's Linktree",
          url: "https://linktr.ee/ryankoopmans/",
          target: "_blank"
        },
        {
          name: "Ryan's Web Site",
          url: "https://www.ryankoopmans.com/",
          target: "_blank"
        },
        {
          name: "Ryan's Discord",
          url: "https://discord.com/invite/AVeGUcAMdY",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 89,
      images: [
        "/artist-89/work-1.gif",
      ],
      poster: "/artist-89/poster.gif",
      posterMintUrl: "",
      name: "Made by Megan",
      info:
`
Megan, AKA @CryptoClimates, is an NFT artist committed to working for sustainable living and conservation. 
She's created individual mini environments as NFT, and is also an artist with @The_GhostClub.

She says, "It's a personal mission of mine to work towards a more sustainable life and support conservation initiatives on a global level. 
With the help of this superhuman community and blockchain technology, it's all becoming possible."

We are grateful to have Megan and her vision and values as a part of The Memes community!
`,
      links: [
        {
          name: "Megan's Twitter",
          url: "https://twitter.com/CryptoClimates",
          target: "_blank"
        },
        {
          name: "Megan's Web Site",
          url: "https://www.madebymegan.io/",
          target: "_blank"
        },
        {
          name: "Megan's Discord",
          url: "https://discord.gg/PRsKywkuqU",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 90,
      images: [
        "/artist-90/work-1.png",
        "/artist-90/work-2.png",
        "/artist-90/work-3.png",
      ],
      poster: "/artist-90/poster.gif",
      posterMintUrl: "",
      name: "Meg Thorpe",
      info:
`
Megan Thorpe describes herself as, "A visual artist who explores the theme of identity through the lens of mental illness." 

Her powerful images evoke the themes of headspace being destroyed and recreated, our minds opened to (or shattered by?) the world beyond us. 

With colorful paint on literal, IRL canvas, many of Meg's works are born in the physical world. 
Hi-res scaning creates fully digital NFTs that maintain the texture of the canvas, and the artist's touch of paint stroke and bruch marks.

We are so glad to have Meg on board as the artist of Card 90!
`,
      links: [
        {
          name: "Meg Thorpe's Twitter",
          url: "https://twitter.com/megthorpeart",
          target: "_blank"
        },
        {
          name: "Meg Thorpe's Instagram",
          url: "https://www.instagram.com/megthorpeart/",
          target: "_blank"
        },
        {
          name: "Meg Thorpe's Digital Gallery",
          url: "https://oncyber.io/megthorpeart",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 91,
      images: [
        "/artist-91/work-1.png",
        "/artist-91/work-2.png",
        "/artist-91/work-3.png",
      ],
      poster: "/artist-91/poster.gif",
      posterMintUrl: "",
      name: "Fidel Amos",
      info:
`
Fidel creates NFT photos. 
`,
      links: [
        {
          name: "Fidel's Twitter",
          url: "https://twitter.com/FidelEverywhere",
          target: "_blank"
        },
        {
          name: "Fidel's LinkTree",
          url: "https://linktr.ee/fideleverywhere/",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 92,
      images: [
        "/artist-92/work-1.png",
        "/artist-92/work-2.png",
        "/artist-92/work-3.png",
      ],
      poster: "/artist-92/poster.png",
      posterMintUrl: "",
      name: "Angela Nikolau",
      info:
`
We welcome Angela Nikolau, the Russian photographer known for her daring and adventurous photos, as the artist of Meme Card 92! 
Her artistic style, which is often characterized by surreal and dizzying photos taken from high-up and dangerous locations, has been translated into the digital realm through her unique NFT photographic artwork.

Nikolau's NFT art is a reflection of her creativity and willingness to take risks. 
Her pieces often feature her trademark acrobatic and oft-sultry poses, set against a backdrop of stunning cityscapes or natural landscapes. 
Through her NFT art, Nikolau seeks to explore the intersection between physical prowess and digital art, inviting viewers to experience her daring and adventurous vision in a whole new way.

As a trailblazer in both photography and NFT art, Nikolau's impact on the art world is breathtaking. 
Her work challenges traditional notions of what art can be and encourages others to think beyond the limits of "possible". 
With her NFT art, Nikolau continues to push boundaries and inspire others to explore the limitless possibilities of digital art.

Angela's contribution will surely take The Memes to new heights!
`,
      links: [
        {
          name: "Angela's Twitter",
          url: "https://twitter.com/angelanikolau_",
          target: "_blank"
        },
        {
          name: "Angela's Instagram",
          url: "https://www.instagram.com/angela_nikolau/",
          target: "_blank"
        },
        {
          name: "Angela's Art on Foundation",
          url: "https://foundation.app/@Angela_Nikolau",
          target: "_blank"
        }
      ]
    },
    {
      "tokenId": 93,
      "images": [
        "/artist-93/work-1.png",
        "/artist-93/work-2.gif",
        "/artist-93/work-3.jpeg"
      ],
      "poster": "/artist-93/poster.png",
      "posterMintUrl": "",
      "name": "@mbsjq",
      "info": 
`
We are excited to present Jonathan Quintin, the digital artist and graphic designer from the United Kingdom, professionally recognized as "mbsjq" or "Astro," as the creative mind behind Meme Card 93. 
With a [career](https://www.artinnovationgallery.com/artist.php?id=6225d81155e51) spanning more than 20 years, mbsjq has been involved in numerous collaborations with internationally renowned companies. 
His artwork is often characterized by a blend of vivid hues, celestial elements, and surrealism, drawing inspiration from the universe and his daughter.

Since entering the NFT space in 2020, mbsjq has quickly gained a reputation as a prominent Cryptoartist, achieving remarkable sales, features, and collaborations. 
His popularity on SuperRare has soared, placing him among the ranks of celebrated artists such as XCOPY, Hackatao, and Pak. 

Mbsjq has an impressive portfolio of collaborations, including a successful partnership with Hackatao that resulted in the sale of "LOL" for a staggering 185.0 ETH. 
He also worked with Playboy to create "Miami Dance," which was showcased at the Bitcoin Miami Conference. 
Additionally, mbsjq was selected to commemorate Freddie Mercury's 75th birthday with the artwork "Colorful Soul," the proceeds of which were directed towards AIDS research and education.

In 2021, mbsjq's art appeared on billboards across LA, New York, and London, while his work was exhibited at prestigious events and locations such as Art Basel Miami, Dubai, London, and Shanghai. 
As he continues to push the boundaries of digital art, mbsjq aspires to collaborate with prestigious organizations like NASA and Nike.
`,
      "links": [
        {
          "name": "mbsjq's Twitter",
          "url": "https://twitter.com/mbsjq",
          "target": "_blank"
        },
        {
          "name": "mbsjq's Instagram",
          "url": "https://www.instagram.com/madebystudiojq/",
          "target": "_blank"
        },
        {
          "name": "mbsjq's Homepage",
          "url": "https://www.madebystudiojq.com/",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 94,
      "images": [
        "/artist-94/work-1.gif",
        "/artist-94/work-2.png",
        "/artist-94/work-3.png"
      ],
      "poster": "/artist-94/poster.png",
      "posterMintUrl": "",
      "name": "Jeff Soto",
      "info":
`
We welcome Jeff Soto, the renowned artist and illustrator, as the artist of Meme Card 94! 

Jeff Soto is a contemporary artist, illustrator, and muralist who has been active in the art scene since the early 2000s. 
His work is known for its unique fusion of pop surrealism, street art, and graffiti, creating a distinct visual language. 
His art often features colorful and imaginative characters or creatures, as well as themes related to nature, society, and personal experiences.

Jeff Soto's vibrant fusion of pop surrealism and street art is bound to paint a whole new dimension of creativity onto The Memes project canvas!
`,
      "links": [
        {
          "name": "Jeff's Twitter",
          "url": "https://twitter.com/jeffsotoart",
          "target": "_blank"
        },
        {
          "name": "Jeff's Instagram",
          "url": "https://www.instagram.com/jeffsotoart/",
          "target": "_blank"
        },
        {
          "name": "Jeff's Homepage",
          "url": "https://jeffsoto.com/",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 95,
      "images": [
        "/artist-95/work-1.jpeg",
        "/artist-95/work-2.jpeg",
        "/artist-95/work-3.png"
      ],
      "poster": "/artist-94/poster.png",
      "posterMintUrl": "",
      "name": "Andreas Preis",
      "info":
`
Andreas Preis is a Berlin-based artist, illustrator, and designer known for his versatile and vibrant artistic style. 
Born in 1984, he studied communications design in Nuremberg, Germany. 
Preis has worked with various high-profile clients, including Adidas, Adobe, Coca-Cola, DC Comics, ESPN, Ford, Nike, and Samsung.

His artwork often encompasses intricate illustrations, hand-drawn typography, and bold color schemes. 
Andreas Preis is particularly skilled in using different techniques and materials, ranging from traditional pen and paper to digital art and murals. 
His illustrations often feature animals, geometric shapes, and patterns, resulting in a unique and striking visual language.

In addition to illustration, Preis has experience in graphic design, mural painting, and live art performances. 
His art has been exhibited in galleries and festivals across Europe and the United States. 
As a versatile and innovative artist, Andreas Preis continues to push the boundaries of his craft, exploring new techniques and forms of expression.

With Andreas Preis's kaleidoscope of colors and intricate illustrations, The Memes project is set to leap off the canvas and into a wildly imaginative realm of artistic expression!
`,
      "links": [
        {
          "name": "Andreas's Twitter",
          "url": "https://twitter.com/andreaspreis",
          "target": "_blank"
        },
        {
          "name": "Andreas's Instagram",
          "url": "https://www.instagram.com/andreaspreis/",
          "target": "_blank"
        },
        {
          "name": "Andreas's Art on Foundation",
          "url": "https://foundation.app/@AndreasPreis",
          "target": "_blank"
        }
      ]
    },
  ]
}
