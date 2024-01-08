import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { Container } from "react-bootstrap";
import styles from "@/styles/Home.module.scss";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import ArtistProfile from "@/components/artistProfile/ArtistProfile";

interface Link {
  url: string;
  name: string;
}

interface Artist {
  tokenId: number;
  images: string[];
  poster: string;
  posterMintUrl: string;
  name: string;
  info: string;
  links: Link[];
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
        <meta property="og:url" content={`https://om.pub/artist`} />
        <meta
          property="og:title"
          content={`Preview: Meme Artist ${artistId} | The OM Pub`}
        />
        <meta
          property="og:image"
          content={`https://om.pub/artist-${artistId}/poster.gif`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@OM_Pub_" />
        <meta
          name="twitter:title"
          content={`Preview: Meme Artist ${artistId}`}
        />
        <meta
          name="twitter:description"
          content="Celebrating the artist of a new card in The Memes fam!"
        />
        <meta
          name="twitter:image"
          content={`https://om.pub/artist-${artistId}/poster.gif`}
        />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <ArtistProfile artistsData={props.artists} />
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = artistsData.artists.map((artist) => ({
    params: { token: artist.tokenId.toString() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: artistsData,
  };
};

const artistsData = {
  artists: [
    {
      tokenId: 83,
      images: [
        "/artist-83/work-1.jpeg",
        "/artist-83/work-2.jpeg",
        "/artist-83/work-3.jpeg",
      ],
      poster: "/artist-83/poster.gif",
      posterMintUrl: "https://app.manifold.xyz/c/rememeposter",
      name: "Luna Leonis",
      info: `We are proud to welcome Luna Leonis to the 6529 Meme artist family. 

She's well known for creating whimsical and magical digital art. Her artwork tells stories conveyed through vibrant colors and bold patterns, capturing the imagination of her viewers. Her use of the moon (thus the name Luna) creates a dreamlike quality in her pieces.

Luna's style uniquely blends color, texture, and form. Her pieces often incorporate intricate details inviting viewers to explore and discover hidden meanings. Her artwork reflects her creative spirit, allowing her to share her vision with the world.

Luna has been recognized for her work in the NFT community and has gained a following of notable collectors, including @blocknoob, PAK, and Cozomo. Her pieces have been sold on SuperRare, Foundation, and she has even minted on Tezos.

In addition to her work as an artist, Luna also advocates for women's empowerment through her artwork. Her statement:

"I am me. Plain. Simple. Thriving. Loving. Invincible. I am a woman." Speaks volumes. 

Luna's art embodies a sense of wonder and imagination, inviting the viewer to experience a world of whimsy and magic. We can't wait to see what she has created for our community...and the world.`,
      links: [
        {
          name: "Luna's Twitter",
          url: "https://twitter.com/lunaleonis",
        },
        {
          name: "Luna's Linktree",
          url: "https://linktr.ee/lunaleonis",
        },
        {
          name: "Luna's Wonderland Discord Server",
          url: "https://discord.gg/JAhzGprv",
        },
      ],
    },
    {
      tokenId: 84,
      images: [
        "/artist-84/work-1.jpeg",
        "/artist-84/work-2.jpeg",
        "/artist-84/work-3.jpeg",
      ],
      poster: "/artist-84/poster.png",
      posterMintUrl: "",
      name: "UNNKNOWN",
      info: `We are proud to welcome UNNKNOWN to the 6529 Meme artist family. 

...We can't wait to see what she has created for our community...and the world.`,
      links: [
        {
          name: "UNNKNOWN's Twitter",
          url: "https://twitter.com/UNNKNOWN",
        },
        {
          name: "UNNKNOWN's Linktree",
          url: "https://linktr.ee/UNNKNOWN",
        },
        {
          name: "UNNKNOWN's Discord Server",
          url: "https://discord.gg/UNNKNOWN",
        },
      ],
    },
    {
      tokenId: 85,
      images: [
        "/artist-85/work-1.jpeg",
        "/artist-85/work-2.gif",
        "/artist-85/work-3.png",
        "/artist-85/work-4.jpeg",
      ],
      poster: "/artist-85/poster.gif",
      posterMintUrl: "",
      name: "6529er",
      info: `We are proud to welcome 6529er back to the 6529 Meme artist family. 

Dive into the mysterious world of 6529er, a visionary NFT artist who captivates collectors with his minimalist masterpieces. 
Emerging in the crypto-art realm in 2021, 6529er has gained a place of prominence as the pre-eminent artist of The Memes by 6529 collection, for his sleek, thought-provoking designs.

With a penchant for geometric shapes, bold colors, and a touch of wry humor, 6529er crafts pieces that invite deep contemplation. 
His works in The Memes are infused with meaning, and blur the lines between digital art and hard-hitting educational experiences.

Despite his enigmatic persona, 6529er actively engages with the NFT community, providing leadership and support to The Memes community. 
As the NFT landscape evolves, 6529er's distinctive artistry continues to intrigue and delight, making them a force to be reckoned with in the metaverse.

Stoked for more from 6529er!
        .`,
      links: [
        {
          name: "6529er's Twitter",
          url: "https://twitter.com/6529er",
        },
        {
          name: "6529er on Foundation",
          url: "https://foundation.app/@6529er",
        },
        {
          name: "Find @6529er in the OM Discord Server",
          url: "https://discord.gg/JAhzGprv",
        },
      ],
    },
    {
      tokenId: 86,
      images: [
        "/artist-86/work-1.gif",
        "/artist-86/work-2.png",
        "/artist-86/work-3.png",
      ],
      poster: "/artist-86/poster.gif",
      posterMintUrl: "",
      name: "PopWonder",
      info: `Hailing from the vibrant city of Portland, Oregon, Pop Wonder is an enigmatic NFT artist who has taken the digital world by storm. 
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
        },
        {
          name: "PopWonder's Linktree",
          url: "https://linktr.ee/popwonder/",
        },
        {
          name: "PopWonder's Discord",
          url: "https://discord.com/invite/Jxw5CWumEK",
        },
        {
          name: "An Interview with PopWonder",
          url: "https://mirror.xyz/atriumart.eth/RQ9W1aEes7i9PEklaX2IW0xFxmILmyKeu2bFC72ntfM",
        },
      ],
    },
    {
      tokenId: 87,
      images: [
        "/artist-87/work-1.mp4",
        "/artist-87/work-2.mp4",
        "/artist-87/work-3.mp4",
      ],
      poster: "/artist-87/poster.mp4",
      posterMintUrl: "https://app.manifold.xyz/c/Prememe",
      name: "DeeKay",
      info: `
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
        },
        {
          name: "Deekay's Linktree",
          url: "https://linktr.ee/deekaymotion/",
        },
        {
          name: "Deekay's Website",
          url: "https://deekaykwon.com/",
        },
        {
          name: "An Interview with Deekay",
          url: "https://hypemoon.com/2022/9/deekay-nft-animator-interview",
        },
      ],
    },
    {
      tokenId: 88,
      images: [
        "/artist-88/work-1.webp",
        "/artist-88/work-2.gif",
        "/artist-88/work-3.gif",
      ],
      poster: "/artist-88/poster.png",
      posterMintUrl: "",
      name: "Ryan Koopmans",
      info: `
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
        },
        {
          name: "Ryan's Linktree",
          url: "https://linktr.ee/ryankoopmans/",
        },
        {
          name: "Ryan's Website",
          url: "https://www.ryankoopmans.com/",
        },
        {
          name: "Ryan's Discord",
          url: "https://discord.com/invite/AVeGUcAMdY",
        },
      ],
    },
    {
      tokenId: 89,
      images: ["/artist-89/work-1.gif"],
      poster: "/artist-89/poster.gif",
      posterMintUrl: "",
      name: "Made by Megan",
      info: `
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
        },
        {
          name: "Megan's Website",
          url: "https://www.madebymegan.io/",
        },
        {
          name: "Megan's Discord",
          url: "https://discord.gg/PRsKywkuqU",
        },
      ],
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
      info: `
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
        },
        {
          name: "Meg Thorpe's Instagram",
          url: "https://www.instagram.com/megthorpeart/",
        },
        {
          name: "Meg Thorpe's Digital Gallery",
          url: "https://oncyber.io/megthorpeart",
        },
      ],
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
      info: `
Fidel creates NFT photos. 
`,
      links: [
        {
          name: "Fidel's Twitter",
          url: "https://twitter.com/FidelEverywhere",
        },
        {
          name: "Fidel's LinkTree",
          url: "https://linktr.ee/fideleverywhere/",
        },
      ],
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
      info: `
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
        },
        {
          name: "Angela's Instagram",
          url: "https://www.instagram.com/angela_nikolau/",
        },
        {
          name: "Angela's Art on Foundation",
          url: "https://foundation.app/@Angela_Nikolau",
        },
      ],
    },
    {
      tokenId: 93,
      images: [
        "/artist-93/work-1.png",
        "/artist-93/work-2.gif",
        "/artist-93/work-3.jpeg",
      ],
      poster: "/artist-93/poster.png",
      posterMintUrl: "",
      name: "@mbsjq",
      info: `
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
      links: [
        {
          name: "mbsjq's Twitter",
          url: "https://twitter.com/mbsjq",
        },
        {
          name: "mbsjq's Instagram",
          url: "https://www.instagram.com/madebystudiojq/",
        },
        {
          name: "mbsjq's Homepage",
          url: "https://www.madebystudiojq.com/",
        },
      ],
    },
    {
      tokenId: 94,
      images: [
        "/artist-94/work-1.gif",
        "/artist-94/work-2.png",
        "/artist-94/work-3.png",
      ],
      poster: "/artist-94/poster.png",
      posterMintUrl: "",
      name: "Jeff Soto",
      info: `
We welcome Jeff Soto, the renowned artist and illustrator, as the artist of Meme Card 94! 

Jeff Soto is a contemporary artist, illustrator, and muralist who has been active in the art scene since the early 2000s. 
His work is known for its unique fusion of pop surrealism, street art, and graffiti, creating a distinct visual language. 
His art often features colorful and imaginative characters or creatures, as well as themes related to nature, society, and personal experiences.

Jeff Soto's vibrant fusion of pop surrealism and street art is bound to paint a whole new dimension of creativity onto The Memes project canvas!
`,
      links: [
        {
          name: "Jeff's Twitter",
          url: "https://twitter.com/jeffsotoart",
        },
        {
          name: "Jeff's Instagram",
          url: "https://www.instagram.com/jeffsotoart/",
        },
        {
          name: "Jeff's Homepage",
          url: "https://jeffsoto.com/",
        },
      ],
    },
    {
      tokenId: 95,
      images: [
        "/artist-95/work-1.jpeg",
        "/artist-95/work-2.jpeg",
        "/artist-95/work-3.png",
      ],
      poster: "/artist-95/poster.png",
      posterMintUrl: "",
      name: "Andreas Preis",
      info: `
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
      links: [
        {
          name: "Andreas's Twitter",
          url: "https://twitter.com/andreaspreis",
        },
        {
          name: "Andreas's Instagram",
          url: "https://www.instagram.com/andreaspreis/",
        },
        {
          name: "Andreas's Art on Foundation",
          url: "https://foundation.app/@AndreasPreis",
        },
      ],
    },
    {
      tokenId: 96,
      images: [
        "/artist-96/work-1.jpeg",
        "/artist-96/work-2.jpeg",
        "/artist-96/work-3.png",
      ],
      poster: "/artist-96/poster.png",
      posterMintUrl: "",
      name: "Billy Dinh",
      info: `
Meet Billy Dinh, the avant-garde lens virtuoso who's been reshaping the face of modern photography. 
Known for his ingenious integration of everyday life and surrealism, Dinh's work seizes the ephemeral, turning fleeting moments into timeless art.

Born in the vibrant streets of Houston, Texas, Dinh's artistic journey is as colorful as his portfolio. 
His knack for capturing the essence of his subjects, whether it's the raw energy of urban spaces or the nuanced play of light on a tranquil landscape, is truly distinctive.

In the world of memes, where ideas spread and evolve at a breakneck pace, Billy brings his unique touch of authenticity and creativity. 
Dinh's genius lies in his ability to see the extraordinary in the ordinary, transforming the mundane into visuals that speak volumes.

Billy Dinh doesn't just take photos—he crafts stories, immortalizing moments with a click, challenging perceptions, and pushing the boundaries of photographic storytelling.

So now we embark on the memetic journey with Billy Dinh, with excitement to see his signature style develop in this new frame of reference!
`,
      links: [
        {
          name: "Billy's Twitter",
          url: "http://twitter.com/billydeee_",
        },
        {
          name: "Billy's Instagram",
          url: "http://instagram.com/billydeee",
        },
        {
          name: "Billy's Website",
          url: "http://billydinh.com",
        },
      ],
    },
    {
      tokenId: 97,
      images: [
        "/artist-97/work-1.png",
        "/artist-97/work-2.png",
        "/artist-97/work-3.png",
      ],
      poster: "/artist-97/poster.png",
      posterMintUrl: "",
      name: "Matt Doogue",
      info: `
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
      links: [
        {
          name: "Matt's Twitter",
          url: "https://www.twitter.com/mattdoogue",
        },
        {
          name: "Matt's Instagram",
          url: "https://instagram.com/mattd85",
        },
        {
          name: "Matt's Website",
          url: "https://mattsmacro.co.uk",
        },
      ],
    },
    {
      tokenId: 98,
      images: [
        "/artist-98/work-1.png",
        "/artist-98/work-2.gif",
        "/artist-98/work-3.jpeg",
      ],
      poster: "/artist-98/poster.png",
      posterMintUrl: "",
      name: "Degen Alfie",
      info: `
Degen Alfie is The Memes artist number 98, so get excited! 

Alfie is based in the UK and creates art influenced by a variety of sources, including cyberpunk, anime, and video games. 
He is also inspired by the work of other artists, such as Jean-Michel Basquiat, Keith Haring, and Andy Warhol.

Alfie's process for creating art is driven by his desire to experiment and explore new possibilities. 
He often starts with a sketch or a rough idea, and then he uses digital tools to develop the image. 
He is always looking for new ways to use technology to create art that is both visually appealing and intellectually stimulating.

His ambitious projects include the Degen Alphabet, which chronicles the events, the weirdness, and the characters of this bizarre crypto tale.

He's shared his sketch process, he's shared his art with the world, and now he shares the glory of The Memes with us all.
`,
      links: [
        {
          name: "Alfie's Twitter",
          url: "https://twitter.com/Degen_Alfie",
        },
        {
          name: "Matt's Instagram",
          url: "https://instagram.com/mattd85",
        },
        {
          name: "Alfie's Website",
          url: "https://degenalphabet.com/",
        },
      ],
    },
    {
      tokenId: 99,
      images: [
        "/artist-99/work-1.jpeg",
        "/artist-99/work-2.jpeg",
        "/artist-99/work-3.webp",
      ],
      poster: "/artist-99/poster.png",
      posterMintUrl: "",
      name: "Mike Hirshon",
      info: `
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
      links: [
        {
          name: "Mike's Twitter",
          url: "https://twitter.com/MikeHirshon",
        },
        {
          name: "Mike's Instagram",
          url: "https://instagram.com/MichaelHirshon",
        },
        {
          name: "Mike's Website",
          url: "https://hirshon.net",
        },
      ],
    },
    {
      tokenId: 100,
      images: [
        "/artist-100/work-1.jpeg",
        "/artist-100/work-2.gif",
        "/artist-100/work-3.png",
        "/artist-100/work-4.jpeg",
      ],
      poster: "/artist-100/poster.gif",
      posterMintUrl: "",
      name: "6529er",
      info: `
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
        },
        {
          name: "6529er on Foundation",
          url: "https://foundation.app/@6529er",
        },
        {
          name: "Find @6529er in the OM Discord Server",
          url: "https://discord.gg/JAhzGprv",
        },
      ],
    },
    {
      tokenId: 101,
      images: [
        "/artist-101/work-1.gif",
        "/artist-101/work-2.png",
        "/artist-101/work-3.gif",
      ],
      poster: "/artist-101/poster.gif",
      posterMintUrl: "",
      name: "Lord Jamie V Shill",
      info: `
LordJamieVShiLL is a boundary-pushing artist entrenched in the Bitcoin and NFT realm. 

As the self-proclaimed "Master of the ShiLL", he is widely recognized for his creations that seem to build from a subversive exploration of digital and blockchain mediums. 
His work often incorporates elements of humor, parody, and pop culture references, with a particular focus on the iconography of the Pepe the Frog. 
By engaging with the Fake Rare and Counterparty NFT scene, he challenges conventional notions of rarity and value in the digital art world, with his own unique flair.

Beyond his individual creations, he plays a significant administrative role in the Pepe Pawn Shop, a community centered around Pepe-themed artwork and tokens. 
He is also associated with the Pepe Warhol Foundation, suggesting an affinity for reinterpretation and parody in the style of the legendary pop artist. 
LordJamieVShiLL's work can be found on various digital art platforms, where he showcases his distinctive and oftentimes humorous take on digital collectibles​.

We don't yet know what LordJamieVShiLL will brings to The Memes, but don't bet against a Pepe!
`,
      links: [
        {
          name: "Jamie's Twitter",
          url: "https://twitter.com/LordJamieVShiLL",
        },
        {
          name: "Jamie's Fake Rares",
          url: "https://pepe.wtf/artists/Lord-Jamie-V.-Shill",
        },
        {
          name: "3PEACE's OM Gallery",
          url: "https://oncyber.io/spaces/H82ITP1XLj59OvHTiI7t?coords=-1.71x2.03x-12.96x-1.74",
        },
      ],
    },
    {
      tokenId: 102,
      images: [
        "/artist-102/work-1.gif",
        "/artist-102/work-2.jpeg",
        "/artist-102/work-3.png",
      ],
      poster: "/artist-102/poster.gif",
      posterMintUrl: "",
      name: "@GxngYxng",
      info: `
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
      links: [
        {
          name: "GxngYxng's Twitter",
          url: "https://twitter.com/gxngyxng",
        },
        {
          name: "GxngYxng's creations",
          url: "https://opensea.io/GxngYxngNFT/created",
        },
        {
          name: "GxngYxng's website",
          url: "https://ghxsts.com/",
        },
      ],
    },
    {
      tokenId: 103,
      images: [
        "/artist-103/work-1.jpeg",
        "/artist-103/work-2.svg",
        "/artist-103/work-3.svg",
      ],
      poster: "/artist-103/poster.gif",
      name: "Jack Butcher",
      info: `Jack Butcher the creator of "VV - Checks" is a former creative director for multi-billion dollar brands, having spent a decade working in Fortune 100 advertising in New York City. Despite the industry's excitement, he felt restricted by the lack of freedom in his work. In search of a solution, he started his own advertising agency but found even less freedom.

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
        },
        {
          name: "Jack's Check Art",
          url: "https://checks.art/",
        },
        {
          name: "Jack's Blog Posts",
          url: "https://visualizevalue.com/blogs/visuals",
        },
      ],
    },
    {
      tokenId: 104,
      images: [
        "/artist-104/work-1.png",
        "/artist-104/work-2.gif",
        "/artist-104/work-3.gif",
      ],
      poster: "/artist-104/poster.gif",
      name: "Timpers",
      info: `
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
        },
        {
          name: "Timpers on Foundation",
          url: "https://foundation.app/Timpers",
        },
        {
          name: "Timpers' Website",
          url: "https://timpers.format.com",
        },
      ],
    },
    {
      tokenId: 105,
      images: [
        "/artist-105/work-1.png",
        "/artist-105/work-2.png",
        "/artist-105/work-3.png",
      ],
      poster: "/artist-105/poster.png",
      name: "José Ramos",
      info: `
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
        },
        {
          name: "José on SuperRare",
          url: "https://superrare.com/joseramos",
        },
        {
          name: "José's Website",
          url: "https://timpers.format.com",
        },
      ],
    },
    {
      tokenId: 106,
      images: [
        "/artist-106/work-1.jpeg",
        "/artist-106/work-2.png",
        "/artist-106/work-3.png",
        "/artist-106/work-4.png",
      ],
      poster: "/artist-106/poster.png",
      name: "ICKI x noCreative",
      info: `
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
        },
        {
          name: "noCreative's Twitter",
          url: "https://twitter.com/nocreative_eth",
        },
        {
          name: "Bloom Collective",
          url: "https://thisisbloom.xyz",
        },
      ],
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
      info: `
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
        },
        {
          name: "yungwknd's Website",
          url: "https://www.yungwknd.xyz/",
        },
        {
          name: "yungwknd's Website",
          url: "https://www.yungwknd.xyz/",
        },
      ],
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
      info: `
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
        },
        {
          name: "Donglu's Instagram",
          url: "http://instagram.com/donglulittlefish",
        },
        {
          name: "Donglu on Superrare",
          url: "https://superrare.com/donglu",
        },
      ],
    },
    {
      tokenId: 109,
      images: [],
      poster: "/artist-109/poster.png",
      name: "Unknown",
      info: `
The artist for Card 109? Not announced ahead of time! 

This drop will happen on the anniversary of the genesis Meme Cards, June 9th, 2022.

The Memes turn 1 year old! What a year it's been. 

We'll see the artist and the art on June 9th, 2023!
`,
      links: [],
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
      info: `
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
        },
        {
          name: "An interview with YuYu",
          url: "https://www.kaltblut-magazine.com/a-striking-critique-of-modern-societyyuyus-bold-take-on-the-tortured-genius/",
        },
        {
          name: "YuYu's Editions on OS",
          url: "https://opensea.io/assets/ethereum/0xa6d2420c814b7594f3c8a0fad0ec1f01454f0f1c/1",
        },
      ],
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
      info: `
Card 111 teasers are already online... Watch for the full reveal on June 14th, 2023!
        `,
      links: [
        {
          name: "Yakob's Twitter",
          url: "https://twitter.com/Yakob",
        },
        {
          name: "Yakob's website",
          url: "",
        },
        {
          name: "Yakob's Instagram",
          url: "",
        },
      ],
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
      info: `
Card 112 will be here soon... We will see all the details on June 16th, 2023!
        `,
      links: [
        {
          name: "Nikolina's Twitter",
          url: "https://twitter.com/",
        },
        {
          name: "Nikolina's website",
          url: "",
        },
        {
          name: "Nikolina's Instagram",
          url: "",
        },
      ],
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
      info: `
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
        },
        {
          name: "Laura tells her story",
          url: "https://thestoryexchange.org/laura-connelly-wall-art-by-stellar-villa/",
        },
        {
          name: "Laura's Instagram",
          url: "https://www.instagram.com/iamlaurael/",
        },
      ],
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
      info: `
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
        },
        {
          name: "Camibus' OM Gallery",
          url: "https://oncyber.io/camibus",
        },
        {
          name: "Camibus' Instagram",
          url: "https://www.instagram.com/camibus.eth/",
        },
      ],
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
      info: `
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
        },
        {
          name: "Giovanni's website",
          url: "http://www.giovannimotta.it",
        },
        {
          name: "Giovanni's Instagram",
          url: "https://instagram.com/mottagiovanni",
        },
      ],
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
      info: `
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
        },
        {
          name: "Sadboi's website",
          url: "http://www.hedstrom-art.com/",
        },
        {
          name: "Sadboi's Instagram",
          url: "https://www.instagram.com/sadboi_illustration/",
        },
      ],
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
      info: `
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
        },
        {
          name: "Cardelucci's Instagram",
          url: "https://instagram.com/cardelucci",
        },
        {
          name: "Cardelucci's website",
          url: "https://cardelucci.com/",
        },
      ],
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
      info: `
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
        },
        {
          name: "Botto's Instagram",
          url: "https://instagram.com/bottoproject",
        },
        {
          name: "Botto's website",
          url: "https://botto.com",
        },
      ],
    },
    {
      tokenId: 119,
      images: [
        "/artist-119/work-1.jpeg",
        "/artist-119/work-2.jpeg",
        "/artist-119/work-3.jpeg",
      ],
      poster: "/artist-119/poster.png",
      name: "Idil Dursun",
      info: `
