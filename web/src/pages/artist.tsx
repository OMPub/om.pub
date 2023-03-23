import Head from "next/head";
import dynamic from "next/dynamic";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import ArtistProfile from "@/components/artistProfile/ArtistProfile";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function Artist() {  
    return (
      <>
        <Head>
          <title>Preview: Meme Artist 83 | The OM Pub</title>
          <meta
            property="og:url"
            content={`https://om.pub/artist`}
          />
          <meta
            property="og:title"
            content={`Preview: Meme Artist 83 | The OM Pub`}
          />
          <meta property="og:image" content={`/artist-83/poster.png`} />
          <meta name="twitter:card" content="/artist-83/poster.png" />
          <meta name="twitter:site" content="@OM_Pub_" />
          <meta name="twitter:title" content="Preview: Meme Artist 83" />
          <meta name="twitter:description" content="Welcoming Luna Leonis to The Memes fam!" />
          <meta name="twitter:image" content="/artist-83/poster.png" />
        </Head>
        <Header />
        <ArtistProfile />
      </>
    );
  };
