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
          <title>Contact | The OM Pub</title>
          <meta
            property="og:url"
            content={`https://om.pub/faq`}
          />
          <meta
            property="og:title"
            content={`Contact | The OM Pub`}
          />
          <meta property="og:image" content={`/logo-fom-500.gif`} />
        </Head>
        <Header />
        <ArtistProfile />
      </>
    );
  };