Idil Dursun is a digital artist based in Ankara, Turkey, whose work is deeply rooted in the realm of cyberpunk and concept art. 
Her journey into the world of art began at a young age, with a love for painting that has evolved and grown over time. 
From landscapes painted with acrylics and oil to charcoal sketches of portraits, her early work was diverse and exploratory. 
However, it was the world of video games and cyberpunk culture that truly ignited her passion and led her to the path of becoming a concept artist. 
A significant influence was the game World of Warcraft, which had a profound impact on her decision to pursue this particular art form.

Dursun's work is characterized by her fascination with the concept of 'threshold' or a state of change. 
This is evident in her piece "One Way Ticket," where she contrasts a densely populated city with a more expansive and epic upper realm, symbolizing a journey to a new and unfamiliar place. 
Her work often features massive buildings and dystopic sceneries, a testament to her love for cyberpunk culture and concept art.
        
Her education in architecture has also played a significant role in shaping her art. 
It has provided her with the technical knowledge and software skills needed to create her futuristic world concepts. 
This blend of architectural understanding and artistic vision allows her to create pieces that are not only visually stunning but also deeply layered with meaning.
                
Despite her success in NFTs, Dursun remains grounded and continually seeks inspiration from her favorite artists and the art community. 
She believes in the importance of constantly immersing oneself in new art to expand one's vision. 
This philosophy, coupled with her passion for video games and cyberpunk culture, continues to fuel her creativity and drive her forward in her artistic journey.

The next stop is the SZN4 opener, in card 119 on July 17th, 2023!
        `,
      links: [
        {
          name: "Idil's Twitter",
          url: "https://twitter.com/jarvinart",
        },
        {
          name: "Idil's Instagram",
          url: "https://www.instagram.com/jarvinart",
        },
        {
          name: "Idil on Foundation",
          url: "https://foundation.app/@jarvinart",
        },
      ],
    },
    {
      tokenId: 120,
      images: [
        "/artist-120/work-1.jpeg",
        "/artist-120/work-2.gif",
        "/artist-120/work-3.png",
        "/artist-120/work-4.jpeg",
      ],
      poster: "/artist-120/poster.png",
      posterMintUrl: "",
      name: "6529er",
      info: `
It's always an exciting moment to see what 6529er has up his sleeve. 

The Memes are truly anchored by 6529er, a visionary NFT artist who captivates collectors with his minimalist masterpieces. 
Emerging in the crypto-art realm in 2021, 6529er has gained a place of prominence as the pre-eminent artist of The Memes by 6529 collection, for his sleek, thought-provoking designs.

With a penchant for geometric shapes, bold colors, and a touch of wry humor, 6529er crafts pieces that invite deep contemplation. 
His works in The Memes are infused with meaning, and blur the lines between digital art and hard-hitting educational experiences.

Despite his enigmatic persona, 6529er actively engages with the NFT community, providing leadership and support to The Memes community. 
As the NFT landscape evolves, 6529er's distinctive artistry continues to intrigue and delight, making them a force to be reckoned with in the metaverse.

With Card 120, we get even more 6529er, aka "He Who Does Not Miss"!
`,
      links: [
        {
          name: "6529er's Twitter",
          url: "https://twitter.com/6529er",
        },
        {
          name: "6529er on Foundation",
          url: "https://foundation.app/@6529er",
        },
        {
          name: "Find @6529er in the OM Discord Server",
          url: "https://discord.gg/JAhzGprv",
        },
      ],
    },
    {
      tokenId: 121,
      images: [
        "/artist-121/work-1.jpeg",
        "/artist-121/work-2.mp4",
        "/artist-121/work-3.jpeg",
      ],
      poster: "/artist-121/poster.png",
      posterMintUrl: "",
      name: "Eric Paré",
      info: `
Eric Paré is a luminary in the realm of light-painting photography. 
His unique style is characterized by the use of tubes to create ethereal and mesmerizing light trails, often set against breathtaking natural landscapes or urban backdrops. 
Paré's journey with light-painting began with a project titled "LightSpin," where he collaborated with Kim, who later became a significant muse and partner in his artistic endeavors. 
This collaboration marked the beginning of a decade-long journey of exploration and innovation.

Over the years, their adventures took them to diverse locations, from the mossy landscapes of Iceland to the futuristic cityscapes of Shanghai. 
Each location provided a unique canvas for Paré's light-painting, resulting in a myriad of captivating images.
        
A recurring theme in Paré's work is the interplay of different layers in each composition. 
He often juxtaposes a foreground lit by the tube, a figure with a light-painting trace, a dark layer such as hills or dunes, and a vibrant sky. 
This layering technique adds depth and dimension to his images, making them visually striking.
        
Beyond the aesthetics, Paré's work is also about experimentation and pushing boundaries. 
Whether it's playing with unexpected light sources, like the green lights in Vietnam, or exploring new terrains like the salt flats of Bolivia, Paré's approach is always about discovery and innovation.
        
In essence, Eric Paré's artistry is a blend of technical prowess, innovative thinking, and a deep connection with the world around him. 
His light-painting images are not just photographs; they are visual narratives that capture moments of wonder, exploration, and serendipity.

What memes will Card 121 explore? Eric will shed light on it on July 21st, 2023!
`,
      links: [
        {
          name: "Eric's Twitter",
          url: "https://twitter.com/ericpare",
        },
        {
          name: "Eric's Instagram",
          url: "https://www.instagram.com/ericparephoto",
        },
        {
          name: "Eric's Website",
          url: "https://ericpare.com/",
        },
      ],
    },
    {
      tokenId: 122,
      images: [
        "/artist-122/work-1.png",
        "/artist-122/work-2.png",
        "/artist-122/work-3.jpeg",
      ],
      poster: "/artist-122/poster.png",
      posterMintUrl: "",
      name: "Dre Dogue",
      info: `
In the vast realm of NFT art, @dredogue is emerging as a beacon of innovation, seamlessly merging the nostalgic charm of 35mm film with the dynamic world of NFTs. 
His works, often characterized by evocative nude photography, capture the raw essence of human vulnerability and beauty. 
These intimate portrayals are juxtaposed with urban scenes, where the pulse of city life and its myriad stories come alive through his lens. 
Each portrait, whether set against the backdrop of a bustling city or in the quietude of a studio, speaks volumes, revealing layers of emotions, desires, and dreams.

Dredogue's artistic message delves deep into themes of love, passion, and the complexities of human relationships. 
Projects like "Sweet Temptation" and "Tainted Love" not only hint at the transient nature of modern relationships but also explore the depth and intensity of human connections. 
His art is not just a visual treat; it's an experience. 
The interactive elements in some of his NFTs invite audiences to engage, participate, and even shape the journey of the artwork.
        
With a vision that transcends traditional boundaries, @dredogue invites viewers to a world where the past and present coalesce, where the digital realm meets the tangible, and where every shot is a narrative waiting to be unraveled.

What memetic narrative will Card 122 explore? We will see what is exposed on July 24th, 2023!
`,
      links: [
        {
          name: "Dre's Twitter",
          url: "https://twitter.com/dredogue",
        },
        {
          name: "Dre's OS",
          url: "https://opensea.io/dredogue/created",
        },
        {
          name: "Dre's Linktree",
          url: "https://linktr.ee/dredogue",
        },
      ],
    },
    {
      tokenId: 123,
      images: [
        "/artist-123/work-1.png",
        "/artist-123/work-2.gif",
        "/artist-123/work-3.gif",
      ],
      poster: "/artist-123/poster.mp4",
      posterMintUrl: "",
      name: "SamJ Studios",
      info: `
In the heart of Amsterdam's artistic quarters, SamJ has established a creative sanctuary, crafting narratives that resonate deeply with the digital age. 
Born into the dynamic late '90s, their tech-native journey from acquiring a Graphic Design degree at James Madison University to becoming a beacon in the NFT art realm is nothing short of inspiring.

What does such a perspective bring to bear in the world of 3d / VR art and video graphics?
Their pieces, a blend of posthumanist ideologies and avant-garde digital techniques, speak volumes about identity dynamics, gender fluidity, and the intricate dance of self-expression. 
It's no wonder that global powerhouses like Gucci and esteemed platforms such as the Museum of Crypto Art have showcased SamJ's work. 
Their innovative approach has not only garnered attention but also admiration from web3 art trailblazers like Fewocious and gmoney.
        
From the illustrious stages of Miami's SCOPE Art Basel to the revered halls of the Gucci Vault, SamJ's influence is undeniable. 
As we delve deeper into the digital era, their footprint continues to expand, marking them as a true pioneer in the world of digital artistry.

We happily welcome such a young and energetic voice to Card 123 on July 26th, 2023!
`,
      links: [
        {
          name: "SamJ's Twitter",
          url: "https://twitter.com/samjstudios",
        },
        {
          name: "SamJ's Website",
          url: "http://samjstudios.com/",
        },
        {
          name: "SamJ's Linktree",
          url: "https://linktr.ee/Arty",
        },
      ],
    },
    {
      tokenId: 124,
      images: [
        "/artist-124/work-1.png",
        "/artist-124/work-2.gif",
        "/artist-124/work-3.gif",
      ],
      poster: "/artist-124/poster.png",
      posterMintUrl: "",
      name: "Afonso Caravaggio",
      info: `
Afonso Caravaggio is not just a digital artist, but a storyteller of the modern age. 
His works, which seamlessly blend the classical with the contemporary, are a testament to his prowess in merging traditional art sensibilities with the dynamic realm of digital creation.

Caravaggio's Italian-Brazilian roots are fully on display, infusing his works with a rich tapestry of cultural narratives. 
The vibrant energy of Brazil melds with the timeless elegance of classical Italy, creating visuals that are both evocative and transformative.
        
Caravaggio's approach, deeply introspective and rooted in his dual heritage, often delves into the nuances of the digital era while drawing profound inspiration from traditional art forms. 
From the abstract concepts to the culturally rich narratives, his works challenge perceptions, inviting viewers to question, reflect, and immerse themselves in his artistic vision.
        
His overarching message is clear: art is a bridge between epochs, a medium that connects the past's grandeur with the present's innovations and challenges. 
Afonso invites us on a journey that celebrates the beauty of tradition, the excitement of the present, and the limitless possibilities of the future.

And the possibilities for Meme Card 124 have us excited to see it all on July 28th, 2023!
`,
      links: [
        {
          name: "Afonso's Twitter",
          url: "https://twitter.com/carav4ggio",
        },
        {
          name: "Afonso's Instagram",
          url: "https://www.instagram.com/afonsocaravaggio",
        },
        {
          name: "Afonso's Website",
          url: "https://afonsocaravaggio.com/",
        },
      ],
    },
    {
      tokenId: 125,
      images: [
        "/artist-125/work-1.mp4",
        "/artist-125/work-2.mp4",
        "/artist-125/work-3.mp4",
      ],
      poster: "/artist-125/poster.mp4",
      posterMintUrl: "",
      name: "Ryan D. Anderson",
      info: `
Ryan Anderson, hailing from the vibrant city of Toronto, Canada, is not just an animator; he's a storyteller, a dreamer, and an artist who paints with motion. 
From the innocent days of playing with his dad's Hi-8 camcorder to mastering the intricate world of animation, Ryan's journey has been nothing short of cinematic.

It all began with the simple discovery of the interval button on his father's camcorder. 
That moment sparked a passion in young Ryan, leading him down a path of stop-motion fascination. 
But his artistic voyage didn't stop there. 
With formal education in cinematography, Ryan honed his skills, wearing multiple hats - from a film editor and music video director to a photographer. 
Each role he undertook added a new dimension to his understanding of motion and storytelling.
        
In the realm of animation, Ryan employs a unique blend of techniques. 
Utilizing advanced 3D software, he meticulously crafts scenes, bringing them to life with his animation prowess. 
These animated scenes are then transformed into 2D images through a process of photography and rendering. 
The result? A mesmerizing blend of reality and imagination.

But what truly sets Ryan apart is the soul he infuses into his work, blending his experiences, dreams, and the myriad skills he's acquired over the years. 
Ryan's works delve deep into the themes of nostalgia, distilling visions of the impossible into memories etched in time. 
He presents a world that is not just seen but heard felt, reminiscent of dreams or the grainy, warm hues of an old Hi-8 tape.
His animations are not just about motion; they are about emotion, capturing moments that tug at the heartstrings and evoke a sense of longing and nostalgia.

For those keen on exploring the world through the lens of memes, watch for Card 125 to bring art that speaks to the soul, on July 31st, 2023!
`,
      links: [
        {
          name: "Ryan's Twitter",
          url: "https://twitter.com/itsryananderson",
        },
        {
          name: "Ryan's Instagram",
          url: "https://www.instagram.com/itsryandanderson",
        },
        {
          name: "Ryan's Linktree",
          url: "https://linktr.ee/ryandanderson",
        },
      ],
    },
    {
      tokenId: 126,
      images: [
        "/artist-126/work-1.mp4",
        "/artist-126/work-2.jpeg",
        "/artist-126/work-3.jpeg",
      ],
      poster: "/artist-126/poster.png",
      posterMintUrl: "",
      name: "Marcel Deneuve",
      info: `
Marcel Deneuve is an illustrious illustrator and concept artist whose work is a testament to his profound understanding of visual storytelling. 
His proflific sci-fi themed work is built around creating illustrations that captivate and inspire, across a variety of platforms.

