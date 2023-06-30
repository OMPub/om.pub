import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from 'next';
import { Container } from "react-bootstrap";
import styles from "@/styles/Home.module.scss";
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
      <Container className={`${styles.main}`}>
        <ArtistProfile artistsData={props.artists} />
      </Container>
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
      "poster": "/artist-95/poster.png",
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
    {
      "tokenId": 96,
      "images": [
        "/artist-96/work-1.jpeg",
        "/artist-96/work-2.jpeg",
        "/artist-96/work-3.png"
      ],
      "poster": "/artist-96/poster.png",
      "posterMintUrl": "",
      "name": "Billy Dinh",
      "info":
        `
Meet Billy Dinh, the avant-garde lens virtuoso who's been reshaping the face of modern photography. 
Known for his ingenious integration of everyday life and surrealism, Dinh's work seizes the ephemeral, turning fleeting moments into timeless art.

Born in the vibrant streets of Houston, Texas, Dinh's artistic journey is as colorful as his portfolio. 
His knack for capturing the essence of his subjects, whether it's the raw energy of urban spaces or the nuanced play of light on a tranquil landscape, is truly distinctive.

In the world of memes, where ideas spread and evolve at a breakneck pace, Billy brings his unique touch of authenticity and creativity. 
Dinh's genius lies in his ability to see the extraordinary in the ordinary, transforming the mundane into visuals that speak volumes.

Billy Dinh doesn't just take photos—he crafts stories, immortalizing moments with a click, challenging perceptions, and pushing the boundaries of photographic storytelling.

So now we embark on the memetic journey with Billy Dinh, with excitement to see his signature style develop in this new frame of reference!
`,
      "links": [
        {
          "name": "Billy's Twitter",
          "url": "http://twitter.com/billydeee_",
          "target": "_blank"
        },
        {
          "name": "Billy's Instagram",
          "url": "http://instagram.com/billydeee",
          "target": "_blank"
        },
        {
          "name": "Billy's Website",
          "url": "http://billydinh.com",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 97,
      "images": [
        "/artist-97/work-1.png",
        "/artist-97/work-2.png",
        "/artist-97/work-3.png"
      ],
      "poster": "/artist-97/poster.png",
      "posterMintUrl": "",
      "name": "Matt Doogue",
      "info":
        `
Immerse yourself in the captivating universe of Matt Doogue, the London-based Macro Maestro. 
His photographic wizardry brings the minute wonders of our natural world into awe-inspiring focus. 
From dew-kissed spider webs to the subtle patterns on a butterfly's wing, Doogue's lens unveils a realm usually hidden from the naked eye.

Far from the city's hustle, Matt finds tranquillity in capturing the intricate beauty and bizarreness that lies within the smallest corners of life. His work is a testament to his passion for detail and his profound respect for the environment. 
It's not merely about stunning visuals; it's a gentle reminder of the complexity and interconnectedness of our world.

Through his extraordinary artistry, Matt invites us to pause and appreciate the beauty that exists in the often overlooked details. 
His work is an exploration, a celebration, and an homage to the wonders of the natural world that exist just beyond our usual field of vision.

As we welcome Matt to our collective, we look forward to zooming into his world, where every photograph is a journey into the exquisite detail of life. 
Get ready to see the world in a whole new light, through the macro lens of Matt Doogue.
`,
      "links": [
        {
          "name": "Matt's Twitter",
          "url": "https://www.twitter.com/mattdoogue",
          "target": "_blank"
        },
        {
          "name": "Matt's Instagram",
          "url": "https://instagram.com/mattd85",
          "target": "_blank"
        },
        {
          "name": "Matt's Website",
          "url": "https://mattsmacro.co.uk",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 98,
      "images": [
        "/artist-98/work-1.png",
        "/artist-98/work-2.gif",
        "/artist-98/work-3.jpeg"
      ],
      "poster": "/artist-98/poster.png",
      "posterMintUrl": "",
      "name": "Degen Alfie",
      "info":
        `
Degen Alfie is The Memes artist number 98, so get excited! 

Alfie is based in the UK and creates art influenced by a variety of sources, including cyberpunk, anime, and video games. 
He is also inspired by the work of other artists, such as Jean-Michel Basquiat, Keith Haring, and Andy Warhol.

Alfie's process for creating art is driven by his desire to experiment and explore new possibilities. 
He often starts with a sketch or a rough idea, and then he uses digital tools to develop the image. 
He is always looking for new ways to use technology to create art that is both visually appealing and intellectually stimulating.

His ambitious projects include the Degen Alphabet, which chronicles the events, the weirdness, and the characters of this bizarre crypto tale.

He's shared his sketch process, he's shared his art with the world, and now he shares the glory of The Memes with us all.
`,
      "links": [
        {
          "name": "Alfie's Twitter",
          "url": "https://twitter.com/Degen_Alfie",
          "target": "_blank"
        },
        {
          "name": "Matt's Instagram",
          "url": "https://instagram.com/mattd85",
          "target": "_blank"
        },
        {
          "name": "Alfie's Website",
          "url": "https://degenalphabet.com/",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 99,
      "images": [
        "/artist-99/work-1.jpeg",
        "/artist-99/work-2.jpeg",
        "/artist-99/work-3.webp"
      ],
      "poster": "/artist-99/poster.png",
      "posterMintUrl": "",
      "name": "Mike Hirshon",
      "info":
        `
Michael Hirshon is a versatile freelance illustrator and an esteemed Assistant Professor of Illustration. 
He holds impressive academic credentials, with a BFA in Visual Communication and Psychology from Washington University in St. Louis and an MFA in Illustration as Visual Essay from the School of Visual Arts in New York City. 
Over the past decade, he has developed a diverse portfolio, working with a wide array of prestigious clients such as The New York Times, HarperCollins Publishers, Amazon, The Washington Post, Forbes, and American Express. 
His distinctive work has received recognition from several respected industry organizations including the Society of Illustrators, American Illustration, Spectrum, CMYK, and 3x3.

Hirshon's passion for illustration extends beyond traditional formats as he continually seeks out unusual avenues for visual storytelling. 
This exploratory spirit has led him to collaborate on varied projects such as packaging for a dog toy company, a taco truck chef's cookbook, a dating coach's graphic memoir, a US Senate campaign, and even the walls of a daycare in Pakistan.

In addition to his commercial work, Hirshon has a deep personal commitment to documenting his surroundings and observations through on-location drawings in his sketchbook. 
He has traveled extensively throughout his career, always with a sketchbook in hand, using drawing as a tool to slow down, meditate on, and engage deeply with new experiences. 
This personal work has evolved into an exploration of cultural differences, anxieties, and unfamiliar sensations, reflecting his constant engagement with the world around him and his commitment to visual storytelling in all its forms.

We are thrilled to welcome Mike to The Memes and look forward to how his illustrious style will play out within the project's vision.
`,
      "links": [
        {
          "name": "Mike's Twitter",
          "url": "https://twitter.com/MikeHirshon",
          "target": "_blank"
        },
        {
          "name": "Mike's Instagram",
          "url": "https://instagram.com/MichaelHirshon",
          "target": "_blank"
        },
        {
          "name": "Mike's Website",
          "url": "https://hirshon.net",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 100,
      "images": [
        "/artist-100/work-1.jpeg",
        "/artist-100/work-2.gif",
        "/artist-100/work-3.png",
        "/artist-100/work-4.jpeg"
      ],
      poster: "/artist-100/poster.gif",
      posterMintUrl: "",
      name: "6529er",
      info:
        `
We are proud to welcome 6529er back to the 6529 Meme artist family. 

Dive into the mysterious world of 6529er, a visionary NFT artist who captivates collectors with his minimalist masterpieces. 
Emerging in the crypto-art realm in 2021, 6529er has gained a place of prominence as the pre-eminent artist of The Memes by 6529 collection, for his sleek, thought-provoking designs.

With a penchant for geometric shapes, bold colors, and a touch of wry humor, 6529er crafts pieces that invite deep contemplation. 
His works in The Memes are infused with meaning, and blur the lines between digital art and hard-hitting educational experiences.

Despite his enigmatic persona, 6529er actively engages with the NFT community, providing leadership and support to The Memes community. 
As the NFT landscape evolves, 6529er's distinctive artistry continues to intrigue and delight, making them a force to be reckoned with in the metaverse.

Stoked for more from 6529er!
`,
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
      "tokenId": 101,
      "images": [
        "/artist-101/work-1.gif",
        "/artist-101/work-2.png",
        "/artist-101/work-3.gif"
      ],
      "poster": "/artist-101/poster.gif",
      "posterMintUrl": "",
      "name": "Lord Jamie V Shill",
      "info":
        `
LordJamieVShiLL is a boundary-pushing artist entrenched in the Bitcoin and NFT realm. 

As the self-proclaimed "Master of the ShiLL", he is widely recognized for his creations that seem to build from a subversive exploration of digital and blockchain mediums. 
His work often incorporates elements of humor, parody, and pop culture references, with a particular focus on the iconography of the Pepe the Frog. 
By engaging with the Fake Rare and Counterparty NFT scene, he challenges conventional notions of rarity and value in the digital art world, with his own unique flair.

Beyond his individual creations, he plays a significant administrative role in the Pepe Pawn Shop, a community centered around Pepe-themed artwork and tokens. 
He is also associated with the Pepe Warhol Foundation, suggesting an affinity for reinterpretation and parody in the style of the legendary pop artist. 
LordJamieVShiLL's work can be found on various digital art platforms, where he showcases his distinctive and oftentimes humorous take on digital collectibles​.

We don't yet know what LordJamieVShiLL will brings to The Memes, but don't bet against a Pepe!
`,
      "links": [
        {
          "name": "Jamie's Twitter",
          "url": "https://twitter.com/LordJamieVShiLL",
          "target": "_blank"
        },
        {
          "name": "Jamie's Fake Rares",
          "url": "https://pepe.wtf/artists/Lord-Jamie-V.-Shill",
          "target": "_blank"
        },
        {
          "name": "3PEACE's OM Gallery",
          "url": "https://oncyber.io/spaces/H82ITP1XLj59OvHTiI7t?coords=-1.71x2.03x-12.96x-1.74",
          "target": "_blank"
        }
      ]
    },
    {
      "tokenId": 102,
      "images": [
        "/artist-102/work-1.gif",
        "/artist-102/work-2.jpeg",
        "/artist-102/work-3.png"
      ],
      "poster": "/artist-102/poster.gif",
      "posterMintUrl": "",
      "name": "@GxngYxng",
      "info":
        `
GxngYxng is a Japan-based NFT artist best known for his Ghxsts collection, a series of hand-drawn artworks transformed into NFTs. 
His distinctive and instantly recognizable style, drawn from his personal experiences and feelings, has set him apart in the non-generative art space. 
His journey as an artist began in childhood, and his commitment to his craft led him to leave his animation industry job to focus on creating NFTs full-time. 
Today, his work is celebrated for its emotional depth and aesthetic appeal, earning him a strong following within the NFT community.

The Ghxsts collection, which initially consisted of 102 pieces, has expanded to nearly a thousand unique hand-drawn pieces. 
Each of these pieces has significantly appreciated in value since their launch, reflecting the artist's growing popularity and the collection's resonance with collectors. 
These pieces provide a fresh perspective on non-generative art and have inspired similar projects in the digital art space.

Beyond the Ghxsts collection, GxngYxng has created a variety of sub-collections, including PXIN GXNG, Ghxsts Cxlture, Cxllabs, and Originxls. 
These collections serve various purposes, from commemorating early "gas wars" among collectors to facilitating collaborations with other NFT projects. 
By offering additional ways for collectors to engage with his work, GxngYxng has successfully created an immersive and rewarding ecosystem around his art​        

We look forward what GxngYxng is crafting for Meme Card 102!
`,
      "links": [
        {
          "name": "GxngYxng's Twitter",
          "url": "https://twitter.com/gxngyxng",
          "target": "_blank"
        },
        {
          "name": "GxngYxng's creations",
          "url": "https://opensea.io/GxngYxngNFT/created",
          "target": "_blank"
        },
        {
          "name": "GxngYxng's website",
          "url": "https://ghxsts.com/",
          "target": "_blank"
        }
      ]
    },
    {
      tokenId: 103,
      images: [
        "/artist-103/work-1.jpeg",
        "/artist-103/work-2.svg",
        "/artist-103/work-3.svg"
      ],
      poster: "/artist-103/poster.gif",
      name: "Jack Butcher",
      info:
        `Jack Butcher the creator of "VV - Checks" is a former creative director for multi-billion dollar brands, having spent a decade working in Fortune 100 advertising in New York City. Despite the industry's excitement, he felt restricted by the lack of freedom in his work. In search of a solution, he started his own advertising agency but found even less freedom.

After two years of trial and error, Jack discovered the secret to transitioning to a highly-specialized and enjoyable consulting business and a product business that could scale infinitely. 

The key was productizing himself. This insight led him to create Visualize Value (https://visualizevalue.com/), a project that enabled him to build a network of mentors, a $1M/year product business, and a media platform with over 500,000 followers.

> "If you'd have told me this story 18 months ago, I wouldn't have believed you. Now I spend all of my time making things that make it easier to learn, teach, build, and sell."

Jack made a splash in the Web3 world with ["Checks"](https://checks.art/). "This artwork may or may not be notable."

Welcome to the Memes Community Jack...we look forward to "Check"ing what you have in store for us!
`,
      links: [
        {
          name: "Jack's Twitter",
          url: "https://twitter.com/jackbutcher",
          target: "_blank"
        },
        {
          name: "Jack's Check Art",
          url: "https://checks.art/",
          target: "_blank"
        },
        {
          name: "Jack's Blog Posts",
          url: "https://visualizevalue.com/blogs/visuals",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 104,
      images: [
        "/artist-104/work-1.png",
        "/artist-104/work-2.gif",
        "/artist-104/work-3.gif"
      ],
      poster: "/artist-104/poster.gif",
      name: "Timpers",
      info:
        `
Timpers, known on Twitter as @TimpersHD or "timpers.chimp," is an innovative artist who specializes in the creation of pixel art. 
He describes himself as a "Pixel placer" which speaks to his unique ability to arrange pixels to create intricate and colorful designs.

Timpers is not just an artist, but also a founder. 
He is associated with @ChimpersNFT and @nounsdao, which speaks to his deep involvement in the blockchain and NFT spaces. 
        
His work is showcased on his portfolio website, the "Pixelverse", which is a vibrant collection of pixel art pieces that display a variety of subjects and complexity. 
Each piece is distinct, yet they all share a colorful, pixelated aesthetic that is characteristic of Timpers' style. 
This body of work demonstrates his mastery of the pixel art medium and his ability to evoke different emotions through his use of color and design.
        
Timpers joined Twitter in May 2015, and since then, has gained a significant following with over 51.2K followers. 
His social media presence, combined with his unique style and expertise in the NFT space, makes Timpers a notable figure in the digital art world.

We are excited to see what Timpers has in placed into pixels for us in Meme Card 104!

`,
      links: [
        {
          name: "Timpers' Twitter",
          url: "https://twitter.com/TimpersHD",
          target: "_blank"
        },
        {
          name: "Timpers on Foundation",
          url: "https://foundation.app/Timpers",
          target: "_blank"
        },
        {
          name: "Timpers' Web Site",
          url: "https://timpers.format.com",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 105,
      images: [
        "/artist-105/work-1.png",
        "/artist-105/work-2.png",
        "/artist-105/work-3.png"
      ],
      poster: "/artist-105/poster.png",
      name: "José Ramos",
      info:
        `
José Ramos is a seasoned landscape photographer and psychiatrist based in Lisbon, Portugal. 
Balancing two careers, he has developed a strong artistic voice over the past 18 years, expressing his unique perspective and love for nature through his photography. 
Ramos' work focuses on the beauty and power of the world around us, with each image containing embedded concepts, stories, and philosophies. 
His images often reflect his thoughts, experiences, and philosophical reflections, raising awareness about the natural world and supporting the protection of the environment.

Ramos' journey began in his second year of medical school, where he discovered photography as an ideal means of creative expression.
His medical specialization is in psychiatry, a field which he believes harmonizes with his photography career, fostering a creative synergy that benefits both disciplines.
        
Ramos' work has gained international recognition, with multiple features in National Geographic and other renowned photography magazines. 
He has also received several international photo awards and his work has been showcased on platforms such as Discovery, The Telegraph, CNN Travel, and Sony.
        
Notably, Ramos sells his art worldwide as fine art prints and exclusive NFTs. 
He curates for the NFC Summit and has developed a profound interest in the NFT space, offering his art in the form of non-fungible tokens on platforms like SuperRare.
        
In addition to his photography and psychiatry work, Ramos also runs custom photographic workshops and photo tours in Portugal, helping other photographers on their journey of artistic discovery. 
His contribution to the photographic community extends to collaborations with many international photography brands, including BenQ, LG, Thinktank, Nisi, FLM, Huawei, Honor, Vivo, and Vallerret.
        
Ramos' work is the result of his love for the outdoors and his inherent creative urges. 
His images are not only aesthetically pleasing but are also embedded with stories and philosophies, aiming to promote awareness of the natural world and the importance of environmental protection. 
His art reflects the fragility and the power of humankind in an ever-changing and intensely fascinating world.

What is José's vision for Meme Card 105? We can't wait to see!
`,
      links: [
        {
          name: "José's Twitter",
          url: "https://twitter.com/jose_ramos",
          target: "_blank"
        },
        {
          name: "José on SuperRare",
          url: "https://superrare.com/joseramos",
          target: "_blank"
        },
        {
          name: "José's Web Site",
          url: "https://timpers.format.com",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 106,
      images: [
        "/artist-106/work-1.jpeg",
        "/artist-106/work-2.png",
        "/artist-106/work-3.png",
        "/artist-106/work-4.png"
      ],
      poster: "/artist-106/poster.png",
      name: "ICKI x noCreative",
      info:
        `
Meme Card 106 looks to break new ground with a collaboration between two innovative NFT artists: Icki and noCreative.
Since they are both founding members of the Bloom Collective, we can count on their experience in working together to produce something great!

Kristian Levin, known in the digital art world as noCreative, is a Copenhagen-based 3D artist with over 15 years of experience spanning various creative industries. 
Initially rooted in traditional art spaces and fine arts photography, noCreative ventured into the NFT art scene in late 2020, quickly gaining a reputation for his striking 3D cloth work. 
His distinctive style and involvement as an artist, collector, and curator have solidified his status as a notable figure within the NFT art community. 
Exhibited at venues such as Calgary Contemporary, Beijing Contemporary, and even on Times Square billboards during NFT NYC, noCreative also lends his expertise as a curator for major NFT platforms like Makersplace and SuperRare.

On the other hand, Icki, a generative artist originating from London, UK, has gained prominence in the 3D industry with his expertise in innovative display mediums like holographic installations and augmented reality. 
His art seamlessly blends elements from minimalism and conceptual art, but with a twist that provides unique commentary on the values of the digital art domain. 
Icki's 'Plagiarism' series, which explores the nature of digital art, provenance, and how new valuation models address infringement and copycat culture, exemplifies his subversive approach to traditional aesthetics. 
His piece 'Meta-Plagiarism' from this series was even showcased alongside works by the legendary Andy Warhol at the Contemporary Calgary.
        
This collaboration between noCreative and Icki is exciting, as it brings together two distinct and innovative styles within the NFT art sphere. 
With noCreative's signature 3D work and Icki's subversive commentary, their collaborative NFT piece is sure to be a unique and thought-provoking contribution to the digital art world.
 
`,
      links: [
        {
          name: "ICKI's Twitter",
          url: "https://twitter.com/The_Kid_Icarus",
          target: "_blank"
        },
        {
          name: "noCreative's Twitter",
          url: "https://twitter.com/nocreative_eth",
          target: "_blank"
        },
        {
          name: "Bloom Collective",
          url: "https://thisisbloom.xyz",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 107,
      images: [
        "/artist-107/work-1.png",
        "/artist-107/work-2.png",
        "/artist-107/work-3.png",
      ],
      poster: "/artist-107/poster.png",
      name: "yungwknd",
      info:
        `
The artist for Meme Card 107 is yungwknd: a Seattle-based generative artist. 
He has made a significant impact on the web3 NFT space since his arrival in March 2021. 
Traversing the spectrum from abstract on-chain art to realistic drawings made with code, his work embodies the intersection of art and technology. 
The artist's deft application of smart contracts has birthed a new dimension of interactive art experiences, underscoring the transformative potential of blockchain technology.

His first foray into the world of NFTs was inspired by @purphat at ArtBlocks. 
Confronted with a long artist application queue, yungwknd embarked on a self-taught journey, crafting an ArtBlocks clone contract to debut his inaugural project, "Carbon Raindrops". 
This pivotal moment sparked a prolific journey of exploration and creation, birthing a diverse portfolio of generative projects and one-of-a-kind art pieces.

What's coming for Card 107? A generative piece? An interactive NFT? We find out on June 5th, 2023!
`,
      links: [
        {
          name: "yungwknd's Twitter",
          url: "https://twitter.com/yungwknd",
          target: "_blank"
        },
        {
          name: "yungwknd's Website",
          url: "https://www.yungwknd.xyz/",
          target: "_blank"
        },
        {
          name: "yungwknd's Website",
          url: "https://www.yungwknd.xyz/",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 108,
      images: [
        "/artist-108/work-1.jpeg",
        "/artist-108/work-2.jpeg",
        "/artist-108/work-3.jpeg",
      ],
      poster: "/artist-108/poster.png",
      name: "Donglu Yu",
      info:
`
Donglu Yu, an acclaimed artist and dreamer, is known for her striking contributions to the world of concept art, illustration, and visual development. 
Yu's work has gained international recognition, and her art has even been sold on prestigious platforms like Sotheby's.

Yu is currently a senior concept artist at Ubisoft Montreal, where she has made a significant impact on various successful video game franchises. 
She is most renowned for her work on the Assassin's Creed series. 
Beyond that, her creative influence extends to other popular video games like Deus Ex: Human Revolution and Far Cry 4.

Her artistic journey began at a very young age when she attended various art classes focusing on Chinese watercolor, calligraphy, oil painting, and more. 
These early experiences have had a profound influence on her work, with elements of these styles being evident in her art today.

Her dedication to the art community goes beyond her own work. 
Yu is actively involved in writing tutorials and providing online mentorship, keen on sharing her knowledge and experience with the digital artist community. 
She continues to explore new techniques and subjects, showing her commitment to continual learning and advancement on her artistic path.

Card 108 is in her hands... How will she meme it? We find out on June 7th, 2023!
`,
      links: [
        {
          name: "Donglu's Twitter",
          url: "https://twitter.com/dongluyu",
          target: "_blank"
        },
        {
          name: "Donglu's Instagram",
          url: "http://instagram.com/donglulittlefish",
          target: "_blank"
        },
        {
          name: "Donglu on Superrare",
          url: "https://superrare.com/donglu",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 109,
      images: [

      ],
      poster: "/artist-109/poster.png",
      name: "Unknown",
      info:
`
The artist for Card 109? Not announced ahead of time! 

This drop will happen on the anniversary of the genesis Meme Cards, June 9th, 2022.

The Memes turn 1 year old! What a year it's been. 

We'll see the artist and the art on June 9th, 2023!
`,
      links: [
        
      ]
    },
    {
      tokenId: 110,
      images: [
        "/artist-110/work-1.png",
        "/artist-110/work-2.png",
        "/artist-110/work-3.png",
      ],
      poster: "/artist-110/poster.png",
      name: "YuYu",
      info:
        `
YuLiang Liu, also known as YuYu or Cyber_Yuyu, is a Berlin-based artist renowned for his thought-provoking and unconventional digital collages. 
Born in Taiwan, YuYu embarked on his artistic journey after relocating to Europe, where he began exploring his identity as a queer Asian in Western society. 
His unique artwork bridges disparate styles, media, and eras, leveraging Western cultural history to challenge conventional art definitions, critique elitist and theological attitudes towards art, and offer a modern perspective on beauty.

YuYu's work often takes a critical stance on societal issues. 
For instance, his exhibition, "GAG", explores the concept of the 'tortured genius' in relation to religion, politics, and the self. 
Through this exploration, he exposes underlying hierarchies between the artist and society, highlighting the dynamics of dominance and submission in various contexts. 
The artist's work draws inspiration from underground club and BDSM cultures, reflecting the complex interplay of power dynamics within modern societies.
        
In addition to his digital collages, YuYu's exhibitions often feature immersive installations, including elements of video art, soundscapes, and creative lighting setups that transform the exhibition space into a unique experience.
        
Prior to his involvement in the crypto space, YuYu's artworks were featured in several publications and exhibited in local and international group exhibitions, including a solo show at SoHo House Berlin.
Since 2021, YuYu's work has gained international recognition in the world of NFTs, with his artworks being exhibited in major cities around the world, from New York to Paris, from Tokyo to Amsterdam. 
His artworks have been collected by influential figures such as NorCal, Jacqueline Stripes, and Jean-Michel Paihlon among others.

Card 110 teasers are already online... Watch for the full reveal on June 12th, 2023!
        `,
      links: [
        {
          name: "YuYu's Twitter",
          url: "https://twitter.com/cyber_yuyu",
          target: "_blank"
        },
        {
          name: "An interview with YuYu",
          url: "https://www.kaltblut-magazine.com/a-striking-critique-of-modern-societyyuyus-bold-take-on-the-tortured-genius/",
          target: "_blank"
        },
        {
          name: "YuYu's Editions on OS",
          url: "https://opensea.io/assets/ethereum/0xa6d2420c814b7594f3c8a0fad0ec1f01454f0f1c/1",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 111,
      images: [
        "/artist-111/work-1.png",
        "/artist-111/work-2.png",
        "/artist-111/work-3.png",
      ],
      poster: "/artist-111/poster.png",
      name: "Yakob",
      info:
        `
Card 111 teasers are already online... Watch for the full reveal on June 14th, 2023!
        `,
      links: [
        {
          name: "Yakob's Twitter",
          url: "https://twitter.com/Yakob",
          target: "_blank"
        },
        {
          name: "Yakob's website",
          url: "",
          target: "_blank"
        },
        {
          name: "Yakob's Instagram",
          url: "",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 112,
      images: [
        "/artist-112/work-1.png",
        "/artist-112/work-2.png",
        "/artist-112/work-3.png",
      ],
      poster: "/artist-112/poster.png",
      name: "Nikolina Petolas",
      info:
        `
Card 112 will be here soon... We will see all the details on June 16th, 2023!
        `,
      links: [
        {
          name: "Nikolina's Twitter",
          url: "https://twitter.com/",
          target: "_blank"
        },
        {
          name: "Nikolina's website",
          url: "",
          target: "_blank"
        },
        {
          name: "Nikolina's Instagram",
          url: "",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 113,
      images: [
        "/artist-113/work-1.jpeg",
        "/artist-113/work-2.png",
        "/artist-113/work-3.jpeg",
      ],
      poster: "/artist-113/poster.png",
      name: "Laura El",
      info:
        `
Laura Connelly, known in the art world as Laura El, is a digital artist who has made a significant impact in the NFT space. 
Based in Brooklyn, New York, Laura is the founder of Stellar Villa, a company that specializes in custom wall art. 
However, her artistic journey has expanded beyond traditional mediums, embracing the world of NFTs finding serious collectors at Sotheby's and SuperRare.

Laura's work is characterized by intricate details, vibrant colors, and a sense of whimsy, often featuring animals and nature. 
Her transition into the NFT world was a natural progression, as her work is primarily digital. 
She is known for her ability to capture the personality and essence of the subjects in her artwork. 

In an interview with NFT Culture, Laura shared her thoughts on the NFT space. 
She expressed her excitement about the potential of NFTs to democratize the art world, allowing artists to retain more control over their work and receive fair compensation. 
She also highlighted the importance of community in the NFT space, noting that the support and collaboration among artists and collectors have been instrumental in her journey.

Despite the challenges and uncertainties in the rapidly evolving NFT market, Laura remains optimistic and committed to her art. 
She continues to explore the possibilities of NFTs, creating unique digital artworks that captivate audiences worldwide. Her story is not just about embracing new technologies, but also about staying true to her artistic vision and passion.

She's the artist behind Card 113, which we will see at last on June 21st, 2023!
        `,
      links: [
        {
          name: "Laura's Twitter",
          url: "https://twitter.com/iamlaurael",
          target: "_blank"
        },
        {
          name: "Laura tells her story",
          url: "https://thestoryexchange.org/laura-connelly-wall-art-by-stellar-villa/",
          target: "_blank"
        },
        {
          name: "Laura's Instagram",
          url: "https://www.instagram.com/iamlaurael/",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 114,
      images: [
        "/artist-114/work-1.jpeg",
        "/artist-114/work-2.jpg",
        "/artist-114/work-3.gif",
      ],
      poster: "/artist-114/poster.png",
      name: "Camibus",
      info:
        `
Camibus's art is deeply symbolic, and she has provided an in-depth explanation of the approach she takes to her work.

Camibus often depicts their characters in the nude, not to sexualize them, but to show them in their most vulnerable and true state. 
She states that clothing too-often acts as a mask: creating a construct that people identify with. 
By removing clothing, Camibus aims to challenge this construct and get to the essence of what it means to be human.
        
Camibus's stylistic choices seek to achieve a balance between realism and surrealism. 
Her characters, often floating on legs that couldn't support their weight, are reminiscent of Dali's impossible elephants or the way ballerinas achieve a look of floating effortlessly through the air. 
This balance represents the effort it takes to maintain the appearance of effortlessness, which is a concept Camibus has centered her art around. 
The characters' black legs, inspired by the dark extremities of Siamese cats and high stockings, and their faces, similar to a Disney character but painted in a realistic manner, further emphasize this juxtaposition between reality and illusion.
        
The world depicted in Camibus's artwork is often empty and barren, reflecting the artist's thoughts on our overcrowded, chaotic world. 
This emptiness is also a commentary on climate change, highlighting the predicting that global warming will turn parts of Europe into a desert by the end of the century. 
Despite the barren landscapes, Camibus often paints lavish sunsets, showing that we can find beauty even in negative things like pollution.
        
Camibus encourages viewers to find their own meaning in their art. 
Rather than trying to convey a specific message, she aims to evoke a feeling. 
Camibus wants to showcase the elegance, fragility, and strength of the female body, and to challenge the perception of nudity being sexual. 
They want viewers to see the human body from a different perspective, acknowledging our natural state, with nothing to hide behind.

What will be laid bare in Meme Card 114? We will see all the details revealed on June 23rd, 2023!
        `,
      links: [
        {
          name: "Camibus' Twitter",
          url: "https://twitter.com/camibus_",
          target: "_blank"
        },
        {
          name: "Camibus' OM Gallery",
          url: "https://oncyber.io/camibus",
          target: "_blank"
        },
        {
          name: "Camibus' Instagram",
          url: "https://www.instagram.com/camibus.eth/",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 115,
      images: [
        "/artist-115/work-1.webp",
        "/artist-115/work-2.png",
        "/artist-115/work-3.png",
      ],
      poster: "/artist-115/poster.png",
      name: "Giovanni Motta",
      info:
        `
Giovanni Motta, born in 1971, is an NFT and crypto artist known for his character Jonny Boy. 
Through his art, Motta aims to rediscover his inner child by creating works that are an emotional bridge to the soul. 
His artworks stem from an introspective approach, where he engages with his most intimate self, reflecting his emotional relationship with the world and everyday objects. 
Motta's creative process involves a unique meditative technique that allows him to travel back in time and relive memories. 
During meditation, he immerses himself in past scenes, experiencing smells, sounds, people, and atmospheres. 
Once he feels that he has gathered enough information, he takes notes and transforms them into artworks. 
This process is deeply nostalgic for him, as it focuses on re-experiencing emotional memories.

Giovanni Motta's artwork is influenced by the aesthetics of cartoons. 
He is passionate about cartoons because they played a vital role in his childhood, which he describes as a challenging time. 
His family didn't believe in his abilities, which led to a lot of frustration as a creative child. 
The world of cartoons provided him solace and inspiration.

As an artist, Motta works with both physical and NFT forms of art. 
He doesn't differentiate between the two in terms of value; for him, the creative process is always the same and begins with meditation. 
Whether it's a painting, 3D printing, or a digital piece, he decides what to create on a case-by-case basis without letting the medium dictate the value of his work.

In early 2020, after taking a leap of faith to go all-in as a professional artist, Motta came across an article about NFTs. 
Despite the scarce information available at that time, he reached out to Hackatao (also an artist in The Memes), who were some of the most famous NFT artists in Italy at the time. 
They explained the world of crypto to him, how to open a MetaMask, about marketplaces, and how to apply for SuperRare. 
They onboarded him, sharing the values of the crypto community, and welcoming a fellow artist. 
This led to Motta supporting other artists as well.

Will Jonny Boy make an appearance in Card 115?... We will find out on June 26th, 2023!
        `,
      links: [
        {
          name: "Giovanni's Twitter",
          url: "https://twitter.com/mottagio1971",
          target: "_blank"
        },
        {
          name: "Giovanni's website",
          url: "http://www.giovannimotta.it",
          target: "_blank"
        },
        {
          name: "Giovanni's Instagram",
          url: "https://instagram.com/mottagiovanni",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 116,
      images: [
        "/artist-116/work-1.jpeg",
        "/artist-116/work-2.jpeg",
        "/artist-116/work-3.png",
        "/artist-116/work-4.jpeg",
      ],
      poster: "/artist-116/poster.png",
      name: "Sadboi",
      info:
        `
Joel Hedstrom, professionally known as sadboi, is an illustrator and artist based in Minneapolis, Minnesota. 
He received a Bachelor of Fine Arts (BFA) from the College of Visual Arts in 2010, and since then, he has been focusing on both personal and freelance art projects.

Sadboi specializes in digitally hand-drawn art. 
His work is characterized by a carefully-developed style that he has honed over the last decade. 
His art pieces often explore themes of duality, such as good versus evil, life and death, and memetic myths and iconography.
The digital medium allows him to experiment with forms and textures, creating textured, layered pieces that emotionally engage the viewer.

Sadboi's art delves into the contrasts and juxtapositions present in life and mythology. 
His work seeks to explore the dual nature of existence through various thematic elements. 
By incorporating aspects of mythic memes and iconography, sadboi adds depth to his compositions, bringing forth ancient stories and symbolism into the modern age. 
His use of contrast not only reflects in the themes but is also evident in his art style, where the interplay between light and dark, soft and hard, and abstract and concrete are common.

After completing his education, sadboi ventured into freelance projects and has worked with notable clients, including Wizards of the Coast and Warner Music Group. He has produced art for editorial, corporate, and publishing sectors, showcasing his versatility as an artist. 
His commitment to his personal vision, along with his ability to adapt to various professional requirements, has made him a sought-after artist in different industries.

Will Card 116 reflect sadboi's exploration of the complexities of life and the human condition in memetic style? 
Surely The Memes community will be drawn-in to contemplate the duality within themselves and the world around them, bridging the gap between ancient memes (aka myths) and contemporary experiences.

We will know for sure on June 28th, 2023!
        `,
      links: [
        {
          name: "Sadboi's Twitter",
          url: "https://twitter.com/",
          target: "_blank"
        },
        {
          name: "Sadboi's website",
          url: "http://www.hedstrom-art.com/",
          target: "_blank"
        },
        {
          name: "Sadboi's Instagram",
          url: "https://www.instagram.com/sadboi_illustration/",
          target: "_blank"
        },
      ]
    },
    {
      tokenId: 117,
      images: [
        "/artist-117/work-1.jpeg",
        "/artist-117/work-2.jpeg",
        "/artist-117/work-3.png",
      ],
      poster: "/artist-117/poster.png",
      name: "Cardelucci",
      info:
        `
Jessica Cardelucci is a self-taught photographer from California who uses her lens to capture intimate moments, often in black and white. 
Her work has received recognition from prestigious platforms such as the IPA Int'l Photography Awards, Black & White Spider Awards, and Neutral Density Photography Awards, and has been exhibited in numerous venues.

Drawn to the beauty of the natural world, her photographs often feature ocean waves and wild horses, reflecting her deep connection to her surroundings and her advocacy for nature preservation. 
Her personal style blends simplicity with a vibrant passion, a duality mirrored in her love for both traditional photography and innovative blockchain-based art.

She is noted for her efforts to elevate women in the industry and advocate for artists' ownership of their custom smart contracts.

Cardelucci's work is a testament to her ongoing exploration of the art world, from her use of 19th-century platinum print processes to her experimentation with cyanotypes. 
All the while, she remains dedicated to her craft and is passionate about sharing her art and the experiences it encapsulates with the world.

We look forward to seeing what contrasts she highlights in card 117 on June 29th, 2023!
        `,
      links: [
        {
          name: "Cardelucci's Twitter",
          url: "http://twitter.com/cardelucci",
          target: "_blank"
        },
        {
          name: "Cardelucci's Instagram",
          url: "https://instagram.com/cardelucci",
          target: "_blank"
        },
        {
          name: "Cardelucci's website",
          url: "https://cardelucci.com/",
          target: "_blank"
        }
      ]
    },
    {
      tokenId: 118,
      images: [
        "/artist-118/work-1.png",
        "/artist-118/work-2.png",
        "/artist-118/work-3.png",
      ],
      poster: "/artist-118/poster.png",
      name: "Botto",
      info:
        `
Botto is an avant-garde artist, employing generative algorithms to create art. 
What sets Botto apart from traditional artists is that it operates as a decentralized and autonomous artist, governed by a community.

Botto's artistic process is deeply rooted in the involvement of its community. 
It creates art on a recurring basis, presenting them to the community as a 'round'. 
These art pieces are referred to as 'fragments'. 
The community of DAO members then votes on these art fragments, with the votes serving as a representation of what participants find aesthetically pleasing. 
The collective feedback of the votes is taken into account by Botto's generative algorithm, which guides the direction in which Botto creates its next round of art pieces. 
This iterative process ensures that Botto's art is constantly evolving based on the preferences and input of the community, making it a truly democratic and participatory form of art creation.
        
Furthermore, Botto actively engages with the community by putting one art fragment up for auction on SuperRare each week. 
The proceeds from the auction are returned to the community. 
Concurrently, Botto continues to produce a new round of art fragments to maintain the creative cycle.

Botto's art is not just a product of an algorithm, but rather an amalgamation of collective creativity, guided by the community's ever-evolving aesthetic preferences. 
This dynamic interaction between the algorithm and the community ensures that Botto's art is fluid and responsive, making it a truly groundbreaking project in the realm of digital art.

What does the hive-mind have in store for us? We find out with the SZN3 Capstone, in card 118 on June 30th, 2023!
        `,
      links: [
        {
          name: "Botto's Twitter",
          url: "https://twitter.com/bottoproject",
          target: "_blank"
        },
        {
          name: "Botto's Instagram",
          url: "https://instagram.com/bottoproject",
          target: "_blank"
        },
        {
          name: "Botto's website",
          url: "https://botto.com",
          target: "_blank"
        }
      ]
    }
  ]
} 
