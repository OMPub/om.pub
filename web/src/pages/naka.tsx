import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.scss";
import dynamic from "next/dynamic";
import { Col, Container, Row } from "react-bootstrap";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

type NakaText = {
  [key: string]: {
    language: string;
    content: {
      title: string;
      explainer: string;
      mintUrl: string;
    };
  };
};

const nakaText: NakaText = {
  "en-US": {
    language: "English",
    content: {
      title: "Freedom to Transact",
      explainer: "Without the freedom to transact, we have no other rights.",
      mintUrl: "",
    },
  },
  "fr-FR": {
    language: "Français",
    content: {
      title: "Liberté de transaction",
      explainer: "Sans la liberté de transaction, nous n'avons aucun autre droit.",
      mintUrl: "",
    },
  },
  "es-ES": {
    language: "Español",
    content: {
      title: "Libertad para Transaccionar",
      explainer: "Sin la libertad para transaccionar, no tenemos ningún otro derecho.",
      mintUrl: "",
    },
  },
  "zh-CN": {
    language: "中文",
    content: {
      title: "自由交易",
      explainer: "没有自由交易，我们就没有其他权利。",
      mintUrl: "",
    },
  },
  "ar-SA": {
    language: "العربية",
    content: {
      title: "حرية التداول",
      explainer: "بدون حرية التداول، ليس لدينا أي حقوق أخرى.",
      mintUrl: "",
    },
  },
  "pt-PT": {
    language: "Português",
    content: {
      title: "Liberdade para transacionar",
      explainer: "Sem a liberdade para transacionar, não temos outros direitos.",
      mintUrl: "",
    },
  },
  "bn-BD": {
    language: "বাংলা",
    content: {
      title: "লেনদেনের স্বাধীনতা",
      explainer: "লেনদেনের স্বাধীনতা না থাকলে, আমাদের অন্য কোন অধিকার নেই।",
      mintUrl: "",
    },
  },
  "ru-RU": {
    language: "Русский",
    content: {
      title: "Свобода совершать транзакции",
      explainer: "Без свободы совершать транзакции у нас нет никаких других прав.",
      mintUrl: "",
    },
  },
  "ja-JP": {
    language: "日本語",
    content: {
      title: "取引の自由",
      explainer: "取引の自由がなければ、他の権利はありません。",
      mintUrl: "",
    },
  },
  "de-DE": {
    language: "Deutsch",
    content: {
      title: "Freiheit zu handeln",
      explainer: "Ohne die Freiheit zu handeln haben wir keine anderen Rechte.",
      mintUrl: "",
    },
  },
  "ko-KR": {
    language: "한국어",
    content: {
      title: "거래의 자유",
      explainer: "거래의 자유가 없으면 우리는 다른 어떤 권리도 가지지 못합니다.",
      mintUrl: "",
    },
  },
  "tr-TR": {
    language: "Türkçe",
    content: {
      title: "İşlem Özgürlüğü",
      explainer: "İşlem özgürlüğü olmadan, başka hiçbir hakkımız yok.",
      mintUrl: "",
    },
  },
  "id-ID": {
    language: "Bahasa Indonesia",
    content: {
      title: "Kebebasan Bertransaksi",
      explainer: "Tanpa kebebasan untuk bertransaksi, kita tidak memiliki hak lain.",
      mintUrl: "",
    },
  },
  "ms-MY": {
    language: "Bahasa Melayu",
    content: {
      title: "Kebebasan Bertransaksi",
      explainer: "Tanpa kebebasan untuk bertransaksi, kita tidak memiliki hak lain.",
      mintUrl: "",
    },
  },
  "it-IT": {
    language: "Italiano",
    content: {
      title: "Libertà di Transazione",
      explainer: "Senza la libertà di transazione, non abbiamo altri diritti.",
      mintUrl: "",
    },
  },
  "pl-PL": {
    language: "Polski",
    content: {
      title: "Wolność Transakcji",
      explainer: "Bez wolności transakcji, nie mamy innych praw.",
      mintUrl: "",
    },
  },
  "vi-VN": {
    language: "Tiếng Việt",
    content: {
      title: "Tự Do Giao Dịch",
      explainer: "Không có tự do giao dịch, chúng ta không có bất kỳ quyền lợi nào khác.",
      mintUrl: "",
    },
  },
  "th-TH": {
    language: "ไทย",
    content: {
      title: "เสรีภาพในการทำธุรกรรม",
      explainer: "โดยไม่มีเสรีภาพในการทำธุรกรรม เราจะไม่มีสิทธิ์อื่นๆ",
      mintUrl: "",
    },
  },
}

export default function Naka(props: any) {
  const { locale, locales } = props.context;
  const { asPath } = useRouter();
  const { language, content } = nakaText[locale];

  return (
    <>
      <Head>
        <title>Naka 365 | The OM Pub</title>
        <meta
          property="og:url"
          content={`https://om.pub/naka`}
        />
        <meta
          property="og:title"
          content={`Naka 365 | The OM Pub`}
        />
        <meta property="og:image" content={`/om-pub-logo.gif`} />
      </Head>
      <Header />
      <Container className={`${styles.main}`}>
        <Row>
          <Col md={2}>
            <div
              style={{
                padding: "4px",
                marginRight: "4px",
              }}
            >
              <span
                style={{
                  borderRadius: "3px",
                  backgroundColor: "blue",
                  color: "white",
                  padding: "2px",
                }}
              >
                {language}
              </span>
            </div>
            <div>
              <ul>
                {locales.map((loc: string) => (
                  <li key={loc}>
                    <Link key={loc} href={asPath} locale={loc}>
                      {loc}: {nakaText[loc].language}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col>
            <div>
              <div>
                <h2>{content.title}</h2>
                <p>
                  {content.explainer}
                </p>
              </div>
              <div style={{color: "#ccc"}}>
                <h3>How's the translation?</h3>
                <p>
                  Does this translation seem correct? Can you improve it or offer a suggestion? Tweet your thoughts to <a href="https://twitter.com/om_pub_" target="_blank">OM_Pub_</a>, with hashtag #naka-{locale}. Thanks!
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div>
              <img src={`/naka/naka-en-US.jpeg` /* ${locale}.jpeg */} alt={`Nakamoto Freedom: ${locale}`} className={`img-fluid`} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getStaticProps = async (context: any) => {
  return {
    props: { context },
  };
};