Marcel's portfolio showcases a range of techniques, from detailed illustrations to concept art that breathes life into imaginative worlds. 
His online presence is a testament to his dedication to sharing knowledge, offering tutorials, and engaging with his community. 
He provides insights into his creative process, sharing useful links, books, and even shader samples that give a glimpse into his techniques. 
Marcel's work also includes intricate terrain maps, alphas for rocks, cracks, and damage, and even VDB cloud packs, indicating a versatile skill set that spans both 2D and 3D realms.
        
Furthermore, Marcel's enthusiasm for connecting with his audience is evident through his efforts to launch a Discord server, aiming to foster a community where fans and collectors can interact directly with him.
        
In essence, Marcel Deneuve is not just an artist; he's a creator, educator, and community builder, dedicated to pushing the boundaries of illustration and concept art while nurturing a space for learning and collaboration.

Surely his community spirit will be on display in Meme Card 126! It's coming on Aug 2nd, 2023!
`,
      links: [
        {
          name: "Marcel's Twitter",
          url: "https://twitter.com/marceldeneuve",
        },
        {
          name: "Marcel's Instagram",
          url: "https://www.instagram.com/marceldeneuve",
        },
        {
          name: "Marcel's Art Station",
          url: "https://marceldeneuve.artstation.com/",
        },
      ],
    },
    {
      tokenId: 127,
      images: [
        "/artist-127/work-1.mp4",
        "/artist-127/work-2.jpeg",
        "/artist-127/work-3.jpeg",
      ],
      poster: "/artist-127/poster.png",
      posterMintUrl: "",
      name: "Dominik Gümbel",
      info: `
Dominik Gümbel, hailing from Germany, is a name that resonates with versatility and depth in the world of concept art and visual development. 
As a freelance concept artist and illustrator, he has lent his expertise to renowned studios such as Massive Black and Nuare Studios, showcasing a portfolio that spans across character design, advertisement illustration, and both 2D and 3D animation.

His geographical footprint in the art world is vast. Beyond the realms of gaming and cinema, Gümbel has ventured into the domain of exhibition design, curating experiences for museums scattered throughout Germany. 
Yet, his artistic journey doesn't halt at professional engagements. 
Passionately pursuing his personal art career, Dominik's creations have graced global platforms, from the iconic screens of New York's Times Square to the bustling Shibuya Crossing in Tokyo.
        
Gümbel's skill set is as diverse as his experience. 
He is adept at character and costume design, visual development, graphic design, and illustration. 
His proficiency with tools is equally commendable, working masterfully with a range of software like Photoshop, Illustrator, InDesign, After Effects, Premiere, Blender, and Procreate.
                
Educationally, Dominik has a Bachelor of Arts in Communication Design from HTWG Konstanz. 
His academic journey encompassed a spectrum of fields, from classic graphic design to animation and UI/UX design. 
His bachelor's thesis, focusing on worldbuilding for video games with an emphasis on character design and splash illustration, speaks volumes about his passion for the craft.
                
In essence, Dominik Gümbel is not just an artist; he's a storyteller, a visionary, and a beacon of creativity in the ever-evolving world of art and design.

His stories come to The Memes on Aug 4th, 2023!
`,
      links: [
        {
          name: "DominikG's Twitter",
          url: "https://twitter.com/0xdominikg",
        },
        {
          name: "DominikG's Instagram",
          url: "https://www.instagram.com/dominikguembel",
        },
        {
          name: "DominikG's Art Station",
          url: "https://dominikguembel.artstation.com/albums/8891027",
        },
      ],
    },
    {
      tokenId: 128,
      images: [
        "/artist-128/work-1.gif",
        "/artist-128/work-2.mp4",
        "/artist-128/work-3.mp4",
      ],
      poster: "/artist-128/poster.png",
      posterMintUrl: "",
      name: "Fabiano Speziari",
      info: `
Fabiano Speziari, a multifaceted artist born in 1977, has seamlessly blended his roles as an industrial technical designer and an artist. 
His canvas paintings of trees and natural forms, along with unique resin-made animals, marked the beginning of his artistic journey. 
As he delved deeper, Speziari ventured into land art, crafting installations that resonated with nature's essence. 
His transition into the realm of light and geometric shapes gave birth to the profound “Message in a pencil” series, where luminous pencils became more than just tools, but storytellers.

Driven by a quest to fathom the human soul and its relationship with nature, Speziari's art often mirrors humanity's introspective journey, filled with endless questions seeking elusive answers. 
By 2018, he was captivated by the digital world of cryptoart, leading to the creation of the "Clods" project. 
This series, intertwining elements of dystopia and irony, portrays minuscule earth clods as symbols of a fragmented planet, echoing the resilience of survivors amidst chaos.

His evolving artistic vision is further showcased in exhibitions such as "Light WWW Luminose in mostra," "NFT Revolution," and "Dystopian Visions." 
These works not only highlight his adaptability and forward-thinking approach but also his continuous exploration of themes ranging from the digital art landscape to the contemplative nature of time and the stark realities of a dystopian future. 
Through his work, Speziari invites viewers into a world of reflection, challenging perceptions and sparking dialogue.

This dialogue will continue with Card 128 on Aug 7th, 2023!
`,
      links: [
        {
          name: "Fabiano's Twitter",
          url: "https://twitter.com/fabianospeziari",
        },
        {
          name: "Fabiano's Instagram",
          url: "https://www.instagram.com/fabianospeziari",
        },
        {
          name: "Fabiano's Website",
          url: "https://fabianospeziari.io/",
        },
      ],
    },
    {
      tokenId: 129,
      images: [
        "/artist-129/work-1.webp",
        "/artist-129/work-2.webp",
        "/artist-129/work-3.webp",
      ],
      poster: "/artist-129/poster.png",
      posterMintUrl: "",
      name: "@fak3panelcrimes",
      info: `
Known on Twitter as @fak3panelcrimes (after their orignal account was locked), and generally as "Threepanelcrimes", the next Memes Artist is a distinctive artistic endeavor that has carved a niche in the realm of visual storytelling. 
Operating within the constraints of just three panels, the artist masterfully weaves tales of crime, suspense, and intrigue. 
Every detail, from nuanced character expressions to subtle background elements, is meticulously crafted to convey a narrative, emphasizing the power of visual narrative.

Through their self-described appellation: "CRIME HAIKU CREATOOOR," we know to look for poetry in the art.
This ethos is further defined by two cardinal rules: no dialogue and no word balloons. 
Such constraints underscore the artist's commitment to pure visual storytelling, where images alone carry the weight of the narrative. 
Collaboration lies at the heart of this project. 
Over the years, Threepanelcrimes has joined forces with over 200 global artists, illustrators, animators, and musicians. 
This collaborative spirit not only introduces a rich tapestry of styles and perspectives but also makes the content universally relatable. 
Each story, while concise, is a testament to the diverse artistic voices that contribute to the project.
        
In the digital age, Threepanelcrimes seamlessly integrates contemporary forms of art distribution. 
With a robust presence on platforms like Instagram and well-established in the world of NFTs, the artist engages with modern audiences, emphasizing the importance of visual literacy. 
For those delving into their work, it's an invitation to "read" images, derive meaning from visual cues, and appreciate the art of concise storytelling.

What story will Card 129 reveal? The tale is revealed on Aug 9th, 2023!
`,
      links: [
        {
          name: "Threepanelcrimes' Twitter",
          url: "https://twitter.com/fak3panelcrimes",
        },
        {
          name: "Threepanelcrimes' SuperRare",
          url: "https://superrare.com/threepanelcrimes",
        },
        {
          name: "Threepanelcrimes' Instagram",
          url: "https://www.instagram.com/threepanelcrimes",
        },
      ],
    },
    {
      tokenId: 130,
      images: [
        "/artist-130/work-1.gif",
        "/artist-130/work-2.png",
        "/artist-130/work-3.png",
      ],
      poster: "/artist-130/poster.png",
      posterMintUrl: "",
      name: "Kelly McDermott",
      info: `
"KΞLLY" McDermott, known in the online community as @bykellymcd on Twitter and kellymcdnft on Instagram, is a standout artist in the realm of digital creation. 
Her signature style is rooted in pixel manipulation prowess, where she often shares mesmerizing videos on Instagram that unveil her creation process, revealing each brush stroke that culminates in a final masterpiece.

Her artwork is not just visually captivating but also rich in narrative. 
One of her pieces, "Cryptic Connections," available on SuperRare, is described as a "love story that transcends the boundaries of code, a tale of star-crossed cryptocurrencies destined to forever impact the world of finance and technology." 
Another poignant piece, "50/50," reflects the duality of emotions, calling out: "Life hasn’t been as colourful since you left. At any given moment, I am 50% happy and 50% sad." 
Yet another artwork, titled "adeus tristeza," succinctly conveys a message of hope and rejuvenation with the description, "goodbye sadness, I want to sing again."
        
For those navigating the vast seas of digital art, Kelly McDermott emerges as a beacon of innovation and emotional depth. 
Her ability to intertwine striking visual imagery with profound narratives makes her a standout figure in the contemporary digital art landscape.

What memetic narrative will Card 130 explore? We will see what is exposed on Aug 11th, 2023!
`,
      links: [
        {
          name: "Kelly's Twitter",
          url: "http://www.twitter.com/bykellymcd",
        },
        {
          name: "Kelly's Website",
          url: "https://www.kellymcd.art",
        },
        {
          name: "Kelly's Instagram",
          url: "http://www.instagram.com/kellymcdnft",
        },
      ],
    },
    {
      tokenId: 131,
      images: [
        "/artist-131/work-1.jpeg",
        "/artist-131/work-2.jpeg",
        "/artist-131/work-3.gif",
      ],
      poster: "/artist-131/poster.mp4",
      posterMintUrl: "",
      name: "David Fairs",
      info: `
David Fairs, the creative force behind @newlightvisuals, is a multifaceted artist with a profound connection to the natural world. 
His association with platforms like Nifty Gateway and his role as both an artist and curator showcase his prominence in the digital art community.

David is not just a photographer; he wears many hats, including that of a filmmaker, painter, illustrator, and digital artist. 
His obsession with the ocean is evident, as he dedicates himself to documenting the beauty of nature. 
This passion is particularly highlighted in his "Storm Surfers" series, where he captures the raw and unhinged moments of the sea during tumultuous storms. 
His belief is strong and clear: creators possess a value that often surpasses societal perceptions.

His work on the blockchain is pioneering, with series like "Drone Surfers," which captures surfers from a bird's-eye view, marking it as the first of its kind on the blockchain. 
David's commitment to innovation is also evident in his animations, where he collaborates and experiments with early animation styles, hinting at a future focus in this domain. 

For those exploring the intersection of nature, art, and digital innovation, David Fairs offers a captivating blend of visual mastery and lightning-in-a-bottle captures of exciting moments. 
His work is not just a visual treat but also an invitation to appreciate the intricate beauty of the world around us.

Where does this innovation lead Card 131? All is revealed on Aug 14th, 2023!
`,
      links: [
        {
          name: "David's Twitter",
          url: "https://twitter.com/newlightvisuals",
        },
        {
          name: "David's Website",
          url: "https://www.newlightvisual.com/nft-art",
        },
        {
          name: "David's Instagram",
          url: "https://www.instagram.com/newlightvisuals",
        },
      ],
    },
    {
      tokenId: 132,
      images: [
        "/artist-132/work-1.jpeg",
        "/artist-132/work-2.jpeg",
        "/artist-132/work-3.jpeg",
      ],
      poster: "/artist-132/poster.png",
      posterMintUrl: "",
      name: "Hugo Korhonen",
      info: `
Hugo Korhonen, a young artist from Kuopio, Finland, has a profound connection with nature, which is evident in his photographic works. 
Despite facing bullying throughout his school years, Hugo found solace and empowerment in the natural world. 
This bond with nature not only provided an escape from his distressing school experiences but also paved the way for his professional journey.

Hugo's photography is deeply rooted in his appreciation for the environment. 
He captures nature in all its glory, often juxtaposing the vastness of landscapes with the minuteness of human figures. 
This style emphasizes the harmonious relationship between humans and nature, suggesting that when treated with respect, nature reciprocates with kindness. Hugo's images are not just aesthetically pleasing; they carry a message. 
He hopes to inspire viewers to value and protect the environment and make sustainable choices.
        
Hugo's journey into photography began during a summer at a cottage when he witnessed a captivating weather front approaching. 
Inspired by a cousin's photography, he delved into the world of cameras and photography through YouTube. 
The abundant nature in Kuopio became his refuge, where he could detach from painful school memories and immerse himself in his newfound passion. 
Over time, Hugo's dedication to photography led him to participate in photo competitions, collaborate with businesses, and even sell his works. 
He also generously contributes a portion of his earnings to tree-planting projects in developing countries.
        
Hugo Korhonen's artistry is a testament to the healing power of nature and the resilience of the human spirit. 
Through his lens, he not only showcases the beauty of the world around us but also advocates for its preservation.

Will Meme Card 132 will carry this same message? We find out on August 16th, 2023!
`,
      links: [
        {
          name: "Hugo's Twitter",
          url: "https://twitter.com/hugoraphy",
        },
        {
          name: "Hugo's Website and Portfolio",
          url: "https://www.hugokorhonen.com",
        },
        {
          name: "Hugo's Instagram",
          url: "https://instagram.com/hugoraphy",
        },
      ],
    },
    {
      tokenId: 133,
      images: [
        "/artist-133/work-1.mp4",
        "/artist-133/work-2.mp4",
        "/artist-133/work-3.jpeg",
      ],
      poster: "/artist-133/poster.mp4",
      posterMintUrl: "",
      name: "Michael Kozlowski",
      info: `
Michael Kozlowski, known as mpkoz on Twitter, is a generative artist who envisions a world where art is not confined to traditional mediums.
He's a multifaceted American media artist and software developer who seamlessly blends the realms of 3D graphics, mixed reality, and interactivity.
His work often places generative objects in real space, showcasing the power of digital art, and how it can redefine our understanding of visual experiences. 
One of the recurring themes in his posts is the exploration of repurposing and transforming 2D artwork into 3D, suggesting a vision where art is fluid, dynamic, and ever-evolving.

Mpkoz's style is a harmonious blend of technology and artistry. 
He frequently employs the trompe l'oeil technique, a method that uses realistic imagery to create optical illusions. 
An example of this is his "Manifold Still Life with Hydrangea," where he uses a viewer's head position to simulate perspective in real-time, without any post-production visual effects or compositing. 
This approach not only challenges the viewer's perception but also offers a fresh, immersive experience that bridges the gap between the virtual and the real.
        
His portfolio showcases a profound exploration of generative art, where he harnesses the power of algorithms to create captivating visual compositions. 
Through his works, Michael not only pushes the boundaries of contemporary art but also offers a glimpse into the potential future of galleries and museums.
        
Will we get generative art in Card 133? Few truly know, until Aug 18th, 2023!
`,
      links: [
        {
          name: "Mpkoz's Twitter",
          url: "https://twitter.com/mpkoz",
        },
        {
          name: "Mpkoz's Website",
          url: "https://www.mpkoz.com",
        },
        {
          name: "Mpkoz's Instagram",
          url: "https://www.instagram.com/mpkoz",
        },
      ],
    },
    {
      tokenId: 134,
      images: [
        "/artist-134/work-1.jpeg",
        "/artist-134/work-2.jpg",
        "/artist-134/work-3.jpg",
      ],
      poster: "/artist-134/poster.png",
      posterMintUrl: "",
      name: "MiraRuido",
      info: `
Hailing from Vitoria-Gasteiz, a quaint city in northern Spain, Joseba Elorza, widely recognized as @MiraRuido, has etched his name in the digital art world. 
With over a decade of experience as a freelance artist, he has collaborated with renowned entities like National Geographic Channel, and even music legends like Green Day. 
But it's not just the impressive clientele that sets Elorza apart; it's his unique approach to art. 
As he puts it, “I think that to make simply beautiful works there are already many people who are better than me; my intention is to generate some kind of feeling in the viewer, whether of disbelief, uneasiness or an ironic half smile.”

Elorza's fascination with collage is evident in his works. 
He views it as a medium to "reconstruct realities and create new worlds" that reflect and critique our daily lives. 
This sentiment is further echoed in his words, “I see collage as a way of reconstructing realities and creating new worlds to reflect, highlight and denounce different aspects of our day to day life, of our most everyday reality.” 
Not just content with static visuals, Elorza ventured into the realm of animation, transforming his collages by adding the dimension of time, a self-taught skill that opened a "new world of possibilities" for him.

One of the standout techniques in Elorza's repertoire is rotoscoping, a meticulous process he employs to extract characters from vintage videos and films, introducing them into fresh, often surreal contexts. 
His passion for space, astrophysics, and surrealism frequently manifests in his creations, serving as allegorical tools to address universal themes. 
As he beautifully articulates, “I'm crazy about everything related to space and astrophysics... It is inevitable that this will end up appearing in my work, as well as surrealism, which is the clearest way I see of dealing with universal themes with attractive allegories.”

From across time and space, @MiraRuido brings us Meme Card 134 on Aug 21th, 2023!
`,
      links: [
        {
          name: "Mira's Twitter",
          url: "https://twitter.com/miraruido",
        },
        {
          name: "Mira's instagram",
          url: "https://www.instagram.com/mira.ruido",
        },
        {
          name: "Mira's Website",
          url: "https://www.miraruido.com",
        },
      ],
    },
    {
      tokenId: 135,
      images: [
        "/artist-135/work-1.gif",
        "/artist-135/work-2.gif",
        "/artist-135/work-3.webp",
      ],
      poster: "/artist-135/poster.mp4",
      posterMintUrl: "",
      name: "Rust",
      info: `
In the ever-evolving realm of digital art, rust (@rustnfteth) stands out as a crypto-native artist, bringing a distinctive flavor of web3 art to the blockchain. 
Choosing to remain shrouded in anonymity, rust's identity is as enigmatic as the stories they tell through their art. 
With a commitment to releasing a unique, single-edition piece daily, rust has carved a niche in the NFT space, showcasing their prolific nature and dedication to the craft.

Diving deeper into rust's creations, one is immediately captivated by their signature glitch animations. 
These dynamic visuals, often in the form of looping GIFs, are more than just eye-catching graphics. 
They are narratives that delve into the intricate relationship between humans and technology, exploring the profound impact of the digital age on our lives, psyche, and interactions.
        
As technology continues to shape and redefine our existence, artists like rust challenge us to reflect on its implications. 
Through their crypto-native artworks, rust not only captures the zeitgeist of our times but also prompts introspection on the symbiotic, and often tumultuous, relationship between humanity and its technological creations.

Looks like Meme Card 135 is gettin' glitchy wit it on Aug 23th, 2023!
`,
      links: [
        {
          name: "Rust's Twitter",
          url: "https://twitter.com/rustnfteth",
        },
        {
          name: "Rust's Tezos Editions",
          url: "https://objkt.com/profile/rust/created",
        },
        {
          name: "Rust's Everydays",
          url: "https://opensea.io/collection/foureightybyrust",
        },
      ],
    },
    {
      tokenId: 136,
      images: [
        "/artist-136/work-1.jpg",
        "/artist-136/work-2.jpg",
        "/artist-136/work-3.jpg",
      ],
      poster: "/artist-136/poster.png",
      posterMintUrl: "",
      name: "Postwook",
      info: `
Natasha Chomko, known in the digital art world as Postwook, is a Los Angeles-based artist born in 1995. 
Her primary focus lies in creating surreal landscape collage art, seamlessly blending refined visionary and psychedelic elements. 
This unique style is designed to appeal to a broad audience, from the seasoned psychonaut to the average art enthusiast and everyone in between.
        
Chomko's artistic journey is deeply rooted in her love for landscapes, celestial bodies like the sun and moon, nature, and various elements that evoke emotions. 
She uses art as a medium to process emotions, describing it as a therapeutic way to express and release her feelings. 
Her inspirations in the digital art space include artists like ACK (Alpha Centauri Kid), whose narrative-centric and tech-infused works resonate with her.
        
Beyond her individual creations, Chomko's perspective on the evolving digital art landscape is insightful. 
She sees technology as a propellant for art, envisioning a future where innovations in tech will lead to more dynamic and interactive art forms. 
She dreams of a world where the moving photographs from Harry Potter become a reality, social media platforms support interactive art, and gameplay offers seamless realism. 
Moreover, Chomko is actively involved in groundbreaking projects, such as her role as the Creative Director for "Forever in Space," a startup that aims to send photos and audio clips into space via a Space X satellite.

Memers get to step into the surreal with Postwook on Aug 25th, 2023!
`,
      links: [
        {
          name: "Postwook's Twitter",
          url: "https://twitter.com/postwook",
        },
        {
          name: "Postwook's Instagram",
          url: "https://instagram.com/postwook",
        },
        {
          name: "Postwook's Website",
          url: "https://postwook.com",
        },
      ],
    },
    {
      tokenId: 137,
      images: [
        "/artist-137/work-1.mp4",
        "/artist-137/work-2.mp4",
        "/artist-137/work-3.mp4",
      ],
      poster: "/artist-137/poster.mp4",
      posterMintUrl: "",
      name: "Jan Sladecko",
      info: `
Jan Sladecko, a creative director and motion designer from the Czech Republic, has carved a niche for himself in the world of digital art and animation. 
With a passion for CG that ignited at the young age of 12, Sladecko's journey in the industry has been marked by innovation, creativity, and a deep love for storytelling. 
His portfolio, rich with a blend of humor and intricate design elements, showcases his unique style that appeals to a broad spectrum of audiences. 
From his early days of Flash animations to mastering 3D art, Sladecko's evolution as an artist is a testament to his dedication and skill.

One of his notable works, "Space Struggle," is a testament to his ability to weave humor into compelling visual narratives. 
This short CGI animated series began as a playful take on Elon Musk's initiative of sending a car into space, evolving into a humorous tale of astronauts navigating the challenges of space. 
Beyond individual projects, Sladecko's experience spans collaborations with renowned studios, including The Mill.
 Here, he contributed to diverse projects, with "IMAX: Transformers" standing out as a personal favorite, showcasing his prowess in animation and design.
        
Throughout his career, Sladecko has consistently pushed the boundaries of motion design. 
His works, whether they are short animations or extensive projects, always carry a distinct narrative flair, often infused with humor and intricate design elements. 
As he looks to the future, Sladecko aims to pivot towards more personal projects, seeking deeper connections with his audience and exploring new avenues in digital art enabled by web3.

Card 137 will surely bring us Sladecko's signature memetic morphing memes on Aug 28th, 2023!
`,
      links: [
        {
          name: "Jan's Twitter",
          url: "https://twitter.com/jan_sladecko",
        },
        {
          name: "Jan's Instagram",
          url: "https://jansladecko.com/instagram",
        },
        {
          name: "Jan's Website",
          url: "jansladecko.com",
        },
      ],
    },
    {
      tokenId: 138,
      images: [
        "/artist-138/work-1.png",
        "/artist-138/work-2.gif",
        "/artist-138/work-3.png",
      ],
      poster: "/artist-138/poster.png",
      posterMintUrl: "",
      name: "Eleni Tomadaki",
      info: `
Eleni Tomadaki, a visionary artist bopping between London and Athens, has carved a niche for herself with her unique exploration of the intricate relationships between individuals and the multifaceted "Other." 
This exploration, deeply rooted in her artistic vision, delves into the complexities of identity, resistance, and the dichotomy of belonging. 
Through non-linear storytelling narratives and a distorted use of language, Eleni challenges conventional symbols and perceptions, offering a fresh perspective on the human experience.

Her standout project, "Eleni is bored again," is a testament to her innovative approach. 
Initiated in 2015 as an auto-fictitious blend of illustrations and texts, it evolved into a collection of 299 NFTs, raising existential and psychosocial questions about everyday life and self-reflection. 
This collection engages viewers in a process of unlearning, revisiting the world through a child's psyche, and confronting the often-neglected innocence of adulthood, which undergoes various transformations capturing the multifaceted nature of human emotions.
        
Eleni's mission transcends traditional artistic boundaries. 
Whether through her NFT collections, which challenge concepts of value and decision-making, or her physical artworks that question our relationship with the surrounding world, Eleni's art is a journey of engagement and reflection. 
Her work, showcased in prestigious venues from the Elizabeth Street Gallery in Soho, NY to Times Square, embodies a thought-provoking narrative that resonates with a global audience, making her a beacon in contemporary art.        

Illustrative memetic messages are sure to emerge in Card 138 explore, coming to us on Aug 30th, 2023!
`,
      links: [
        {
          name: "Eleni's Twitter",
          url: "https://twitter.com/Arty",
        },
        {
          name: "Eleni's Instagram",
          url: "https://www.instagram.com/eleni.tomadaki",
        },
        {
          name: "Eleni's Website",
          url: "https://isboredagain.com/",
        },
      ],
    },
    {
      tokenId: 139,
      images: [
        "/artist-139/work-1.mp4",
        "/artist-139/work-2.mp4",
        "/artist-139/work-3.mp4",
      ],
      poster: "/artist-139/poster.png",
      posterMintUrl: "",
      name: "@synccreation",
      info: `
@synccreation, a digital 3D artist, is celebrated for his unparalleled talent in crafting distinct videographic artworks from scratch. 
His meticulous attention to detail allows him to seamlessly blend various elements like modeling, animation, texturing, and sound design, resulting in visuals that are nothing short of mesmerizing. 
A hallmark of his work is the juxtaposition of intricate devices against a stark, empty backdrop, creating a captivating contrast. 
This combination of creativity and technical prowess culminates in a audiovisual symphony that ensnares both the heart and mind.

More than just digital renderings, @synccreation's pieces are virtual devices that challenge conventional perceptions and ignite curiosity. 
These elaborate designs epitomize his fervor for both art and technology, merging the domains of creativity and innovation to reveal unparalleled horizons. 
His works are not just displays of artistry but are also testaments to his commitment to excellence.
        
Understanding the importance of collaboration, @synccreation believes in forging strong partnerships with his clients. 
By grasping their vision, he ensures that every project mirrors their ideas, often exceeding their expectations. 
Whether one is a game developer, filmmaker, advertiser, or anyone seeking 3D expertise, @synccreation emerges as the go-to creative ally. 
With him, ideas are transformed into breathtaking 3D masterpieces, pushing the boundaries of what's imaginable.

Can you imagine what memetic devices Card 139 will explore on Sept 1st, 2023??
`,
      links: [
        {
          name: "@synccreation's Twitter",
          url: "https://twitter.com/synccreationn",
        },
        {
          name: "@synccreation's Instagram",
          url: "https://www.instagram.com/synccreation",
        },
        {
          name: "@synccreation's Website",
          url: "https://www.synccreation.me/",
        },
      ],
    },
    {
      tokenId: 140,
      images: [
        "/artist-140/work-1.png",
        "/artist-140/work-2.png",
        "/artist-140/work-3.png",
      ],
      poster: "/artist-140/poster.png",
      posterMintUrl: "",
      name: "Diogo Sampaio",
      info: `
Hailing from Porto, Portugal, Diogo Sampaio stands out as a distinguished matte painter and concept artist. 
His approach to art is refreshingly unique; rather than capturing mere moments like a photographic snap, Sampaio captures ideas. 
With the aid of his camera and a vivid imagination, he crafts surreal scenes that, while containing elements of the impossible, are rendered with such realism that they challenge the viewer's perception. 
His work is a testament to his problem-solving prowess, always seeking innovative ways to depict the unimaginable.

Throughout his career, Sampaio has collaborated with clients from all corners of the globe, working on both personal and commissioned projects. 
His expertise is not limited to just creating art; he also possesses a keen understanding of his clients' visions, ensuring that each project is a genuine reflection of their ideas. 
This collaborative spirit has led him to work with renowned entities, including Christiano Ronaldo, and the Colosseum of Rome.
        
Beyond his primary roles, Diogo Sampaio's skills span a wide range, from environment design and matte painting to photo-manipulation and surrealism. 
He is proficient in tools like Photoshop and Blender, further showcasing his versatility in the digital art realm. 
Whether it's designing posters for iconic bands like "The Rolling Stones" and "Imagine Dragons" or crafting cover artworks for magazines, Sampaio's artistry consistently shines through, making him a sought-after talent in the world of digital art.

It's a little surreal that we are already at Card 140... to be revealed on Sept 4th, 2023!
`,
      links: [
        {
          name: "Diogo's Twitter",
          url: "https://twitter.com/diogosampaioART",
        },
        {
          name: "Diogo's Instagram",
          url: "https://instagram.com/diogosampaio_art",
        },
        {
          name: "Diogo's Website",
          url: "https://diogosampaioart.com/",
        },
      ],
    },
    {
      tokenId: 141,
      images: [
        "/artist-141/work-1.mp4",
        "/artist-141/work-2.mp4",
        "/artist-141/work-3.mp4",
      ],
      poster: "/artist-141/poster.png",
      posterMintUrl: "",
      name: "Bastien",
      info: `
Bastien, known on Twitter as @Bastienjpg, is an artist who offers a distinctive perspective through the world of animation. 
With the mantra of "Offering you a chance to never stop being a kid," Bastien crafts animations that resonate with the inner child in all of us. 
His works are not just mere animations; they are a journey back to our fondest memories, a nostalgic trip that reminds us of the joys of childhood.

His artistic vision is clear: to create animations, often paired with stories, that evoke emotions and memories from our past. 
By doing so, he bridges the gap between the past and the present, allowing viewers to relive moments of pure joy and wonder. 
Bastien's stylistic approach is deeply rooted in this vision, as he often incorporates elements that are reminiscent of childhood games, toys, and adventures.
Each piece a scene, a snapshot, a single frame that you turn over in your mind, trying to recall the details even while the emotion of the moments hits hard.
        
His standout approach to animation and evocative imagery make him a standout artist in the digital realm.
        
#### Exploration of Insights:
        
1. Nostalgia in Art: Bastien's work is a testament to the power of nostalgia in art. How do memories from our past influence our appreciation of art in the present?
1. Art as a Portal: Each Bastien NFT acts as a portal, transporting viewers back to simpler times. In an age where technology and rapid change dominate, how crucial is it for art to serve as a respite, allowing individuals to escape, even momentarily, from the complexities of modern life?
1. The Inner Child: Bastien's focus on the "inner child" is a reminder that no matter our age, there's always a part of us that remains youthful and curious. How can art help us reconnect with this often forgotten part of ourselves?

Will Card 141 help us look ahead by looking to the past? Our inner child finds out on Sept 6th, 2023!
`,
      links: [
        {
          name: "Bastien's Twitter",
          url: "https://twitter.com/Bastienjpg",
        },
        {
          name: "Bastien's Instagram",
          url: "https://instagram.com/bastienjpg",
        },
        {
          name: "Bastien's Linktree",
          url: "https://linktr.ee/Arty",
        },
      ],
    },
    {
      tokenId: 142,
      images: [
        "/artist-142/work-1.png",
        "/artist-142/work-2.png",
        "/artist-142/work-3.jpeg",
      ],
      poster: "/artist-142/poster.png",
      posterMintUrl: "",
      name: "Leyla Emektar",
      info: `
Leyla Emektar, an esteemed photographer from Adana, Turkey, embarked on her artistic journey at Çukurova University's Art Department. 
She has since worn multiple hats, from a Visual Arts Teacher to a part-time instructor at Kocaeli University's Department of Photography. 
Emektar's works predominantly span travel, conceptual, fine art, and portrait genres, each piece echoing profound narratives and deeper meanings.

Her unique approach to "Creative Photography" pushes conventional boundaries, making her stand out in the global photography arena. 
For instance, her "White Infinity" collection captures the stark realities of villagers trapped by intense snowfall, while "Children and Dreams" poignantly portrays the innocence of childhood juxtaposed against the complexities of the adult world.
        
Emektar's photography is not just about capturing moments but delving deep into the stories behind those moments. 
Her ability to intertwine raw reality with artistic interpretation sets her apart from her contemporaries. 
The diverse accolades she has received, from the Stellar Art Awards to the Global Photography Competition grand prize in Japan, are a testament to her versatility and prowess in the field.

All that's captured in Card 142 will be revealed on Sept 24th, 2023!
`,
      links: [
        {
          name: "Leyla's Twitter",
          url: "https://twitter.com/leylaemektar2",
        },
        {
          name: "Leyla's Instagram",
          url: "https://www.instagram.com/leylaemektar",
        },
        {
          name: "Leyla's Linktree",
          url: "http://www.leylaemektar.com",
        },
      ],
    },
    {
      tokenId: 143,
      images: [
        "/artist-143/work-1.jpeg",
        "/artist-143/work-2.jpeg",
        "/artist-143/work-3.png",
      ],
      poster: "/artist-143/poster.mp4",
      posterMintUrl: "",
      name: "Hannes Hummel",
      info: `
Hannes Hummel is a distinguished artist and designer rooted in Germany. 
He delves deep into the nexus between contemporary technologies and time-honored design methodologies. 
Drawing profound inspiration from historical art movements, Hannes masterfully reinterprets them through the digital medium. 
His recent digital artworks illuminate the intricate nature of organic structures, emphasizing symmetry, tessellations, and the mesmerizing patterns within patterns. 
This approach showcases his unique talent for reinterpreting nature through a digital prism.

Hannes's creations have graced galleries across the globe, earning widespread critical acclaim for their groundbreaking approach and meticulous attention to detail. 
Beyond his investments in crafting digital masterpieces, he is also an educator, offering workshops and lectures on digital and VR-design concepts. 
His dedication to sharing his expertise has enriched the knowledge of countless students and fellow artists.

Venturing into the realms of NFTs and web3, Hannes has forged collaborations with an array of brands in the fashion and tech sectors. 
His creative capacity is evident in his partnerships with events such as New York Fashion Week and London Fashion Week.

Furthermore, Hannes co-founded BLOOM, an avant-garde, artist-centric design and art collective. 
BLOOM stands as a beacon of quality, integrity, and diversity, leading the charge in harnessing the vast potential of web3.

Look for organic meme integrations in the drop on Sept 11th, 2023!
`,
      links: [
        {
          name: "Hannes' Twitter",
          url: "https://twitter.com/hanneshummel",
        },
        {
          name: "Hannes' Instagram",
          url: "https://www.instagram.com/hummel.studio",
        },
        {
          name: "Hannes' Website",
          url: "https://www.hanneshummel.art/",
        },
      ],
    },
    {
      tokenId: 144,
      images: [
        "/artist-144/work-1.jpg",
        "/artist-144/work-2.mp4",
        "/artist-144/work-3.png",
      ],
      poster: "/artist-144/poster.png",
      posterMintUrl: "",
      name: "Filip Hodas",
      info: `
Filip Hodas is a pioneering figure in the realm of 3D art, known for his hyperreal and intricately detailed environments. 
A trailblazer in leveraging GPU render technology, Hodas has been instrumental in pushing the boundaries of 3D art, introducing a fresh aesthetic that is an inspiration to many. 
His signature style is evident in his "Pop Culture Dystopia" series, where he presents decaying icons from popular culture set against desolate, post-apocalyptic landscapes. 
These digital portraits, featuring characters like Mickey Mouse, Pac-Man, and Hello Kitty, are portrayed in states of severe neglect and corrosion, symbolizing the transient nature of pop culture and the inevitable passage of time.

Hodas says, "I believe nature will always find a way to survive, even if people think we can control it." 
This sentiment is reflected in his artworks, where nature often reclaims abandoned and decaying man-made structures. 
Hodas's journey into 3D art began with creating 2D graphics for DJs and music artists. 
However, feeling constrained, he ventured into more personal projects, exploring the vast potential of 3D art. 
His dedication to the craft is evident in his daily render project on Instagram, which lasted nearly 400 days and garnered significant attention, establishing him as one of the most followed 3D artists globally.
        
Hodas's work is not just visually captivating but also carries a deeper message. 
His pieces often exude a sense of melancholy, capturing the essence of abandonment and decay. 
This thematic style is a commentary on the fleeting nature of fame, consumerism, and cultural icons. 
As Hodas puts it, his artworks, especially those from the "Pop Culture Dystopia" series, resonate with viewers as they evoke memories of childhood and the nostalgia associated with bygone eras. 
The juxtaposition of vibrant characters in desolate settings serves as a poignant reminder of the impermanence of all things, making Hodas's art both visually stunning and deeply thought-provoking.

Memetic decay may well be coming to Card 144 on Sept 13th, 2023!
`,
      links: [
        {
          name: "Filip's Twitter",
          url: "https://twitter.com/FilipHodas",
        },
        {
          name: "Filip's Instagram",
          url: "https://www.instagram.com/hoodass",
        },
        {
          name: "Filip's NFTs",
          url: "https://superrare.com/hoodass",
        },
      ],
    },
    {
      tokenId: 145,
      images: [
        "/artist-145/work-1.png",
        "/artist-145/work-2.png",
        "/artist-145/work-3.png",
      ],
      poster: "/artist-145/poster.png",
      posterMintUrl: "",
      name: "Teexels",
      info: `
Much more than a mere manager of memetic mints, the 6529 community knows teexels as a skilled photographer and insightful artist in his own right.

Teexels.eth (aka @teexels) is a dedicated street and landscape photographer based in Greece, who has established himself as a visionary digital artist.
His photographs invites collectors into a world where the ethereal beauty of nature and the intricacies of human ingenuity converge. 
Through his most recent collection, he offers a bird's-eye view of the Grecian skies, captured with the fresh perspective of aerial photography. 
These images unveil a realm where ancient landscapes stretch out to meet endless horizons, crafting a vivid tapestry of natural wonders contrasted with humanity's "inevitable" impact. 
This thematic approach is exemplified in his works like "Rusted Remnants": a train yard threatened by an imposing storm, showcasing the coexistence of nature alongside industrial growth and decay.

Teexels's artistic vision is a testament to his profound appreciation for both the natural world and human progress. 
Whether it's the mesmerizing hues of a sunset, urban reflections, or an twisted web of roadways, his works serve as a reminder of the beauty that surrounds us, often in the most unexpected places. 
For collectors, each piece is not just an artwork but a journey—a journey that celebrates the beauty found in nature's grandeur and mankind's achievements.
        
Prepare to behold the memetic masterpiece of one of our own, on Sept 15th, 2023!
`,
      links: [
        {
          name: "Teexels' Twitter",
          url: "https://twitter.com/teexels",
        },
        {
          name: "Teexels' Instagram",
          url: "https://www.instagram.com/teexels/",
        },
        {
          name: "Teexels' Website",
          url: "https://dimitrisfatisis.com/",
        },
      ],
    },
    {
      tokenId: 146,
      images: [
        "/artist-146/work-1.gif",
        "/artist-146/work-2.png",
        "/artist-146/work-3.png",
      ],
      poster: "/artist-146/poster.png",
      posterMintUrl: "",
      name: "Vetigo",
      info: `
Dive into the enigmatic world of F. Borousan, more popularly known as Vertigo. 
From a young age, he was captivated by the fantastical realms of comics and science fiction. 
As he matured, his artistic inclinations evolved, drawing him towards the classical arts and, notably, surrealism. 
This passion for phantasmagorical contexts is not merely a fleeting interest; it's a profound influence that has shaped his artistic journey, fueled by surreal art, music, and films.

Vertigo is not just an artist's pseudonym; it's an alter ego, a distinct persona that contrasts starkly with Borousan's inherent nature. 
While Borousan might shy away from social interactions, Vertigo thrives in them, perhaps because he is a creation of imagination, unburdened by the constraints of reality. 
This duality is evident in his creations, each piece a reflection of life's observations, dreams, memories, and profound emotions. 
His art seeks to draw in viewers, aiming to evoke and expose emotions, existential thoughts, or even unmasked fears.
        
A recurring theme in his artwork is the exploration of truth and uncovered identity. 
Through description statements like "Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth," Vertigo delves into the complexities of human nature and the masks we wear. 
His art challenges perceptions, urging viewers to confront delusions and embrace the naked truths, no matter how unsettling.
        
In the age of digital art, Vertigo has embraced NFTs, not just as a medium but as a testament to his desire for immortality. 
Each piece he creates is a step towards that eternal legacy, with the hope that future generations will discover his works on the blockchain, recognizing the passion and soul of an artist who aspired to craft an entirely new world.
        
For collectors, Vertigo's art is not just a visual treat; it's an emotional and philosophical journey, a chance to engage with the profound musings of an artist who lived, loved, and breathed to experiment at the boundaries of reality itself.

The truth of Card 146 is revealed on Sept 18th, 2023!
`,
      links: [
        {
          name: "Vertigo's Twitter",
          url: "https://twitter.com/0x_vertigo",
        },
        {
          name: "Vertigo's Instagram",
          url: "https://www.instagram.com/0xvertigo",
        },
        {
          name: "Vertigo's Website",
          url: "https://0xvertigo.com",
        },
      ],
    },
    {
      tokenId: 147,
      images: [
        "/artist-147/work-1.png",
        "/artist-147/work-2.webp",
        "/artist-147/work-3.png",
      ],
      poster: "/artist-147/poster.png",
      posterMintUrl: "",
      name: "Rupture",
      info: `
Morris Vogel, known in the art world as Rupture, is a master of weaving intricate narratives that delve deep into the human experience and the complexities of our entangled intersubjective realities. 
His works consistently explore themes of struggle, loss, and the ethereal, juxtaposed against the overwhelming nature of contemporary media and the illusions it often presents. 
He touches upon the haunting realms of imagination and the challenges of discerning reality in a world saturated with distractions.

Vogel's artistry doesn't shy away from addressing the darker facets of society. 
He delves into the tactics of manipulation, control, and the pervasive nature of fear, as seen in "COME AND SEE." 
These themes resonate with his broader artistic vision, where he often portrays a world grappling with its own destructive tendencies and the dilemmas of the digital age. 
His pieces challenge viewers to confront their innermost fears, question societal norms, and seek truth amidst chaos.
        
In essence, Rupture's art is a reflection of contemporary challenges, offering a unique lens through which to view the world. 
His ability to encapsulate profound messages in his art makes him a beacon for collectors seeking depth, introspection, and a fresh perspective on the world around them.
        
In a new twist for Meme Card 147, Rupture will bring on-chain an acrylic-on-canvas piece he created earlier this year. Explore the artist's links to get a glimpse of it... and mint it in all it's digital glory on Sept 20th, 2023!
`,
      links: [
        {
          name: "Rupture's Twitter",
          url: "https://twitter.com/RuptureNFT",
        },
        {
          name: "Rupture's Instagram",
          url: "https://instagram.com/rupture.art",
        },
        {
          name: "Rupture's Website",
          url: "https://www.morrisvogel.com",
        },
      ],
    },
    {
      tokenId: 148,
      images: [
        "/artist-148/work-1.png",
        "/artist-148/work-2.png",
        "/artist-148/work-3.png",
        "/artist-148/work-4.png",
      ],
      poster: "/artist-148/poster.png",
      posterMintUrl: "",
      name: "Superelmer",
      info: `
Superelmer stands out as a contemporary cartoon artist who seamlessly blends humor, cultural pride, and modern themes into his creations. 
Hailing from a Filipino background, he playfully describes himself as "Half Filipino-Half Amazing," a testament to his pride in his heritage and his unique approach to art. 
His works, which he described as "somewhat meaningful sketches" ("Mga drawing na medyo may kwenta"), revolve around a myriad of themes, from video games and comics to potent memes and everyday insights. 
In a simple but impactful two-panel comic, he emphasizes the power of belief, suggesting that "To be successful, you only need one person to believe." 
This sentiment, combined with his light-hearted takes on everyday situations, showcases Superelmer's ability to resonate with a broad audience. 

Furthermore, his collaborations with brands like Huawei and Enervon, as well as his references to modern platforms like Netflix, highlight his knack for intertwining commercial appeal with personal artistic expression. 
In a digital age where content is abundant, Superelmer's memetic approach stands as a testament to the power of authenticity, humor, and cultural pride.

Surely meme maxis will get a memetic masterpiece in Cart 148 on Sept 22th, 2023!
`,
      links: [
        {
          name: "Superelmer's Twitter",
          url: "https://twitter.com/superelmerds",
        },
        {
          name: "Superelmer's Facebook",
          url: "https://www.facebook.com/SuperElmerDS",
        },
        {
          name: "Superelmer's GetCraft",
          url: "https://getcraft.com/superelmer",
        },
      ],
    },
    {
      tokenId: 149,
      images: [
        "/artist-149/work-1.png",
        "/artist-149/work-2.png",
        "/artist-149/work-3.png",
      ],
      poster: "/artist-149/poster.png",
      posterMintUrl: "",
      name: "Roger Skaer",
      info: `
Roger Skaer rapidly ascended to digital prominence with his insightful "Fuck Around and Find Out" meme on TikTok. 
This meme, which cleverly illustrated via whiteboard the relationship between taking risks and discovering outcomes, amassed millions of views in a short span, establishing Roger as an internet icon. 
His straightforward message struck a chord with many, bringing to light what we all already know: the significance of experience and exploration in understanding life's outcomes.

The evolution of Roger's meme into the world of web3 is particularly noteworthy. 
The decentralized nature of web3 offers a unique platform not just for artists, but many types of digital content creators, ensuring authenticity, provenance, and ownership of digital assets. 
Roger's meme, with its widespread recognition, is a perfect fit in this space. 
By tokenizing his meme as an NFT on platforms like Melon.ooo and The Memes by 6529, Roger ensures its digital uniqueness and traceable lineage, previous unattainable.
        
For collectors, owning a piece of Roger Skaer's meme isn't just about having a digital asset; it's about being part of a cultural phenomenon that has bridged the gap between traditional internet culture and the burgeoning world of decentralized digital assets. 
Roger's meme, now immortalized as an NFT, offers collectors a blend of wit, wisdom, and a tangible link to a pivotal moment in internet history.

The Memes gets ever more memetic on Sept 25th, 2023!
`,
      links: [
        {
          name: "Roger's Twitter",
          url: "https://twitter.com/rogerskaer",
        },
        {
          name: "Roger's Instagram",
          url: "https://www.instagram.com/rogerskaer",
        },
        {
          name: "Roger's TikTok",
          url: "https://www.tiktok.com/@rogerskaer",
        },
      ],
    },
    {
      tokenId: 150,
      images: [
        "/artist-150/work-1.gif",
        "/artist-150/work-2.jpeg",
        "/artist-150/work-3.png",
      ],
      poster: "/artist-150/poster.png",
      posterMintUrl: "",
      name: "Efdot",
      info: `
Eric Friedensohn, better known in the art world as Efdot, encapsulates the spirit and energy of street culture in his digital masterpieces. 
Growing up with a skateboard under his feet, he spent countless hours exploring the architectural marvels of Manhattan and admiring the vibrant street art along the Hudson River. 
He saw the city as a "visual, literal playground," where the edgy energy and art of the streets became an integral part of his creative DNA.

"Like skateboarding, art is about pure expression," Efdot writes on his webpage, drawing parallels between the exhilaration of landing a new skate trick and the thrill of unveiling a fresh piece of artwork. 
Each digital creation he crafts is a continuation of that very quest for discovery and elation that began on the streets of New York. 
His artistic approach, marked by a unique blend of abstract and figurative styles, mirrors the unpredictable, limitless nature of skateboarding, where there are "no rules, no limitations."
        
Today, Efdot's art serves as a visual escape "for optimists", providing a bridge between the tactile grit of street culture and the expansive potential of the digital realm.
All the more remarkable, Efdot's colorblindness has proven no obstacle to his artistic vision coming to life on canvas, or in a mural, or as a digital asset.
Drawing upon his experiences of urban exploration, community outreach, and self-discovery, Efdot offers the NFT community (and more than a few big brands) a unique blend of authenticity and innovation, inviting everyone to embark on their own journey of exploration and understanding through his art.

So Card 150 will surely bring some NYC energy with a positive outlook on Sept 27th, 2023!
`,
      links: [
        {
          name: "Efdot's Twitter",
          url: "https://twitter.com/Efdot",
        },
        {
          name: "Efdot's Instagram",
          url: "https://www.instagram.com/Efdot/",
        },
        {
          name: "Efdot's Website",
          url: "https://efdot.art/",
        },
      ],
    },
    {
      tokenId: 151,
      images: [
        "/artist-151/work-1.gif",
        "/artist-151/work-2.webp",
        "/artist-151/work-3.gif",
      ],
      poster: "/artist-151/poster.png",
      posterMintUrl: "",
      name: "Killer Acid",
      info: `
Rob Corradetti, more commonly known by his artistic alias Killer Acid, is celebrated for his ability to intertwine whimsical, psychedelic, and surreal elements in his artwork. 
His creations, deeply embedded in personal experiences and psychological themes, are also enriched by the adept incorporation of familiar memetic themes and cultural references. 
Each artwork is not just a visual expression but a story, echoing the influences of lowbrow and psychedelic art movements. 
In an interview with Hop Culture, Corradetti described his art as a journey marked by humor and discovery, where contemporary memes and cultural nuances are captured with his distinctive style.

The evolution of Killer Acid's artistry is closely tied to Corradetti's geographical and personal transitions. 
His journey from Delaware to the bustling art scene of New York City, and eventually the serene landscapes of the West Coast, have contributed to the multifaceted nature of his creations. 
The art is a harmonious blend of loud, irreverent elements and introspective touches, offering viewers an engaging visual and emotional experience. 
The infusion of culturally memetic idea, captured with his own distinctive flair, adds a layer of relatability and contemporary relevance to his works.
        
In the realm of NFTs, Killer Acid has established himself as a force to be reckoned with, being one of the top 30 bestselling artists on SuperRare. 
"Bong Love," his debut NFT, encapsulates his signature blend of bright, stormy colors, cartoonish psychedelia, and cultural motifs. 
Each digital piece is a visual journey, where contemporary cultural elements are seamlessly integrated with personal and psychological themes. 
Killer Acid's digital art portfolio stands as a testament to his ability to create art that is not only visually captivating but also rich in thematic content, bridging the personal, the psychedelic, and the cultural with finesse.

And now, as season 4 of The Memes concludes with Card 151, we get to take a trip with Killer Acid on Sept 29th, 2023!
`,
      links: [
        {
          name: "Killer Acid's Twitter",
          url: "https://twitter.com/killeracid",
        },
        {
          name: "Killer Acid's Instagram",
          url: "https://www.instagram.com/killeracid",
        },
        {
          name: "Killer Acid's Website",
          url: "https://killeracid.com",
        },
      ],
    },
    {
      tokenId: 152,
      images: [
        "/artist-152/work-1.webp",
        "/artist-152/work-2.png",
        "/artist-152/work-3.mp4",
      ],
      poster: "/artist-152/poster.mp4",
      posterMintUrl: "",
      name: "Miss AL Simpson",
      info: `
Miss AL Simpson, an award-winning cryptoartist based in Edinburgh, has carved a distinctive niche in the highest tiers of NFT art. 
Renowned for her innovative ⚙️style, Simpson seamlessly merges the raw abstraction of traditional oil painting with the precision of AI-generated imagery, creating works that delve deep into themes of memory, time, and perception. 
Her highly-stylized approach, often described as a blend of digital graffiti reminiscent of legendary artists Basquiat, Rauschenberg, and Kippenberger, often integrates animated 3D collage or historical motifs, establishing a signature vibe that has been celebrated in esteemed publications and showcased in major global art centers, from London to Tokyo.

Miss AL Simpson's artistic prowess goes beyond just blending mediums; she deftly tackles the intricate portrayal of women in art. 
Drawing from her personal experiences and insights, her works often depict the depth, complexity, and multifaceted nature of women, eschewing traditional tropes and objectification. 
Her artistic techniques of layered collage, animated blends, and overpaintign provide both a tangible presence to intangible memories and an introspective exploration of womanhood within the fluid tapestry of time. 
As she challenges conventional narratives and showcases women through a fresh, empathetic lens, Simpson reminds us of art's profound capability to enrich our perception, urging us to see the world with depth, nuance, and a humanistic understanding.

From her early days as a struggling artist in Edinburgh to her ascent as a top-ranked figure on platforms like Super Rare Art, Simpson's journey exemplifies resilience and innovation. 
Her background, which spans a transition from corporate law to art, coupled with the challenges of motherhood, has deeply informed her work. 
Today, as both a pioneer and an advocate for the democratization of art, Miss AL Simpson stands as a testament to the transformative potential of creativity in the NFT space, inviting collectors to reevaluate traditional paradigms and embrace the boundless horizons of crypto art.

Look for a great depth of insight in Card 152, revealing on Oct 16th, 2023!
`,
      links: [
        {
          name: "Miss AL's Twitter",
          url: "https://twitter.com/missalsimpson",
        },
        {
          name: "Miss AL's Instagram",
          url: "https://www.instagram.com/annalouisesimpson",
        },
        {
          name: "Miss AL's Website",
          url: "https://www.missalsimpsonartist.com/",
        },
      ],
    },
    {
      tokenId: 153,
      images: [
        "/artist-153/work-1.png",
        "/artist-153/work-2.gif",
        "/artist-153/work-3.png",
      ],
      poster: "/artist-153/poster.png",
      posterMintUrl: "",
      name: "PhotonTide",
      info: `
Photon Tide, known by the pseudonym Pho, is a mixed-media artist and musician whose work encompasses a broad spectrum of creative ventures, including graphic and motion design, writing, music, and directing. 
His digital art is recognized for its psychedelic, immersive, and experimental style, which draws connoisseurs into a realm of trance and self-exploration. 

The thematic core of Photon Tide's work revolves around self-exploration, the chaotic nature of existence, and the relentless pursuit of authentic self-expression. 
Through pieces like "seconds after death, I left my body" and "the illusion of control," Pho delves into introspective and existential themes. 
His work on "chaos theory" reflects an interest in the aesthetics of chaos and the beauty that can emerge from disorder, a theme that resonates through other pieces which explore the impact of seemingly insignificant choices on the larger tapestry of life.
        
Photon Tide's artistic journey reflects a continuous endeavor towards self-actualization, as seen in "time to be who you were meant to be." 
This piece, born at a pivotal moment in his life, symbolizes the triumph of self-expression over conformity, encouraging individuals to embrace their true selves. 
His work not only serves as a mirror to his own life experiences but also as a beacon encouraging others on their path of self-discovery. 
Through his visionary digital creations, Photon Tide provides a vivid exploration of life's intricacies, making his work a rich domain for those seeking a deeper understanding of self and the chaotic yet beautiful nature of existence.

What will we discover about ourselves in Card 153 by Pho? Embrace the chaos on Oct 18th, 2023!
`,
      links: [
        {
          name: "PhotonTide's Twitter",
          url: "https://twitter.com/photonisdead",
        },
        {
          name: "PhotonTide's Instagram",
          url: "https://www.instagram.com/photontide",
        },
        {
          name: "PhotonTide's Website",
          url: "https://www.photonisdead.com/",
        },
      ],
    },
    {
      tokenId: 154,
      images: [
        "/artist-154/work-1.png",
        "/artist-154/work-2.mp4",
        "/artist-154/work-3.jpeg",
      ],
      poster: "/artist-154/poster.png",
      posterMintUrl: "",
      name: "PRGuitarman",
      info: `
What memetic narrative will Card 154 explore? We will see what is mintable on Oct 20th, 2023!
`,
      links: [
        {
          name: "PRGuitarman's Twitter",
          url: "https://twitter.com/prguitarman",
        },
        {
          name: "PRGuitarman's Genesis on Foundation",
          url: "https://foundation.app/@NyanCat",
        },
        {
          name: "PRGuitarman's Website",
          url: "https://www.nyan.cat",
        },
      ],
    },
    {
      tokenId: 155,
      images: [
        "/artist-155/work-1.webp",
        "/artist-155/work-2.png",
        "/artist-155/work-3.png",
      ],
      poster: "/artist-155/poster.png",
      posterMintUrl: "",
      name: "RedruM",
      info: `
Redrum, a name that resonates with danger and mystery, has firmly established themselves as a prolific figure in the realm of NFT artistry. 
With a distinct and powerful visual style, their work delves deep into thematic explorations of contrast — between the organic and the artificial, the known and the unknown, and the serene versus the formidable. 
Each piece serves as a tableau of vibrant reds, a color choice that not only anchors their signature style but also evokes a myriad of emotions, from passionate fervor to latent danger.

In Redrum's universe, viewers are often invited into seemingly surreal landscapes where the familiar and the alien coexist in a tenuous balance. 
Animals, whether they are of this world or reminiscent of otherworldly beings, often interact with enigmatic humanoid figures, prompting introspection about human nature, our relationship with the world, and the masks we don to navigate it. 
This intertwining of creatures and man-made elements, set against stark backdrops, constructs a narrative that is both dreamlike and disconcertingly realistic.
        
Yet, for all its vivid imagery, Redrum's artistry is not merely about the visual spectacle. 
The layers of symbolism in each piece beckon viewers to probe deeper, to question and to reflect. 
The recurring themes of anonymity, the juxtaposition of nature versus civilization, and the underlying currents of emotion make Redrum's works a compelling journey into the psyche of modern existence. 
Through their unique lens, we are challenged to confront our perceptions, our fears, and our hopes in this ever-evolving digital age.

How will Card 155 bring the redness? We will see on Oct 23rd, 2023!
`,
      links: [
        {
          name: "Redrum's Twitter",
          url: "https://twitter.com/redrumxart",
        },
        {
          name: "Redrum's Linktree",
          url: "https://linktr.ee/redrumxnft",
        },
        {
          name: "Redrum's Website",
          url: "https://linktr.ee/redrumxnft",
        },
      ],
    },
    {
      tokenId: 156,
      images: [
        "/artist-156/work-1.gif",
        "/artist-156/work-2.png",
        "/artist-156/work-3.mp4",
      ],
      poster: "/artist-156/poster.png",
      posterMintUrl: "",
      name: "BÈFÈ The Mad",
      info: `
BÈFÈ The Mad presents as a contemporary artist whose works delve deep into the human psyche, revealing a multifaceted exploration of emotion, form, and the juxtaposition of the ordinary with the surreal. 
One cannot help but be drawn into the haunting visuals of "Insomnious Thoughts," where the canvas comes alive with the melancholy of the enigmatic face, each line and shadow revealing an underlying tension and vulnerability. 
This powerful portrayal of internal struggle, set against an atmospheric backdrop, showcases BÈFÈ's ability to tap into shared human experiences, making them both intimate and universal.

In the vastness of space depicted in another piece, BÈFÈ raises many questions by presenting a figure seemingly adrift. 
The silhouette, floating upside down amid a star-studded expanse, encapsulates a sense of weightlessness and solitude. 
This contrast between the human form and the boundless universe prompts viewers to reflect on humanity's place in the cosmos, and perhaps, the existential questions that accompany such contemplation. 
Through this artwork, BÈFÈ crafts a narrative of dislocation and wonder, pushing boundaries and beckoning audiences to venture into the unknown.
        
Further delving into the realms of the surreal, BÈFÈ presents yet another captivating piece: a man in a crisp suit, poised on a chair, seemingly suspended in a void of stark whiteness. 
The dynamic tension within the pose, combined with the isolation of the setting, paints a scene that is both playful and introspective. 
The heavy boot-like shoes, the starkness of the suit, and the minimalist chair all intertwine, creating a delicate dance between reality and fantasy. 
Through such evocative visuals, BÈFÈ The Mad consistently invites viewers to embark on a journey where the boundaries of perception are blurred, and the realms of imagination are boundless.

What memetic madness will Card 156 present? We will see on Oct 25th, 2023!
`,
      links: [
        {
          name: "BÈFÈ's Twitter",
          url: "https://twitter.com/befethemad",
        },
        {
          name: "BÈFÈ's Linktree",
          url: "https://linktr.ee/befeart/",
        },
        {
          name: "BÈFÈ's Website",
          url: "https://linktr.ee/befeart",
        },
      ],
    },
    {
      tokenId: 159,
      images: [
        "/artist-159/work-1.gif",
        "/artist-159/work-2.webp",
        "/artist-159/work-3.webp",
      ],
      poster: "/artist-159/poster.mp4",
      posterMintUrl: "",
      name: "Des Lucréce",
      info: `
Delve into the monster-filled realm of Des Lucréce, an artist whose creations uniquely juxtapose the anguish of "No Home Center" with the vibrancy of contemporary digital artistry. 
Drawing inspiration from legends like Basquiat, Keith Haring, and the personal nuances of his own multicultural experiences, Lucréce crafts a world where monsters signify the complexities of identity and intertwined lines echo the interconnectedness of our globalized era. 
Each piece, distictive in its bold use of color and glitch-monsters, not only challenges the viewer's perception of belonging and desire but also beckons them to reflect on the themes of diaspora, xenophobia, and the eternal human quest for self-understanding. 
Welcome to the captivating odyssey that is Des Lucréce's artistic vision!

What kind of Halloween treats will Card 159 be? Come and knock on the door on Oct 30th, 2023!
`,
      links: [
        {
          name: "Des Lucréce's Twitter",
          url: "https://twitter.com/deslucrece",
        },
        {
          name: "Des Lucréce's SR",
          url: "https://superrare.com/deslucrece",
        },
        {
          name: "Des Lucréce's Website",
          url: "https://deslucrece.super.site/",
        },
      ],
    },
    {
      tokenId: 160,
      images: [
        "/artist-160/work-1.jpeg",
        "/artist-160/work-2.jpeg",
        "/artist-160/work-3.jpeg",
      ],
      poster: "/artist-160/poster.png",
      posterMintUrl: "",
      name: "fesq",
      info: `
Felipe Queiroz, known in the art world as Fesq, is a self-taught Brazilian Art Director and 3D Artist based in Rio de Janeiro. 
His digital mastery is a blend of self-exploration and the cosmic realm, providing powerful, visually engaging artwork. 
Fesq is recognized for his use of a simplistic three-color palette to render futuristic stills and animations that immerse viewers in a matrix-like scenario. 
His artistry delves into a range of themes from the critical, such as technological disruption in dystopian settings, to the sentimental, exploring the intimacy of human emotions. 
Encouraged by the renowned digital artist Beeple, Fesq's commitment to daily 3D art creation has honed his skills and developed his unique style.

Analyzing Fesq's work unveils a profound exploration of existential and introspective themes. 
In one image, the juxtaposition of cosmic purples and fiery reds against a towering spiraled red pillar divides the composition, hinting at the complexity and depth of human isolation within a broader cosmic narrative. 
Another piece, dominated by a colossal, skull-like rendering, faces down themes of life, death, and interconnectedness, symbolizing mortality and collective memory against a ethereal backdrop. 
The imagery Fesq employs, filled with silhouetted figures and cosmic elements, invites a contemplation on themes of existence, consciousness, and the universe.
        
Fesq's artwork is not only a visual feast but also an invitation for deeper exploration of meaning. 
His use of color contrasts, compelling shapes, and silhouetted figures are signature elements that draw viewers into a narrative far beyond the surface. 
With exhibitions like "Journey to Self" showcased at significant venues like Beeple's studio grand opening, Fesq is progressively making a notable imprint in the digital art and NFT space. 

Collectors new to his work will find a harmonious blend of the cosmic, the cerebral, and the introspective, intertwined with visually stunning elements that stimulate both aesthetic appreciation and philosophical pondering.

We can likely count on Card 160 showing up in purples, reds, and blues... But meme theme? We find out on Nov 1st, 2023!
`,
      links: [
        {
          name: "fesq's Twitter",
          url: "https://twitter.com/iamfesq",
        },
        {
          name: "fesq's Instagram",
          url: "https://www.instagram.com/iamfesq",
        },
        {
          name: "fesq's Website",
          url: "https://www.iamfesq.com/",
        },
      ],
    },
    {
      tokenId: 161,
      images: [
        "/artist-161/work-1.gif",
        "/artist-161/work-2.gif",
        "/artist-161/work-3.gif",
      ],
      poster: "/artist-161/poster.png",
      posterMintUrl: "",
      name: "Noealz",
      info: `
Noe Alonzo, known in the digital realm as @Noealz, is a captivating NFT artist whose still and animated photographic works resonate with depth and a sense of exploration. 
His style, heavily influenced by rainy cyberpunk and infrared photography, channels a vivid blend of colors, palettes embracing the overstimulating neon worlds of urban Asia. 
Growing up in a small city in South Texas, his journey from early financial struggles to self-taught photography in Korea, reveals a narrative of resilience and self-discovery, which distinctly colors his artistic vision.

In "Joy of Missing Out", @Noealz explores the essence of real-world experiences amidst the transient pursuits of material wealth during our "deflationary" lifetimes. 
Meanwhile, "The Light" reflects his altruistic spirit, dedicating the piece to frontline workers during the 2020 Coronavirus epidemic, thus symbolizing hope amidst adversity. 
His storytelling transcends mere visual allure, embedding a message reflected in rainy streets from so many pieces that nudges the audience towards a deeper societal or personal introspection.
        
His venture into the NFT space is also a testament to his evolving artistic narrative. 
In "Yeong-Kwang Chemical", @Noealz portrays his continual quest for technical growth and the influence of cyberpunk and neon-noir aesthetics on his work. 
His inspirations drawn from iconic dystopian narratives like Bladerunner and Ghost in the Shell, are vividly encapsulated in his pieces, melding the gritty reality of a futuristic corporate-dominated world with the profound yet subtle societal messages he wishes to convey. 
Through his NFTs, @Noealz invites collectors into a contemplative journey, mirroring both the aesthetic allure and the evocative messages that define his digital artistry.
        
What memetic narrative will Card 161 reflect? We get to behold it on Nov 3rd, 2023!
`,
      links: [
        {
          name: "Noealz's Twitter",
          url: "https://twitter.com/Noealz",
        },
        {
          name: "Noealz's OnCyber Gallery",
          url: "https://oncyber.io/studio?inviteId=NuHdob0tEbiQit7gSwHD",
        },
        {
          name: "Noealz's Website",
          url: "https://noealz.com/",
        },
      ],
    },
    {
      tokenId: 162,
      images: [
        "/artist-162/work-1.png",
        "/artist-162/work-2.mp4",
        "/artist-162/work-3.jpeg",
      ],
      poster: "/artist-162/poster.png",
      posterMintUrl: "",
      name: "Eszter Lakatos",
      info: `
What memetic styles will Card 162 explore? We will see what is revealed on Nov 6th, 2023!
`,
      links: [
        {
          name: "Eszter's Twitter",
          url: "https://twitter.com/8r122",
        },
        {
          name: "Eszter's Instagram",
          url: "https://www.instagram.com/Arty/",
        },
        {
          name: "Eszter's Website",
          url: "https://Arty.com",
        },
      ],
    },
    {
      tokenId: 163,
      images: [
        "/artist-163/work-1.png",
        "/artist-163/work-2.mp4",
        "/artist-163/work-3.jpeg",
      ],
      poster: "/artist-163/poster.png",
      posterMintUrl: "",
      name: "Camila Nogueira",
      info: `
What memetic themes will Card 163 explore? We will see what is revealed on Nov 8th, 2023!
`,
      links: [
        {
          name: "Camila's Twitter",
          url: "https://twitter.com/camila_artwork",
        },
        {
          name: "Camila's Instagram",
          url: "https://www.instagram.com/Arty/",
        },
        {
          name: "Camila's Website",
          url: "https://Arty.com",
        },
      ],
    },
    {
      tokenId: 164,
      images: [
        "/artist-164/work-1.png",
        "/artist-164/work-2.mp4",
        "/artist-164/work-3.jpeg",
      ],
      poster: "/artist-164/poster.png",
      posterMintUrl: "",
      name: "Jonathan Nash",
      info: `
What memetic narrative will Card 164 explore? We will see what is revealed on Nov 10th, 2023!
`,
      links: [
        {
          name: "Jonathan's Twitter",
          url: "https://twitter.com/offshoot3D",
        },
        {
          name: "Jonathan's Instagram",
          url: "https://www.instagram.com/Arty/",
        },
        {
          name: "Jonathan's Website",
          url: "https://Arty.com",
        },
      ],
    },
    {
      tokenId: 165,
      images: [
        "/artist-179/work-1.jpeg",
        "/artist-179/work-2.jpeg",
        "/artist-179/work-3.mp4",
      ],
      poster: "/artist-165/poster.png",
      posterMintUrl: "",
      name: "Giulio Aprin",
      info: `
Tell me about the NFT artist Giulio Aprin, with an emphasis on their style, artistic message, and vision.

What memetic narrative will Card 165 explore? We will see what is exposed on Oct 14th, 2023!
`,
      links: [
        {
          name: "Giulio's Twitter",
          url: "https://twitter.com/guiloaprin",
        },
        {
          name: "Giulio's Instagram",
          url: "https://instagram.com/giulioaprin",
        },
        {
          name: "Giulio's Website",
          url: "https://giulioaprin.xyz",
        },
      ],
    },
    {
      tokenId: 166,
      images: [
        "/artist-166/work-1.png",
        "/artist-166/work-2.png",
        "/artist-166/work-3.png",
      ],
      poster: "/artist-166/poster.png",
      posterMintUrl: "",
      name: "Sasha Katz",
      info: `
Sasha Katz, an Athens-based digital artist, emerges as a distinctive voice in the digital art scene, best known for her evocative 3D renderings that blend the boundaries between the bodies and dreams. 
Her artistic narrative is deeply rooted in the exploration of female identity, characterized by a poignant blend of intimate tenderness and physical fragility. 
Katz's creations often reflect her personal experiences and views on beauty standards, challenging societal norms and embracing a spectrum of unconventional beauty through her digital characters. 
Her work, while resonating with a deeply human texture, maintains a deliberate distance from reality, inviting a dialogue about the fluidity of identity in the modern age.

Katz's stylistic choices are heavily influenced by her background in illustration and her fascination with the 3D digital space. 
Her transition from pixel art to intricate 3D models showcases a journey through various forms of digital expression. 
Utilizing platforms like Tumblr, Katz has honed a distinctive style that incorporates elements of kitsch, camp, and art deco, alongside a profound appreciation for impressionism and new aesthetics. 

For new collectors, Katz's work represents not only a visual investment but also an emotional and intellectual one. 
Her artworks serve as a conduit for contemporary themes such as sensuality, empowerment, and the deconstruction of sexual standards, all while employing a blend of old-school digital techniques and modern 3D modeling. 
Collecting a piece by Sasha Katz means participating in a broader conversation about the digital representation of femininity and the role of art in the ongoing discourse around personal and societal identity. 
Her works are a celebration of a queer narrative and also a collective experience, crafted within the infinite NFT landscape.
        
Card 166 will surely take us to new perspectives, when all is exposed on Nov 15th, 2023!
`,
      links: [
        {
          name: "Sasha's Twitter",
          url: "https://twitter.com/wonderkatzi",
        },
        {
          name: "Sasha's Instagram",
          url: "https://www.instagram.com/wonderkatzi",
        },
        {
          name: "Sasha's Website",
          url: "https://sashakatz.com/",
        },
      ],
    },
    {
      tokenId: 167,
      images: [
        "/artist-167/work-1.jpeg",
        "/artist-167/work-2.jpeg",
        "/artist-167/work-3.gif",
      ],
      poster: "/artist-167/poster.png",
      posterMintUrl: "",
      name: "@toadswiback",
      info: `
Collectors new to the work of Mark Wilson, Indiana-based artist and writer known as diewiththemostlikes, may not be prepared for the unsettling journey into the heart of contemporary satire and social commentary. 
Wilson's style is immediately recognizable for its raw and unapologetic portrayal of American consumer culture, often served with a side of dark humor and grotesque exaggeration. 
His digital paintings bustle with caricatured figures and absurd juxtapositions (vibes of corporate logos cross-shredded with a meat zine) that highlight the excesses and oddities of modern life. 
These jpegs but memetic narratives that compel viewers to confront uncomfortable truths about the world around them, all while navigating through a tangle of surprising details and twisted forms that are as thought-provoking as they are visually arresting.

The thematic messages in Wilson's art are deeply rooted in the mundane yet bizarre realities of today's daily existence. 
He delves into themes of consumption, digital obsession, and the commodification of the human experience, portraying a society eager to devour and be devoured by the ever-churning machinery of capitalism and media. 
The figures in his work, often distorted reflections of the human form, are enveloped in scenes of both the familiar and the surreal, suggesting a blurring line between harsh realities and the life ads tell us to lead. 
His art acts as a macroscope, to reveal the world as it is perceived through the haze of digital screens and the relentless pursuit of our salvation: more likes.
        
What makes Wilson's style truly distinctive is his ability to wield irony and satire not merely as artistic tools but as a language through which he communicates with his audience. 
His art (and long-form writing) is an unflinching exploration on the state of the human condition, delivered with a wit and candor that is as engaging as it is confronting. 
Don't miss his take on rememes of class 6529 cards! 
Each of his creations is an invitation to explore not just an image but a story—a story that questions, critiques, and often mocks the very essence of what it means to exist in a world oversaturated with information yet starving for meaning. 
For collectors, Wilson's work is more than an aesthetic choice; it's a statement, a rebel's megaphone, and a stair-step on the artist's relentless quest to document the madness of the times we live in.
        
Prepare yourself for the madness of Card 167, hitting you in the eyeballs on Nov 17th, 2023!
`,
      links: [
        {
          name: "DWTML's Twitter",
          url: "https://twitter.com/toadswiback",
        },
        {
          name: "DWTML's Instagram",
          url: "https://instagram.com/diewiththemostlikes/",
        },
        {
          name: "DWTML's Website",
          url: "https://onetie-alltie.com",
        },
      ],
    },
    {
      tokenId: 168,
      images: [
        "/artist-168/work-1.jpg",
        "/artist-168/work-2.gif",
        "/artist-168/work-3.jpg",
      ],
      poster: "/artist-168/poster.png",
      posterMintUrl: "",
      name: "Li Boar",
      info: `
Embarking on a journey through the digital landscapes crafted by @liboar is an invitation into a world where the boundaries of time, culture, and reality blur into a vivid tapestry of color and imagination. 
Known for a distinctive style that marries chromatic depth with a reverence for artistic heritage, Li's creations are in tension between historic artistic movements and the limitless possibilities of digital expression and gamelike worlds. 
The works are intricate collages of references, blending elements of surrealism, impossible architecture, and narrative art into a unique digital vernacular.

Thematically, Li Boar (a Transylvanian), navigates the realms of myth, literature, and existential musing with a fearless and playful hand. 
The canvases become arenas where historical motifs, literary references, and personal tributes coalesce into intricate stories. 
Whether it's reimagining the works of Giger or paying homage to weird fiction, Li's art is a portal to realms that are at once eerily familiar and startlingly novel. 
Collectors are not merely acquiring a piece of digital art; they are inheriting a segment of a broader narrative that the artist weaves across his oeuvre.
        
Li presents an opportunity to engage with art that is both a visual spectacle and a cerebral exploration. 
The style is immediately recognizable, characterized by its isometric perspectives, lush color palettes, and a harmony of forms that challenge conventional perception. 
The themes often tread the line between the macabre and the fantastical, the real and the surreal, inviting a contemplation that is as much about the internal world of the viewer as it is about the external vision of the artist. 

On Nov 20th, 2023 we get to see what imaginative worlds Li will bring to The Memes in Card 168!
`,
      links: [
        {
          name: "Li's Twitter",
          url: "https://twitter.com/liboar",
        },
        {
          name: "Li's Ninfa",
          url: "https://ninfa.io/@LiBoar/",
        },
        {
          name: "Li's Links",
          url: "https://lynkfire.com/liboar",
        },
      ],
    },
    {
      tokenId: 169,
      images: [
        "/artist-169/work-1.png",
        "/artist-169/work-2.png",
        "/artist-169/work-3.png",
        "/artist-169/work-4.png",
        "/artist-169/work-5.png",
      ],
      poster: "/artist-169/poster.png",
      posterMintUrl: "",
      name: "Dylan Wade",
      info: `
Dylan Wade is a digital artist whose creative spark is ignited by nostalgia and the emotional depth of personal memories. 
His artistic journey began with personal videos in his teens, capturing life's fleeting moments, a practice that has profoundly influenced his current digital artwork. 
With a background in video, his work is marked by a keen sense of lighting and perspective, aimed at creating immersive scenes that resonate with the viewers' own experiences.

Transitioning into digital art at 26, Wade embraced a minimalistic style after years of videography, meticulously learning the tools of Adobe Illustrator to bring his visions to life. 
His pieces often start with deeply personal inspirations, like the "Winter Wonderland," based on his childhood street. 
This personal touch brings a unique authenticity to his art, inviting collectors to connect with the universal emotions encapsulated in his work.

For new collectors, Dylan Wade's artwork serves as a profound exploration of nostalgia through digital mediums. 
Each piece is a careful composition of simplified forms and a deliberate simplified color palette. 
Wade's art, with its roots in personal history and everyday moments, transcends the ordinary, inviting viewers to find a piece of their own story within his suggestive landscapes. 
His work is not just a visual experience; it's a reflective journey that resonates with the collective memory and stirs a deep-seated recognition in us all.

Will Card 169 awaken nostalgia within you? We find out on Nov 22th, 2023!
        `,
      links: [
        {
          name: "Dylan's Twitter",
          url: "https://twitter.com/dylanwadefilm",
        },
        {
          name: "Dylan's Foundation",
          url: "https://foundation.app/collection/dylanwadevol2",
        },
        {
          name: "Dylan's Website",
          url: "https://dylanwade.xyz/",
        },
      ],
    },
    {
      tokenId: 170,
      images: [
        "/artist-170/work-1.mp4",
        "/artist-170/work-2.webp",
        "/artist-170/work-3.webp",
      ],
      poster: "/artist-170/poster.png",
      posterMintUrl: "",
      name: "bluugu",
      info: `
Welcome to the world of bluugu, a Korean-Australian artist whose work is a kaleidoscope of cultural narratives and personal inquiries. 
As you navigate through his realms, you'll encounter questions of identity in the NFT artwork like "Who Am I?" 
This piece, like many others by bluugu, is a deep reflection on the artist's bicultural roots, expressed through a striking juxtaposition of Australian symbolism and Korean traditional motifs. 
His art not only captures the eye with its vivid, intricate details but also captures the heart with its poignant, introspective themes.

Bluugu's stylistic approach is a harmonious blend of his diverse background in fine art, industrial design, and illustration. 
His daily "GM" series showcases a commitment to practice and exploration, revealing a spectrum of subjects from the serene to the surreal. 
Even the simple act of greeting the morning becomes a canvas for creativity. 
His use of bright colors, bold lines, and a distinctive integration of 3D design elements invites viewers into a space that is both futuristic and deeply rooted in personal narrative.
        
Entering Bluutopia, bluugu's PFP collection co-created with his brother Guma, you'll find a world that extends beyond art into a cultural phenomenon. 
It is a brand, a movement, and a community aiming to unite those with third-culture experiences. 
Every piece in this collection is a celebration of diversity and an invitation to dialogue, offering collectors not just a visual delight but also a seat at the table of cultural empowerment. 

As a new collector, you are welcomed into the vibrant tapestry that bluugu weaves, one that holds the potential to enlighten, connect, and expand the horizons of digital artistry.

How will Card 170 show us these bright new worlds? We will see on Nov 24th, 2023!
`,
      links: [
        {
          name: "bluugu's Twitter",
          url: "https://x.com/bluugu",
        },
        {
          name: "bluugu's Instagram",
          url: "https://www.instagram.com/bluugu",
        },
        {
          name: "bluugu's Website",
          url: "https://www.bluugu.com/",
        },
      ],
    },
    {
      tokenId: 171,
      images: [
        "/artist-171/work-1.png",
        "/artist-171/work-2.png",
        "/artist-171/work-3.gif",
      ],
      poster: "/artist-171/poster.mp4",
      posterMintUrl: "",
      name: "Dana Ulama",
      info: `
Welcome to the captivating digital realms of Dana Ulama, a visionary artist whose work is a deep dive into the symbiotic relationship between humanity and technology. 
Ulama's art is a unique blend of cyberpunk futurism and poignant urban narratives, where neon-lit cityscapes and introspective characters tell stories of isolation, contemplation, and the human condition. 
Her art invites visual explorations that challenge viewers to question the boundaries between the organic and the artificial. 
For the new collector, Ulama's portfolio offers a journey through vibrant and meticulously crafted digital cityscapes that speak to the soul of a society intertwined with technology.
        
Ulama's progression as an artist is evident in the evolution of her themes and the deepening complexity of her subjects. 
Beginning with psychedelic vector art inspired by the counterculture movements, she has journeyed through the realms of science fiction, settling into the gritty, neon-drenched corridors of cyberpunk. 
In her recent works, you can see a shift towards a more emotional narrative, moving away from stereotypical portrayals to characters and scenes that resonate with deeper emotional undercurrents. 
These are pieces that encapsulate the ethos of our times, addressing the omnipresent topics of the digital age such as internet culture, pervasive screens, and the quest for personal connection in an increasingly disconnected world.
        
Her commitment to pushing the boundaries of digital expression is evident in her dedication to expanding her skills in atmosphere and animation, bringing a cinematic quality to her NFTs. 
Her works are not only visually arresting but are also loaded with memetic significance, making them perfect for collectors who seek both aesthetic appeal and thematic depth. 
As she forges ahead with plans for unique 1/1 NFTs and artist collaborations, Ulama's art stands as a testament to the powerful voice of digital creativity in the modern art world.
        
On Nov 27th, 2023, we'll see what new urban themes come to The Memes in Card 171!
`,
      links: [
        {
          name: "Dana's Twitter",
          url: "https://twitter.com/DanaUlama",
        },
        {
          name: "Dana's Instagram",
          url: "https://www.instagram.com/dana_ulama_artworks",
        },
        {
          name: "Dana's Website",
          url: "https://dana-ulama.myportfolio.com/",
        },
      ],
    },
    {
      tokenId: 172,
      images: [
        "/artist-172/work-1.webp",
        "/artist-172/work-2.webp",
        "/artist-172/work-3.webp",
      ],
      poster: "",
      posterMintUrl: "",
      name: "@6529er and @6529",
      info: `
We know and love @6529er as the pseudonymous designer for Punk 6529. He's an artist whose digital creations encapsulate a profound narrative depth with a keen eye for thematic resonance. 
He consistently weaves a tapestry of contemporary issues through the utilization of historical and iconic imagery, striking a delicate balance between homage and commentary. 
By adopting motifs from such sources as protest art and classical references, @6529er in partnership with 6529 forms a bridge between the artistic eras, employing visual storytelling to spark discourse on power dynamics, societal cycles, and the complexities of web3.
        
In terms of style, @6529er adopts a bold approach reminiscent of graphic novels and propaganda posters, a choice that resonates with the immediacy of digital media consumption. 
The crisp lines, assertive forms, and strategic color schemes in his artwork are not just a nod to aesthetic preference but a method to captivate and convey potent messages in a single glance. 
This striking visual language is instrumental in amplifying the intended narratives, whether they address calls for societal change, reflections on historical repetition, or satirical observations of current social behaviors.
        
@6529er's thematic explorations are a reflection of the broader human condition, as seen through the prism of the digital era.
Their work is steeped in the discourse of power and human emotion, revealing the nuanced ways in which history informs the present.

On Nov 28th, 2023 some lucky memers get airdropped of the latest blending of irony with earnestness, the multifaceted dialogue, from our own chronicler and a critic of the digital age's unfolding narrative.`,
      links: [
        {
          name: "6529er's Twitter",
          url: "https://twitter.com/6529er",
        },
        {
          name: "6529's Twitter",
          url: "https://twitter.com/punk6529",
        },
        {
          name: "6529's Website",
          url: "https://seize.io",
        },
      ],
    },
    {
      tokenId: 173,
      images: [
        "/artist-173/work-1.jpeg",
        "/artist-173/work-2.jpeg",
        "/artist-173/work-3.jpeg",
      ],
      poster: "/artist-173/poster.png",
      posterMintUrl: "",
      name: "Arty",
      info: `
Ricardo Alves is a professional digital artist whose expertise lies in the intricate realm of character and facial modeling. 
His artistic style is characterized by a profound understanding of anatomy and texture, which allows him to breathe life into 3D characters with remarkable realism. 
Alves's technical skill is matched by a nuanced sensitivity to the emotive potential of facial expressions, enabling him to create digital beings that convey a wide spectrum of human emotions and conditions. 

In the digital arts landscape, Alves has distinguished himself with a style that harmonizes detail-oriented craftsmanship with thematic depth. 
His approach is not just about achieving a high degree of photorealism; it's also about crafting a narrative through visual cues embedded in his characters' features. 
Whether through the subtle crease of a smile or the complex interplay of muscles in a frown, Alves's creations speak to the viewer, often carrying a thematic message that transcends the medium itself. 
His characters are not mere digital constructs but are imbued with a sense of story and purpose, inviting the audience to engage with them beyond the surface level.
        
Looking past the pixels and polygons, Alves's artistic narrative is one of constant evolution, marked by an industry-acknowledged ability to lead and inspire teams. 
His professional trajectory through leading visual effects studios around the globe reflects a career that is both dynamic and influential. 
Alves's artistry is rooted in a passion for storytelling and a commitment to pushing the boundaries of what digital character modeling can achieve, both aesthetically and emotionally.

Will new stories be told with memetic characters in Card 173? We will find out on Nov 29th, 2023!
`,
      links: [
        {
          name: "Rico's Twitter",
          url: "https://x.com/incalstory",
        },
        {
          name: "Rico's Instagram",
          url: "https://instagram.com/ricardoalvesj",
        },
        {
          name: "Rico's Website",
          url: "https://ricardoalves.co.uk",
        },
      ],
    },
    {
      tokenId: 174,
      images: [
        "/artist-174/work-1.gif",
        "/artist-174/work-2.gif",
        "/artist-174/work-3.mp4",
      ],
      poster: "/artist-174/poster.png",
      posterMintUrl: "",
      name: "Dutchtide",
      info: `
Dutchtide emerges as a distinctive voice in the digital art landscape, crafting pieces that resonate with the quiet introspection of urban solitude and the complex interplay between man-made and natural environments. 
His works, especially evident in series like "Midnight Breeze," often feature architectural structures — from lone apartment blocks to neon-lit convenience stores — set against the backdrop of nature or the stark vastness of the night. 
The contrasting elements of his compositions are not just visual but thematic, delving into philosophical musings on capitalism, wealth, and the environment, all while engaging with the digital medium's inherent properties and possibilities.

Stylistically, Dutchtide's art is marked by a harmonious blend of Japanese and Dutch aesthetics, a synthesis inspired by his deep appreciation for the organizational frameworks of Japanese art and the compositional mastery characteristic of the Dutch Golden Age.
The pixel art technique he employs imbues his works with a nostalgic digital quality, reminiscent of early video game aesthetics, yet the themes he explores are contemporary — isolation in urbanity, the search for true luxury, and the meaning of home in the digital age. 
His choice of this medium is deliberate, aligning with the NFT space's spirit and its community of collectors seeking authenticity and connection.
        
For new collectors, Dutchtide offers more than digital ownership; his artworks are invitations to contemplative journeys through spaces that feel both alien and intimately familiar. 
You are invited into a narrative tableau, encouraging personal reflection on the spaces we inhabit and how they shape our experiences. 
As NFTs continue to blur the lines between art and audience, Dutchtide's creations stand out for their ability to evoke emotion and provoke thought, promising a rich and engaging experience for those who choose to immerse themselves in his digital realms.

We will see what Dutchtide wants to buidl in the memes with Card 174 on Dec 1st, 2023!
`,
      links: [
        {
          name: "Dutchtide's Twitter",
          url: "https://twitter.com/Dutchtide",
        },
        {
          name: "Dutchtide's Instagram",
          url: "https://instagram.com/dutchtide",
        },
        {
          name: "Dutchtide's Website",
          url: "https://www.midnightbreeze.io/",
        },
      ],
    },
    {
      tokenId: 175,
      images: [
        "/artist-175/work-1.gif",
        "/artist-175/work-2.gif",
        "/artist-175/work-3.gif",
        "/artist-175/work-4.gif",
        "/artist-175/work-5.gif",
      ],
      poster: "/artist-175/poster.png",
      posterMintUrl: "",
      name: "Bryan Brinkman",
      info: `
Bryan Brinkman's artistic journey encapsulates a dynamic fusion of traditional animation's charm with the avant-garde flair of digital art, readily embracing NFTs. 
His artistic themes often pivot around humor, a nuanced legacy from his tenure on shows like "Saturday Night Live" and "The Tonight Show." 
The transition from these platforms to the realm of NFTs has allowed Brinkman to deepen his narrative, leveraging animation's unique storytelling capabilities. 
His works in the NFT marketplace don't just aim to entertain but also to resonate on a personal level with the viewers, reflecting on the shared human experience through the lens of digital culture.
Brinkman's art becomes a vessel for exploring themes of connectivity, feelings of movement, and the evolving relationship between technology and artistry.

Stylistically, Brinkman is a digital pop artist who thrives in the realm of mixed media, seamlessly blending 2D and 3D elements to create vibrant, engaging pieces. 
His artistic style is characterized by a playful yet sophisticated use of color and form, which is vividly apparent in his animations. 
By intertwining various techniques and software, including Cinema 4D, After Effects, and Gravity Sketch, Brinkman crafts pieces that are not just visually striking but also imbued with movement and life. 
His approach is reminiscent of the simplicity and visual impact of pop art icons like Keith Haring, yet it also incorporates the complexity and depth afforded by digital tools. 
This blend of old and new, simplicity and complexity, allows his artwork to stand out in the crowded NFT space, attracting a diverse mix of high-profile collectors and admirers.
        
At the core of Brinkman's work lies a deep understanding of the NFT ecosystem, where he navigates the nuances of art creation, publication, and community engagement with a strategic division of his time and effort. 
He views his pieces not just as artworks but as nodes in a broader narrative of digital art's evolution, underscoring the importance of each piece's role in the ongoing discourse of the crypto world. 
His thematic explorations often address the concept of permanence and legacy within the digital age, as he considers how his pieces will exist indefinitely on the blockchain. 
Through his art, Brinkman not only captures the zeitgeist of the digital art movement but also actively shapes it, prompting discussions on discoverability, artist liquidity, and the complexities of the royalties debate. 
His holistic approach to digital artistry cements his role as a pivotal figure in defining the artistic and cultural implications of NFTs.

He'll bring his delightful creative energy to Card 175 on Dec 4th, 2023!
`,
      links: [
        {
          name: "Bryan's Twitter",
          url: "https://twitter.com/bryanbrinkman",
        },
        {
          name: "Bryan's Instagram",
          url: "https://www.instagram.com/brinkmanatee",
        },
        {
          name: "Bryan's Website",
          url: "https://www.bryanbrinkman.com/",
        },
      ],
    },
    {
      tokenId: 176,
      images: [
        "/artist-176/work-1.webp",
        "/artist-176/work-2.png",
        "/artist-176/work-3.png",
      ],
      poster: "/artist-176/poster.png",
      posterMintUrl: "",
      name: "Rocketgirl",
      info: `
Rocketgirl is a multidisciplinary artist hailing from Scotland, whose creative endeavors have carved a space in the world of NFT art that is very much her own. 
With a traditional background in painting, primarily using oils and inks, she has embraced the digital revolution, integrating AI into her art to transcend the conventional boundaries of the medium. 
Her journey into AI art began out of a serendipitous encounter with illness, where, too weak to stand at her easel, she channeled the dystopian visions of her fever dreams into her first AI-assisted piece, "SUNDAY BEST / FALSE IDOLS," which garnered acclaim by winning second prize in an art contest. 
This fusion of AI and traditional artistry is a hallmark of her work, which she describes as "pure, unadulterated chaos" and a "mixed-media chaos engine," indicating a process as spontaneous and unpredictable as the outcomes are compelling.

In her own words, Rocketgirl's drive to create is fueled by "a 100% selfish desire to live on through my work," highlighting a pursuit of immortality through art that echoes the sentiments of many artists before her. 
The thematic essence of her work often revolves around abstract chaos and dark dystopia, capturing the intensity and complexity of human emotions against the backdrop of a world in flux. 
Her artwork, characterized by bold strokes and a vibrant palette, invites viewers into a realm where the traditional and the digital converge, creating a visual language that speaks to the chaos of the modern world.
        
Rocketgirl's vision as an artist is as clear-cut as her stylistic approach is fluid. 
She envisions AI art becoming as uncontroversial as photography, a tool for future generations to express their own dystopian dreams or utopian ideals. 
With a keen eye on the horizon, she aims to be "a renowned and mildly notorious artist with a style that is unforgettable," leaving a legacy that challenges and inspires. 
Her work is not just a reflection of her innermost visions but also a dialogue with the ever-evolving digital landscape, an exploration of how humanity interacts with the increasingly blurred lines between the organic and the artificial.

What memetic chaos will Card 176 introduce on Dec 6th, 2023?
`,
      links: [
        {
          name: "Rocketgirl's Twitter",
          url: "https://twitter.com/rocketgirlNFT",
        },
        {
          name: "Rocketgirl's Instagram",
          url: "https://www.instagram.com/rocketgirlnft/",
        },
        {
          name: "Rocketgirl's Newsletter",
          url: "https://paragraph.xyz/@rocketgirl/rocket-boom",
        },
      ],
    },
    {
      tokenId: 177,
      images: [
        "/artist-177/work-1.jpeg",
        "/artist-177/work-2.mp4",
        "/artist-177/work-3.gif",
      ],
      poster: "/artist-177/poster.png",
      posterMintUrl: "",
      name: "Rare Scrilla",
      info: `
Rare Scrilla, also known as DJ J-Scrilla, is an artist deeply entrenched in the digital revolution of art and music, often exploring the thematic intersections between technology, economics, and culture.
Through his work, he comments on the fluid nature of value in the digital age, epitomized by his track "Faith In My Money (Money Printer Go Brrr)," which wryly observes the effects of economic policies on personal wealth and the surreal nature of fiat currency's value in a world at the mercy of the money printer.

Artistically, Scrilla's style is a blend of the vibrant, often chaotic ethos of internet meme culture and the gritty, street-wise aesthetics of hip hop.
His visual art, particularly his tokenized "Rare Pepe" NFTs, showcases a collage of cultural references (including all 4 elements of hip hop), utilizing the iconic Pepe meme to satirize and celebrate various aspects of urban and crypto culture.
The use of recognizable characters, bold text, and mixed media elements gives his artwork a distinctive, irreverent energy that is immediately fun, memetic, and thought-provoking.

In the realm of audio, Scrilla's style is similarly boundary-pushing, with Ordinal drops.
His foray into audio NFTs demonstrates his innovative spirit, merging his skills as a hip hop music producer with his savvy in crypto-art to create unique, collectible pieces of music.
These audio NFTs carry the thematic weight of his visual art, often containing samples and soundscapes that reflect on the economic and social themes he's known for, while also providing a new avenue for musical expression and artist-audience interaction in the digital space.

Will card 177 boost The Memes with some street savvy on Dec 8th, 2023? We can only hope!
`,
      links: [
        {
          name: "Rare Scrilla's Twitter",
          url: "https://twitter.com/scrillaventura",
        },
        {
          name: "Rare Scrilla's Instagram",
          url: "https://www.instagram.com/thescrillionaire/",
        },
        {
          name: "Rare Scrilla's Website",
          url: "https://y.at/%F0%9F%94%A5%F0%9F%A5%81%F0%9F%94%A5",
        },
      ],
    },
    {
      tokenId: 178,
      images: [
        "/artist-178/work-1.jpeg",
        "/artist-178/work-2.jpeg",
        "/artist-178/work-3.png",
      ],
      poster: "/artist-178/poster.png",
      posterMintUrl: "",
      name: "Fran Rodríguez",
      info: `
Fran Rodríguez, known in the digital art world as "La cabeza en las nubes" (Head in the Clouds), is a Barcelona-based artist whose canvas is the boundary between reality and the dreamlike. 
His digital works are a tapestry of surrealism, seamlessly blending elements of nature with cosmic and ethereal motifs to create scenes that transcend ordinary perception. 
The fusion of these elements is handled with such finesse that viewers find themselves suspended between the familiar and the fantastical, inviting introspection into the depths of the subconscious.

Rodríguez's artistic style is marked by a rich palette that spills across dreamscapes, defying gravity and logic with a masterful use of digital manipulation. 
His creations often incorporate a central, grounding figure or object—a nod to human experiences and emotions—surrounded by an intricate dance of surreal elements. 
This intentional design anchors the observer, while the surrounding swirl of colors and shapes in motion stirs a sense of the infinite. 
His work is not just seen, but felt, as it resonates with the inner strings of wonder and curiosity.
        
Collaborating with bands such as Weezer, Tame Impala, and Twin Shadow, Rodríguez extends his artistry into the auditory realm, crafting visuals that echo the music's emotive core. 
The synesthetic interplay of his visuals with sound creates a multi-sensory experience that is both immersive and evocative. 
Fran Rodríguez stands as a modern digital alchemist, turning the digital medium into meaningful art, with each piece a doorway to the vastness of imagination, reminding us that, indeed, "There are other worlds, but they are in this one."

What dreams will Card 178 awaken within? We will open our eyes to it on Dec 11th, 2023!
`,
      links: [
        {
          name: "Fran's Twitter",
          url: "https://twitter.com/Fran_nubes",
        },
        {
          name: "Fran's Instagram",
          url: "https://www.instagram.com/lacabezaenlasnubes/",
        },
        {
          name: "Fran's Website",
          url: "https://lacabezaenlasnubes.cargo.site/",
        },
      ],
    },
    {
      tokenId: 179,
      images: [
        "/artist-179/work-1.png",
        "/artist-179/work-2.png",
        "/artist-179/work-3.png",
      ],
      poster: "/artist-179/poster.png",
      posterMintUrl: "",
      name: "Lisa Fogarty",
      info: `
Welcome to the evocative world of Lisa Fogarty, an artist whose self-taught brilliance has carved out a space all her own in the digital art landscape. 
Fogarty's oeuvre is a vibrant tribute to feminine power, capturing the essence of the female gaze through a lens that is both introspective and rebellious. 
Her art, influenced by a childhood fascination with comic book heroines, reimagines these figures not as mere objects of fantasy but as icons of strength and resilience. 
Each piece is a confluence of vibrant hues and intricate details, inviting viewers to a visual feast that champions female empowerment and challenges traditional narratives.

As a new collector, you are about to embark on a journey through a gallery of digital masterpieces that tell poignant stories of mental health, beauty, and trauma. 
Fogarty's signature collection "FEELING BLUE" is a profound exploration of anxiety, portrayed with a raw honesty that resonates deeply with the human experience. 
Her art transcends the superficial, drawing you into a world where every brushstroke and pixel holds a piece of a larger narrative. 
The universal appeal of her work is evidenced by its presence in cultural hubs worldwide, from the historic streets of Milan to the vibrant landscapes of Lagos, underscoring the global language of her artistry.
        
Investing in a Lisa Fogarty piece means more than owning a fragment of digital creativity; it signifies holding a story that speaks to the boundless potential within every viewer. 
Her artworks are not just seen; they are felt, reflecting our own struggles, joys, and the journey towards self-discovery. 
As her works have graced the iconic billboards of Times Square, so too will they bring a distinctive voice to your collection, one that continues to grow in cultural significance and artistic value. 

Step into this world on Dec 13th, 2023 — and let NFTLisa's Card 179 redefine your experience of digital art and the power it holds to move and inspire.
`,
      links: [
        {
          name: "Lisa's Twitter",
          url: "https://twitter.com/nftlisa",
        },
        {
          name: "Lisa's Instagram",
          url: "https://www.instagram.com/lisakfogarty ",
        },
        {
          name: "Lisa's Website",
          url: "https://lisafogarty.se",
        },
      ],
    },
    {
      tokenId: 180,
      images: [
        "/artist-180/work-1.jpeg",
        "/artist-180/work-2.jpeg",
        "/artist-180/work-3.mp4",
      ],
      poster: "/artist-180/poster.png",
      posterMintUrl: "",
      name: "Victor Mosquera",
      info: `
As we approach the culmination of Season 5, a journey adorned with an eclectic tapestry of digital masterpieces, it is with great anticipation that we introduce the final art drop by none other than Victor Mosquera. 
His work is not merely a visual delight but a gateway to transcendence, a reflection of the very essence of what this season has celebrated: high-caliber artistry that resonates with the soul and elevates the spirit. 
Victor's pieces, rich in philosophical inquiry and cosmic wonder, offer a fitting crescendo to our collective exploration of the digital artscape.

Victor's art takes us beyond the traditional boundaries of digital art, navigating the realms of the metaphysical and the abstract with a grace that is as rare as it is captivating. 
Each piece serves as a conduit for contemplation, inviting viewers to traverse landscapes of the mind and the universe that lie beyond the canvas. 
His deft manipulation of color, texture, and near-tangible form crafts a visual language that speaks to the quest for meaning and connection in the digital age. 
This season's final drop promises to be a testament to Victor's ability to harness the digital medium not just to create but to communicate, to stir the imagination, and to kindle the embers of introspection.
        
Celebrating a season filled with remarkable art, Victor Mosquera's contribution stands as a beacon of excellence. 
We can only predict that Card 180 will encapsulate the spirit of Season 5, embodying the passion, innovation, and depth that have defined each art drop. 
As we draw the curtains on this season, we do so with a profound sense of gratitude and admiration for the artists like Victor, whose transcendent works have not only graced our gallery but have also imprinted upon the hearts and minds of The Memes community. 
Let us savor this final offering, a harmonious blend of vision and virtuosity, and carry its inspiration with us into the seasons to come.

Season 5 conludes with Card 180 on Dec 18th, 2023!
`,
      links: [
        {
          name: "Victor's Twitter",
          url: "https://twitter.com/victormosquerar",
        },
        {
          name: "Victor's Super Rare",
          url: "https://superrare.com/victormosquera",
        },
        {
          name: "Victor's Linktree",
          url: "https://linktr.ee/victormosquera?ltsid=90501cd2-6e56-40c7-9c7a-09052a0b2261",
        },
      ],
    },
    {
      tokenId: 181,
      images: [
        "/artist-181/work-1.jpeg",
        "/artist-181/work-2.jpeg",
        "/artist-181/work-3.jpeg",
      ],
      poster: "/artist-181/poster.png",
      posterMintUrl: "",
      name: "Tristan Eaton",
      info: `
Are you ready for seizing in Season 6? 
We're thrilled to introduce a powerhouse of creativity to kick off this season: muralist and painter Tristan Eaton.

For those of you who may not yet be acquainted with his work, Tristan Eaton is a tour de force in the contemporary art scene. 
Hailing from the sun-soaked streets of Hollywood, California, Eaton has etched his mark on the urban landscapes across the globe, from the buzzing arteries of Detroit to the historic textures of London. 
A virtuoso of visual storytelling, his murals are a symphony of bold graphics, vibrant characters, and interwoven patterns, each piece a dialogue between the viewer and the wall-become-canvas.

But Eaton's prowess extends beyond large-scale murals; he's a maestro of the designer toy world as well. 
As a co-founder of Kid Robot, he's responsible for some of the most iconic figures in the designer toy movement. 
His creations like the Dunny and Munny are not mere collectibles but are heralded as artifacts of pop culture, where the toy becomes the artistic medium, and the owner it's artist.

As we prepare for the first drop of Season 6 featuring Tristan Eaton, prepare yourselves for a blend of street art grit and sophisticated gallery aesthetics, all infused with the quintessential message and meaning that "The Memes" collection embodies. 
So, whether you're drawn to the revolutionary spirit of graffiti or the refined strokes of fine art, Eaton's contributions to "The Memes" are sure to captivate and add a new layer of depth to the collection. 
Who better than Eaton to help us get ready to embrace a season brimming with artistic innovation and cultural resonance?

This new szn kicks off with Card 181 on Jan 1st, 2024!
`,
      links: [
        {
          name: "Tristan's Twitter",
          url: "https://twitter.com/tristaneaton",
        },
        {
          name: "Tristan's Instagram",
          url: "http://instagram.com/tristaneaton",
        },
        {
          name: "Tristan's website",
          url: "https://www.tristaneaton.com/",
        },
      ],
    },
    {
      tokenId: 182,
      images: [
        "/artist-182/work-1.gif",
        "/artist-182/work-2.gif",
        "/artist-182/work-3.jpeg",
      ],
      poster: "/artist-182/poster.png",
      posterMintUrl: "",
      name: "@atmonez",
      info: `
Atmo's artistic style is a captivating fusion of cybernetic detail and heartfelt emotion, crafting visual narratives that resonate deeply within the digital zeitgeist. 
His compositions, often bathed in neon glows and punctuated by intricate tech motifs, explore the nuanced relationship between humans and our ever-more computerized worlds. 
There is an inherent sincerity in his work, a call to remember and cherish the human element amidst the binary codes and pixelated vistas. 
Atmonez masterfully balances the cold precision of technology with the warm ambiguity of human sentiment, creating pieces that awaken a sense of exploration, beckoning viewers to look beyond the immediate surface.

The vision of Atmo extends into the realm of speculative fiction, where science meets soul, and the future is tinged with the full spectrum of human emotion. 
His pieces are not just visually arresting; they serve as totems of the digital age, reminders of the flesh-and-blood passions that animate our interactions in virtual spaces. 
Through his art, Atmonez invites contemplation on how we express and perceive affection and identity within the digital echo chambers of society. 
The recurring motifs of glowing circuits intertwined with human elements suggest a symbiosis, a coalescence of what is human and what is created, reflecting a belief in the possibility of harmony between these realms.

In an era where digital connections often substitute for physical presence, Atmo's art stands as a beacon of authenticity. 
His works are a vibrant call to acknowledge the profound impact of our online engagements on the human psyche. 
By highlighting themes of connectivity, surveillance, and virtual existence, Atmo not only captures the aesthetic of a digital native but also embodies the soul-searching questions that arise within this modern context. 
His art is a bridge between the seen and unseen, a reminder that beneath the avatars and usernames, there are real hearts beating with the desire for genuine connection and understanding.

Can card 182 really bring all this The Memes on Jan 3rd, 2024? We'll see!`,
      links: [
        {
          name: "Atmo's Twitter",
          url: "https://x.com/atmonez",
        },
        {
          name: "Atmo's Instagram",
          url: "https://instagram.com/atmonez",
        },
        {
          name: "Atmo's Seize",
          url: "https://seize.io/Atmonez/identity",
        },
      ],
    },
    {
      tokenId: 183,
      images: [
        "/artist-183/work-1.jpeg",
        "/artist-183/work-2.jpeg",
        "/artist-183/work-3.jpeg",
      ],
      poster: "/artist-183/poster.png",
      posterMintUrl: "",
      name: "@1dontknows",
      info: `
Let us welcome to The Memes 1dontknows, the pseudonym of Thai artist Phanuwat Chukoed. 
His digital collages are a surreal interplay of history and psyche, where the Renaissance meets a dream-like future. 
Each piece is a dialogue without words, without faces, urging the observer to look past the individual and into the collective journey of the soul. 
His works are not just visual spectacles; they are invitations to explore concepts like metempsychosis, the eternal cycle of life and death, freedom and entrapment, justice and rebirth.

1DK's unique approach to digital art speaks to the introspective and the universal. 
He weaves his personal narrative of self-taught artistry and the challenges of a global pandemic into each creation. 
His canvases, while absent of traditional faces, express a shy artist's emotions and thoughts, resonating with his belief that art requires creativity, not just the ability to draw. 
Each collage is a testament to his journey from graphic designer to a full-time NFT artist, a narrative that enriches the layers of his digital tapestries.
      
For collectors who seek depth and storytelling, 1dontknows offers an exceptional portfolio. 
His art is an amalgamation of inspirations—from music to mythology—filtered through his visionary lens. 
To own a 1dontknows is to possess a fragment of the artist's soul, a piece of the ever-turning wheel of artistic rebirth. 
His work promises not only aesthetic pleasure but also a philosophical engagement with the timeless questions of existence, all immortalized on the immutable ledger of the blockchain.

1DK brings it all The Memes on Jan 5th, 2024.`,
      links: [
        {
          name: "1dontknows's Twitter",
          url: "https://twitter.com/1dontknows",
        },
        {
          name: "1dontknows's Instagram",
          url: "https://www.instagram.com/1dontknows",
        },
        {
          name: "1dontknows's website",
          url: "https://1dontknows.art",
        },
      ],
    },
    {
      tokenId: 184,
      images: [
        "/artist-184/work-1.jpeg",
        "/artist-184/work-2.jpeg",
        "/artist-184/work-3.jpeg",
      ],
      poster: "/artist-184/poster.png",
      posterMintUrl: "",
      name: "Martin Kozlowski",
      info: `
Please welcome to "The Memes" Martin Kozlowski, a celebrated artist with a storied career that spans over four decades.
Martin's journey began in 1980, and since then, he has been a dynamic force in the world of political cartoons, known for his incisive and humorous illustrations that have graced the pages of renowned publications such as the New York Times and the Wall Street Journal.
His keen eye for the social and political landscape has made him a pivotal voice in editorial illustration, capturing the zeitgeist with wit and an unerring sense of relevance.

Kozlowski's artistic endeavors extend beyond the traditional canvas, embodying a diverse range of skills.
As the art director and contributor to inxart.com, he has showcased his talent in steering visual narratives, while his comic strips have found homes in various newspapers and digital platforms, including the Hartford Courant and the Daily Star in Beirut.
His flair for design led him to establish his own firm in Union Square, NYC, and his tenure as an art director at the New York Times, especially on the Op-ed page, is a testament to his profound impact on visual storytelling.
      
Joining "The Memes" collection, Martin Kozlowski brings his rich tapestry of experience and his distinctive artistic voice to the world of digital art.
This foray into NFTs represents a convergence of his traditional social-commentary roots and the memetic rails of ethereum tokens.
Kozlowski's work, characterized by sharp satire and engaging humor, is poised to add a unique and thought-provoking dimension to our collection.
We are honored to have him as part of "The Memes," where his art will continue to challenge, entertain, and inspire in this new digital frontier.
      
What will his wit target on Jan 8th, 2024?`,
      links: [
        {
          name: "Martin's Twitter",
          url: "https://twitter.com/TrumpAltAmerica",
        },
        {
          name: "Martin's Instagram",
          url: "https://www.instagram.com/martinkozlowskiart",
        },
        {
          name: "Martin's website",
          url: "http://www.martinkozlowski.com",
        },
      ],
    },
    {
      tokenId: 690,
      images: [
        "/artist-690/work-1.jpeg",
        "/artist-690/work-2.png",
        "/artist-690/work-3.mp4",
      ],
      poster: "/artist-690/poster.png",
      posterMintUrl: "",
      name: "@UNNKNOWN",
      info: `
...We can't wait to see what she has created in Card 690 for our community... on Jan 4th, 2024.`,
      links: [
        {
          name: "UNNKNOWN's Twitter",
          url: "https://twitter.com/UNNKNOWN",
        },
        {
          name: "UNNKNOWN's Instagram",
          url: "https://linktr.ee/UNNKNOWN",
        },
        {
          name: "UNNKNOWN's website",
          url: "https://discord.gg/UNNKNOWN",
        },
      ],
    }
  ],
};
