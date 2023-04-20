import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.scss";
import dynamic from "next/dynamic";
import { Col, Container, Row } from "react-bootstrap";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import NakaImage from '@/components/nakaImage/NakaImage';

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

type NakaText = {
  [key: string]: {
    id: number;
    language: string;
    languageEn: string;
    title: string;
    explainer: string;
    mintUrl: string;
  };
};

export default function Naka(props: any) {
  const { locale, locales } = props.context;
  const { asPath } = useRouter();
  const [buttonHashtag, setButtonHashtag] = useState('');
  const [buttonText, setButtonText] = useState('');
  const local = nakaText[locale];

  useEffect(() => {
    const loc = locale.toUpperCase();
    const local = nakaText[locale];
    setButtonHashtag(`naka${loc}`);
    setButtonText(`Naka ${loc} Translation: \n\n${local.title}\n\n`);
  }, [locale]);

  const reloadTwitterScript = () => {
    const buttonContainerId = 'twitter-button-container';
    const buttonContainer = document.getElementById(buttonContainerId);

    if (buttonContainer) {
      // Remove existing iframe and anchor tag
      while (buttonContainer.firstChild) {
        buttonContainer.firstChild.remove();
      }

      // Insert updated Twitter button anchor tag
      const newButton = document.createElement('a');
      newButton.href = `https://twitter.com/intent/tweet?button_hashtag=${buttonHashtag}&ref_src=twsrc%5Etfw`;
      newButton.className = 'twitter-hashtag-button';
      newButton.setAttribute('data-size', 'large');
      newButton.setAttribute('data-text', buttonText);
      newButton.setAttribute('data-url', `https://om.pub/${locale}/naka`);
      newButton.setAttribute('data-related', 'OM_Pub_');
      newButton.setAttribute('data-dnt', 'true');
      newButton.setAttribute('data-show-count', 'false');
      newButton.textContent = `Tweet #${buttonHashtag}`;

      buttonContainer.appendChild(newButton);
    }

    // Reload the Twitter Widgets JS library
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  };

  useEffect(() => {
    reloadTwitterScript();
  }, [buttonHashtag, buttonText]);

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
        <meta
          property="og:image"
          content={`/om-pub-logo.gif`}
        />
      </Head>
      <script id="twitter-script" src="https://platform.twitter.com/widgets.js"></script>
      <Header />
      <Container className={`${styles.main}`}>
        <Row>
          <Col md={2} className={`${styles.scrollable}`}>

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
          <Col md={5}>
            <NakaImage
              locale={locale}
              title={local.title}
              alt={local.title}
              className="img-fluid"
            />
          </Col>
          <Col>
            <div>
              <h3>
                  {locale.toUpperCase()}: {local.language} ({local.languageEn})
              </h3>
              <div>
                <p>
                  {local.explainer}
                </p>
              </div>
              <div style={{
                color: "#aaa",
                paddingTop: "4em",
              }}>
                <h3>How's the translation?</h3>
                <p>
                  Does this translation seem correct? Can you improve it or offer a suggestion? Tweet your thoughts to <a href="https://twitter.com/om_pub_" target="_blank">OM_Pub_</a>, with hashtag #naka{locale.toUpperCase()}. Thanks!
                </p>
              </div>
              <div id="twitter-button-container">
                <a
                  href={`https://twitter.com/intent/tweet?button_hashtag=${buttonHashtag}&ref_src=twsrc%5Etfw`}
                  className="twitter-hashtag-button"
                  data-size="large"
                  data-text={buttonText}
                  data-url={`https://om.pub/${locale}/naka`}
                  data-related="OM_Pub_"
                  data-dnt="true"
                  data-show-count="false"
                >
                  Tweet #{buttonHashtag}
                </a>
              </div>
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


const nakaText: NakaText = {
  "en": {
    "id": 1,
    "language": "English",
    "languageEn": "English",
    "title": "Freedom to Transact",
    "explainer": "Freedom to transact underlies all other constitutional rights. Without the freedom to transact, you have no other constitutional rights.",
    "mintUrl": ""
  },
  "ceb": {
    "id": 2,
    "language": "Sinugboanong Binisaya",
    "languageEn": "Cebuano",
    "title": "Kagawasan sa Pag-Transact",
    "explainer": "Ang kalayaan sa pag-transact nagtukod sa tanang uban nga mga katungod sa konstitusyon. Kung walay kalayaan sa pag-transact, wala kay uban nga mga katungod sa konstitusyon.",
    "mintUrl": ""
  },
  "de": {
    "id": 3,
    "language": "Deutsch",
    "languageEn": "German",
    "title": "Transaktionsfreiheit",
    "explainer": "Die Freiheit zu handeln ist die Grundlage aller anderen verfassungsm\u00e4\u00dfigen Rechte. Ohne die Freiheit zu handeln, hast du keine anderen verfassungsm\u00e4\u00dfigen Rechte.",
    "mintUrl": ""
  },
  "sv": {
    "id": 4,
    "language": "Svenska",
    "languageEn": "Swedish",
    "title": "Frihet att genomf\u00f6ra transaktioner",
    "explainer": "Frihet att genomf\u00f6ra transaktioner ligger till grund f\u00f6r alla andra konstitutionella r\u00e4ttigheter. Utan friheten att genomf\u00f6ra transaktioner har du inga andra konstitutionella r\u00e4ttigheter.",
    "mintUrl": ""
  },
  "fr": {
    "id": 5,
    "language": "Fran\u00e7ais",
    "languageEn": "French",
    "title": "La libert\u00e9 de transaction",
    "explainer": "La libert\u00e9 de transaction est \u00e0 la base de tous les autres droits constitutionnels. Sans la libert\u00e9 de transaction, vous n'avez aucun autre droit constitutionnel.",
    "mintUrl": ""
  },
  "nl": {
    "id": 6,
    "language": "Nederlands",
    "languageEn": "Dutch",
    "title": "Vrijheid om te transacteren",
    "explainer": "Vrijheid om te handelen is de basis van alle andere grondwettelijke rechten. Zonder de vrijheid om te handelen heb je geen andere grondwettelijke rechten.",
    "mintUrl": ""
  },
  "ru": {
    "id": 7,
    "language": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
    "languageEn": "Russian",
    "title": "\u0421\u0432\u043e\u0431\u043e\u0434\u0430 \u0441\u043e\u0432\u0435\u0440\u0448\u0430\u0442\u044c \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u0438",
    "explainer": "\u0421\u0432\u043e\u0431\u043e\u0434\u0430 \u0441\u043e\u0432\u0435\u0440\u0448\u0430\u0442\u044c \u0441\u0434\u0435\u043b\u043a\u0438 \u043b\u0435\u0436\u0438\u0442 \u0432 \u043e\u0441\u043d\u043e\u0432\u0435 \u0432\u0441\u0435\u0445 \u0434\u0440\u0443\u0433\u0438\u0445 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u043e\u043d\u043d\u044b\u0445 \u043f\u0440\u0430\u0432. \u0411\u0435\u0437 \u0441\u0432\u043e\u0431\u043e\u0434\u044b \u0441\u043e\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u044f \u0441\u0434\u0435\u043b\u043e\u043a \u0443 \u0432\u0430\u0441 \u043d\u0435\u0442 \u0434\u0440\u0443\u0433\u0438\u0445 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u043e\u043d\u043d\u044b\u0445 \u043f\u0440\u0430\u0432.",
    "mintUrl": ""
  },
  "es": {
    "id": 8,
    "language": "Espa\u00f1ol",
    "languageEn": "Spanish",
    "title": "Libertad para Transaccionar",
    "explainer": "La libertad de transacci\u00f3n subyace a todos los dem\u00e1s derechos constitucionales. Sin la libertad de transacci\u00f3n, no tienes ning\u00fan otro derecho constitucional.",
    "mintUrl": ""
  },
  "it": {
    "id": 9,
    "language": "Italiano",
    "languageEn": "Italian",
    "title": "Libert\u00e0 di transazione",
    "explainer": "La libert\u00e0 di transazione sottende tutti gli altri diritti costituzionali. Senza la libert\u00e0 di transazione, non hai altri diritti costituzionali.",
    "mintUrl": ""
  },
  "arz": {
    "id": 10,
    "language": "\u0645\u0635\u0631\u0649 (Ma\u1e63r\u012b)",
    "languageEn": "Egyptian Arabic",
    "title": "\u062d\u0631\u064a\u0629 \u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a",
    "explainer": "\u0627\u0644\u062d\u0631\u064a\u0629 \u0641\u064a \u0627\u0644\u062a\u0639\u0627\u0645\u0644\u0627\u062a \u062a\u0642\u0648\u0645 \u0639\u0644\u0649 \u0623\u0633\u0627\u0633 \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0627\u0644\u062f\u0633\u062a\u0648\u0631\u064a\u0629 \u0627\u0644\u0623\u062e\u0631\u0649. \u0628\u062f\u0648\u0646 \u062d\u0631\u064a\u0629 \u0627\u0644\u062a\u0639\u0627\u0645\u0644\u060c \u0644\u0627 \u064a\u0648\u062c\u062f \u0644\u062f\u064a\u0643 \u0623\u064a \u062d\u0642\u0648\u0642 \u062f\u0633\u062a\u0648\u0631\u064a\u0629 \u0623\u062e\u0631\u0649.",
    "mintUrl": ""
  },
  "pl": {
    "id": 11,
    "language": "Polski",
    "languageEn": "Polish",
    "title": "Wolno\u015b\u0107 do dokonywania transakcji",
    "explainer": "Wolno\u015b\u0107 dokonywania transakcji le\u017cy u podstaw wszystkich innych praw konstytucyjnych. Bez wolno\u015bci dokonywania transakcji, nie posiadasz \u017cadnych innych praw konstytucyjnych.",
    "mintUrl": ""
  },
  "ja": {
    "id": 12,
    "language": "\u65e5\u672c\u8a9e",
    "languageEn": "Japanese",
    "title": "\u53d6\u5f15\u306e\u81ea\u7531",
    "explainer": "\u3059\u3079\u3066\u306e\u61b2\u6cd5\u4e0a\u306e\u6a29\u5229\u306e\u6839\u672c\u306b\u306f\u3001\u53d6\u5f15\u306e\u81ea\u7531\u304c\u3042\u308a\u307e\u3059\u3002\u53d6\u5f15\u306e\u81ea\u7531\u304c\u306a\u3051\u308c\u3070\u3001\u4ed6\u306b\u3069\u3093\u306a\u61b2\u6cd5\u4e0a\u306e\u6a29\u5229\u3082\u3042\u308a\u307e\u305b\u3093\u3002",
    "mintUrl": ""
  },
  "zh": {
    "id": 13,
    "language": "\u4e2d\u6587",
    "languageEn": "Chinese",
    "title": "\u81ea\u7531\u4ea4\u6613",
    "explainer": "\u81ea\u7531\u4ea4\u6613\u662f\u6240\u6709\u5baa\u6cd5\u6743\u5229\u7684\u57fa\u7840\u3002\u5982\u679c\u6ca1\u6709\u81ea\u7531\u4ea4\u6613\uff0c\u60a8\u5c31\u6ca1\u6709\u5176\u4ed6\u5baa\u6cd5\u6743\u5229\u3002",
    "mintUrl": ""
  },
  "vi": {
    "id": 14,
    "language": "Ti\u1ebfng Vi\u1ec7t",
    "languageEn": "Vietnamese",
    "title": "T\u1ef1 do giao d\u1ecbch",
    "explainer": "T\u1ef1 do giao d\u1ecbch l\u00e0 n\u1ec1n t\u1ea3ng c\u1ee7a t\u1ea5t c\u1ea3 c\u00e1c quy\u1ec1n h\u1ea1n hi\u1ebfn ph\u00e1p kh\u00e1c. N\u1ebfu kh\u00f4ng c\u00f3 t\u1ef1 do giao d\u1ecbch, b\u1ea1n kh\u00f4ng c\u00f3 b\u1ea5t k\u1ef3 quy\u1ec1n h\u1ea1n hi\u1ebfn ph\u00e1p n\u00e0o kh\u00e1c.",
    "mintUrl": ""
  },
  "war": {
    "id": 15,
    "language": "Winaray",
    "languageEn": "Waray-Waray",
    "title": "Kagawasan nga magbuhat hin transaksiyon",
    "explainer": "An kagawasan nga magtransakto amo an nagpapabilin ha iba nga mga katungod ha konstitusyon. Waray ka mga iba nga mga katungod ha konstitusyon kun waray ka kagawasan nga magtransakto.",
    "mintUrl": ""
  },
  "uk": {
    "id": 16,
    "language": "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
    "languageEn": "Ukrainian",
    "title": "\u0421\u0432\u043e\u0431\u043e\u0434\u0430 \u0437\u0434\u0456\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0456\u0439",
    "explainer": "\u0421\u0432\u043e\u0431\u043e\u0434\u0430 \u0437\u0434\u0456\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0456\u0439 \u043b\u0435\u0436\u0438\u0442\u044c \u0432 \u043e\u0441\u043d\u043e\u0432\u0456 \u0432\u0441\u0456\u0445 \u0456\u043d\u0448\u0438\u0445 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0456\u0439\u043d\u0438\u0445 \u043f\u0440\u0430\u0432. \u0411\u0435\u0437 \u0441\u0432\u043e\u0431\u043e\u0434\u0438 \u0437\u0434\u0456\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0456\u0439 \u0432\u0438 \u043d\u0435 \u043c\u0430\u0454\u0442\u0435 \u0456\u043d\u0448\u0438\u0445 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0456\u0439\u043d\u0438\u0445 \u043f\u0440\u0430\u0432.",
    "mintUrl": ""
  },
  "ar": {
    "id": 17,
    "language": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    "languageEn": "Arabic",
    "title": "\u062d\u0631\u064a\u0629 \u0627\u0644\u062a\u0639\u0627\u0645\u0644",
    "explainer": "\u0627\u0644\u062d\u0631\u064a\u0629 \u0641\u064a \u0627\u0644\u062a\u0639\u0627\u0645\u0644 \u062a\u0643\u0645\u0646 \u0641\u064a \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0627\u0644\u062f\u0633\u062a\u0648\u0631\u064a\u0629 \u0627\u0644\u0623\u062e\u0631\u0649. \u0628\u062f\u0648\u0646 \u062d\u0631\u064a\u0629 \u0627\u0644\u062a\u0639\u0627\u0645\u0644\u060c \u0644\u0627 \u064a\u0648\u062c\u062f \u0644\u062f\u064a\u0643 \u0623\u064a \u062d\u0642\u0648\u0642 \u062f\u0633\u062a\u0648\u0631\u064a\u0629 \u0623\u062e\u0631\u0649.",
    "mintUrl": ""
  },
  "pt": {
    "id": 18,
    "language": "Portugu\u00eas",
    "languageEn": "Portuguese",
    "title": "Liberdade de Transação",
    "explainer": "A liberdade de transacionar \u00e9 a base de todos os outros direitos constitucionais. Sem a liberdade de transacionar, voc\u00ea n\u00e3o tem nenhum outro direito constitucional.",
    "mintUrl": ""
  },
  "fa": {
    "id": 19,
    "language": "\u0641\u0627\u0631\u0633\u06cc",
    "languageEn": "Persian",
    "title": "\u0622\u0632\u0627\u062f\u06cc\u0020\u062f\u0631\u0020\u0627\u0646\u062c\u0627\u0645\u0020\u0645\u0639\u0627\u0645\u0644\u0627\u062a",
    "explainer": "\u0622\u0632\u0627\u062f\u06cc \u062a\u0631\u0627\u06a9\u0646\u0634\u060c \u067e\u0627\u06cc\u0647 \u062a\u0645\u0627\u0645\u06cc \u062d\u0642\u0648\u0642 \u0642\u0627\u0646\u0648\u0646 \u0627\u0633\u0627\u0633\u06cc \u062f\u06cc\u06af\u0631 \u0627\u0633\u062a. \u0628\u062f\u0648\u0646 \u0622\u0632\u0627\u062f\u06cc \u062a\u0631\u0627\u06a9\u0646\u0634\u060c \u0647\u06cc\u0686 \u062d\u0642\u0648\u0642 \u0642\u0627\u0646\u0648\u0646 \u0627\u0633\u0627\u0633\u06cc \u062f\u06cc\u06af\u0631\u06cc \u0646\u062f\u0627\u0631\u06cc\u062f.",
    "mintUrl": ""
  },
  "ca": {
    "id": 20,
    "language": "Catal\u00e0",
    "languageEn": "Catalan",
    "title": "Llibertat per a transaccionar",
    "explainer": "La llibertat de transacci\u00f3 \u00e9s la base de tots els altres drets constitucionals. Sense la llibertat de transacci\u00f3, no tens cap altre dret constitucional.",
    "mintUrl": ""
  },
  "sr": {
    "id": 21,
    "language": "\u0421\u0440\u043f\u0441\u043a\u0438 / Srpski",
    "languageEn": "Serbian",
    "title": "Sloboda za transakcije",
    "explainer": "Sloboda transakcije je osnova svih drugih ustavnih prava. Bez slobode transakcije, nemate druga ustavna prava.",
    "mintUrl": ""
  },
  "id": {
    "id": 22,
    "language": "Bahasa Indonesia",
    "languageEn": "Indonesian",
    "title": "Kebebasan untuk Bertransaksi",
    "explainer": "Kebebasan untuk melakukan transaksi merupakan dasar dari semua hak konstitusional lainnya. Tanpa kebebasan untuk melakukan transaksi, Anda tidak memiliki hak konstitusional lainnya.",
    "mintUrl": ""
  },
  "ko": {
    "id": 23,
    "language": "\ud55c\uad6d\uc5b4",
    "languageEn": "Korean",
    "title": "\uac70\ub798\uc758 \uc790\uc720",
    "explainer": "\uac70\ub798\uc758 \uc790\uc720\ub294 \ubaa8\ub4e0 \ud5cc\ubc95\uc801 \uad8c\ub9ac\uc758 \uae30\ucd08\uc785\ub2c8\ub2e4. \uac70\ub798\uc758 \uc790\uc720\uac00 \uc5c6\uc73c\uba74 \ub2e4\ub978 \uc5b4\ub5a4 \ud5cc\ubc95\uc801 \uad8c\ub9ac\ub3c4 \uc5c6\uc2b5\ub2c8\ub2e4.",
    "mintUrl": ""
  },
  "no": {
    "id": 24,
    "language": "Norsk (Bokm\u00e5l)",
    "languageEn": "Norwegian (Bokm\u00e5l)",
    "title": "Frihet til \u00e5 utf\u00f8re transaksjoner",
    "explainer": "Friheten til \u00e5 gjennomf\u00f8re transaksjoner ligger til grunn for alle andre konstitusjonelle rettigheter. Uten friheten til \u00e5 gjennomf\u00f8re transaksjoner, har du ingen andre konstitusjonelle rettigheter.",
    "mintUrl": ""
  },
  "ce": {
    "id": 25,
    "language": "\u041d\u043e\u0445\u0447\u0438\u0439\u043d",
    "languageEn": "Chechen",
    "title": "\u0425\u044c\u0430\u0436\u0430\u0440\u0433 \u0434\u0435\u0445\u044c\u0430 \u0445\u0438\u0439\u0446\u0430\u0440\u0438\u0439\u043d \u0434\u0443\u044c\u0440\u0430\u0440\u0446\u0430",
    "explainer": "\u041d\u043e\u0445\u0447\u0438\u0439\u043d: \u0414\u0438\u043b\u0430 \u0445\u04c0\u0430\u0436\u0430\u0440 \u0445\u0443\u044c\u043c\u0430\u0440 \u043a\u04c0\u043e\u0432\u0448\u0438\u043d \u043a\u0445\u043e \u043c\u0443\u0445\u0430 \u0435\u0440-\u0434\u0443-\u0434\u0443\u0448\u0430\u0440 \u0434\u043e\u0448, \u0434\u0443\u0448\u0430\u0440 \u0445\u04c0\u0430\u0436\u0430\u0440 \u0445\u0443\u044c\u043c\u0430\u0440 \u043a\u04c0\u043e\u0432\u0448\u0438\u043d \u0445\u0443\u044c\u043c\u0440\u0430\u0448 \u0434\u043e\u0448 \u0445\u0438\u0439\u0446\u0430.",
    "mintUrl": ""
  },
  "fi": {
    "id": 26,
    "language": "Suomi",
    "languageEn": "Finnish",
    "title": "Vapaus tehd\u00e4 kauppoja",
    "explainer": "Vapaus tehd\u00e4 kauppoja on kaikkien muiden perustuslaillisten oikeuksien perusta. Ilman vapautta tehd\u00e4 kauppoja sinulla ei ole muita perustuslaillisia oikeuksia.",
    "mintUrl": ""
  },
  "hu": {
    "id": 27,
    "language": "Magyar",
    "languageEn": "Hungarian",
    "title": "Tranzakci\u00f3 szabads\u00e1ga",
    "explainer": "Az \u00fcgyleti szabads\u00e1g az \u00f6sszes egy\u00e9b alkotm\u00e1nyos jog alapja. Az \u00fcgyleti szabads\u00e1g n\u00e9lk\u00fcl nincsenek m\u00e1s alkotm\u00e1nyos jogok.",
    "mintUrl": ""
  },
  "cs": {
    "id": 28,
    "language": "\u010ce\u0161tina",
    "languageEn": "Czech",
    "title": "Svoboda k transakc\u00edm",
    "explainer": "Svoboda transakce le\u017e\u00ed v z\u00e1kladu v\u0161ech ostatn\u00edch \u00fastavn\u00edch pr\u00e1v. Bez svobody transakce nem\u00e1te \u017e\u00e1dn\u00e1 jin\u00e1 \u00fastavn\u00ed pr\u00e1va.",
    "mintUrl": ""
  },
  "tr": {
    "id": 29,
    "language": "T\u00fcrk\u00e7e",
    "languageEn": "Turkish",
    "title": "\u0130\u015flem yapma \u00f6zg\u00fcrl\u00fc\u011f\u00fc",
    "explainer": "\u0130\u015flem yapma \u00f6zg\u00fcrl\u00fc\u011f\u00fc, di\u011fer t\u00fcm anayasal haklar\u0131n temelidir. \u0130\u015flem yapma \u00f6zg\u00fcrl\u00fc\u011f\u00fc olmadan, di\u011fer anayasal haklar\u0131n\u0131z yoktur.",
    "mintUrl": ""
  },
  "tt": {
    "id": 30,
    "language": "Tatar\u00e7a / \u0422\u0430\u0442\u0430\u0440\u0447\u0430",
    "languageEn": "Tatar",
    "title": "\u0418\u0448\u043b\u0435\u043c \u044f\u0441\u044b\u0439\u043b\u044b\u0433\u044b\u043d\u0430 \u044d\u0440\u0435\u043d\u0434\u04d9\u043b\u0435\u043a",
    "explainer": "\u0418\u0448\u043b\u0435\u043c\u0433\u0430 \u044d\u0440\u0435\u0448\u043c\u04d9\u043a\u043a\u04d9\u043d \u04d9\u0437\u0433\u04d9\u0440\u0435\u0448\u043b\u0435\u043a-\u0497\u0438\u0440\u04d9\u0445\u04d9\u0442 \u0431\u0430\u0440\u043b\u044b\u043a \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u043a \u0443\u043a\u0443\u043a\u0442\u0430\u0440\u043d\u044b\u04a3 \u0430\u043b\u0442\u0430\u043d \u0442\u04e9\u0437\u04d9\u043b\u0435\u0448\u0435\u043d\u0434\u04d9 \u043a\u04e9\u043d\u04d9\u043b\u04d9\u043d\u04d9. \u0418\u0448\u043b\u0435\u043c\u0433\u0430 \u044d\u0440\u0435\u0448\u043c\u04d9\u043a\u043a\u04d9\u043d \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u043a \u0443\u043a\u0443\u043a\u0442\u0430\u0440\u043d\u044b\u04a3 \u0431\u0430\u0448\u043a\u0430\u043b\u0430\u0440\u044b \u044e\u043a.",
    "mintUrl": ""
  },
  "sh": {
    "id": 31,
    "language": "Srpskohrvatski / \u0421\u0440\u043f\u0441\u043a\u043e\u0445\u0440\u0432\u0430\u0442\u0441\u043a\u0438",
    "languageEn": "Serbo-Croatian",
    "title": "Sloboda da obavljate transakcije",
    "explainer": "Sloboda transakcije le\u017ei u osnovi svih drugih ustavnih prava. Bez slobode transakcije, nemate druga ustavna prava.",
    "mintUrl": ""
  },
  "ro": {
    "id": 32,
    "language": "Rom\u00e2n\u0103",
    "languageEn": "Romanian",
    "title": "Libertatea de a efectua tranzac\u021bii",
    "explainer": "Libertatea de a face tranzac\u021bii st\u0103 la baza tuturor celorlalte drepturi constitu\u021bionale. F\u0103r\u0103 libertatea de a face tranzac\u021bii, nu ave\u021bi niciun alt drept constitu\u021bional.",
    "mintUrl": ""
  },
  "zh-min-nan": {
    "id": 33,
    "language": "B\u00e2n-l\u00e2m-g\u00fa",
    "languageEn": "Min Nan",
    "title": "\u81ea\u7531\u4ea4\u6613",
    "explainer": "Kh\u00f3-l\u00e2ng t\u012b chhut-ka-th\u00f3ng k\u00e0u chok \u00ea chheng-ch\u00f2\u0358-kong, t\u012b chhut-ka-th\u00f3ng b\u00f4 chheng-ch\u00f2\u0358-kong.",
    "mintUrl": ""
  },
  "eu": {
    "id": 34,
    "language": "Euskara",
    "languageEn": "Basque",
    "title": "Transakzio askatasuna",
    "explainer": "Transakzio askatasuna konstituzioko eskubide guztien azpian dago. Transakzio askatasunik ez baduzu, ez duzu beste inolako konstituzioko eskubiderik.",
    "mintUrl": ""
  },
  "ms": {
    "id": 35,
    "language": "Bahasa Melayu",
    "languageEn": "Malay",
    "title": "Kebebasan untuk Melakukan Transaksi",
    "explainer": "Kebebasan untuk berurusan di bawahnya semua hak konstitusi yang lain. Tanpa kebebasan untuk berurusan, anda tidak mempunyai hak konstitusi yang lain.",
    "mintUrl": ""
  },
  "eo": {
    "id": 36,
    "language": "Esperanto",
    "languageEn": "Esperanto",
    "title": "Libereco por transakcioj",
    "explainer": "La libereco transaksi subtenas \u0109iujn aliajn konstituciajn rajtojn. Sen la libereco transaksi, vi ne havas aliajn konstituciajn rajtojn.",
    "mintUrl": ""
  },
  "he": {
    "id": 37,
    "language": "\u05e2\u05d1\u05e8\u05d9\u05ea",
    "languageEn": "Hebrew",
    "title": "\u05d7\u05d5\u05e4\u05e9 \u05dc\u05d1\u05e6\u05e2 \u05e2\u05e1\u05e7\u05d0\u05d5\u05ea",
    "explainer": "\u05d4\u05d7\u05d5\u05e4\u05e9 \u05dc\u05d1\u05e6\u05e2 \u05e2\u05e1\u05e7\u05d0\u05d5\u05ea \u05d4\u05d5\u05d0 \u05d4\u05d9\u05e1\u05d5\u05d3 \u05dc\u05db\u05dc \u05d4\u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05d4\u05d7\u05d5\u05e7\u05ea\u05d9\u05d5\u05ea \u05d4\u05d0\u05d7\u05e8\u05d5\u05ea. \u05dc\u05dc\u05d0 \u05d4\u05d7\u05d5\u05e4\u05e9 \u05dc\u05d1\u05e6\u05e2 \u05e2\u05e1\u05e7\u05d0\u05d5\u05ea, \u05d0\u05d9\u05df \u05dc\u05da \u05d6\u05db\u05d5\u05d9\u05d5\u05ea \u05d7\u05d5\u05e7\u05ea\u05d9\u05d5\u05ea \u05d0\u05d7\u05e8\u05d5\u05ea.",
    "mintUrl": ""
  },
  "hy": {
    "id": 38,
    "language": "\u0540\u0561\u0575\u0565\u0580\u0565\u0576",
    "languageEn": "Armenian",
    "title": "\u0533\u0578\u0582\u0574\u0561\u0580\u0561\u0575\u056b\u0576 \u0563\u0578\u0580\u056e\u0561\u0580\u0584\u056b \u0561\u0566\u0561\u057f\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    "explainer": "\u054f\u0565\u0572\u0561\u056f\u0561\u0575\u0578\u0582\u0574\u0568 \u0563\u0578\u0580\u056e\u0561\u057c\u0578\u0582\u0575\u0569 \u056f\u0561\u057f\u0561\u0580\u0565\u056c\u056b\u057d \u0570\u0561\u0576\u0580\u0561\u057a\u0565\u057f\u0561\u056f\u0561\u0576 \u056b\u0580\u0561\u057e\u056b\u0573\u0561\u056f\u0576\u0565\u0580\u056b \u0562\u0578\u056c\u0578\u0580 \u0561\u0575\u056c \u056b\u0580\u0561\u057e\u0578\u0582\u0576\u0584\u0576",
    "mintUrl": ""
  },
  "da": {
    "id": 39,
    "language": "Dansk",
    "languageEn": "Danish",
    "title": "Frihed til at foretage transaktioner",
    "explainer": "Frihed til at handle ligger til grund for alle andre konstitutionelle rettigheder. Uden frihed til at handle har du ingen andre konstitutionelle rettigheder.",
    "mintUrl": ""
  },
  "bg": {
    "id": 40,
    "language": "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
    "languageEn": "Bulgarian",
    "title": "\u0421\u0432\u043e\u0431\u043e\u0434\u0430 \u0434\u0430 \u0441\u0435 \u0438\u0437\u0432\u044a\u0440\u0448\u0432\u0430\u0442 \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u0438",
    "explainer": "\u0421\u0432\u043e\u0431\u043e\u0434\u0430\u0442\u0430 \u0434\u0430 \u0441\u043a\u043b\u044e\u0447\u0432\u0430\u0442\u0435 \u0441\u0434\u0435\u043b\u043a\u0438 \u0435 \u043e\u0441\u043d\u043e\u0432\u0430\u0442\u0430 \u043d\u0430 \u0432\u0441\u0438\u0447\u043a\u0438 \u0434\u0440\u0443\u0433\u0438 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u043e\u043d\u043d\u0438 \u043f\u0440\u0430\u0432\u0430. \u0411\u0435\u0437 \u0441\u0432\u043e\u0431\u043e\u0434\u0430\u0442\u0430 \u0434\u0430 \u0441\u043a\u043b\u044e\u0447\u0432\u0430\u0442\u0435 \u0441\u0434\u0435\u043b\u043a\u0438 \u043d\u044f\u043c\u0430\u0442\u0435 \u0434\u0440\u0443\u0433\u0438 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u043e\u043d\u043d\u0438 \u043f\u0440\u0430\u0432\u0430.",
    "mintUrl": ""
  },
  "cy": {
    "id": 41,
    "language": "Cymraeg",
    "languageEn": "Welsh",
    "title": "Rhyddid i Drafod",
    "explainer": "Mae'r rhyddid i ymdopi yn sail i bob hawl cyfansoddiadol arall. Heb y rhyddid i ymdopi, nid oes gennych unrhyw hawliau cyfansoddiadol eraill.",
    "mintUrl": ""
  },
  "sk": {
    "id": 42,
    "language": "Sloven\u010dina",
    "languageEn": "Slovak",
    "title": "Sloboda vykon\u00e1va\u0165 transakcie",
    "explainer": "Sloboda uskuto\u010d\u0148ova\u0165 transakcie tvor\u00ed z\u00e1klad v\u0161etk\u00fdch ostatn\u00fdch \u00fastavn\u00fdch pr\u00e1v. Bez slobody uskuto\u010d\u0148ova\u0165 transakcie nem\u00e1te \u017eiadne in\u00e9 \u00fastavn\u00e9 pr\u00e1va.",
    "mintUrl": ""
  },
  "azb": {
    "id": 43,
    "language": "\u062a\u06c6\u0631\u06a9\u062c\u0647",
    "languageEn": "South Azerbaijani",
    "title": "M\u0259suliyy\u0259tli olma\u011fa azadl\u0131q",
    "explainer": "B\u00fct\u00fcn konstitusional h\u00fcquqlar\u0131n alt\u0131nda ticar\u0259t etm\u0259y\u0259 azadl\u0131q yat\u0131r. Ticar\u0259t etm\u0259y\u0259 azadl\u0131q olmadan, sizin dig\u0259r konstitusional h\u00fcquqlar\u0131n\u0131z yoxdur.",
    "mintUrl": ""
  },
  "et": {
    "id": 44,
    "language": "Eesti",
    "languageEn": "Estonian",
    "title": "Vabadus tehinguid teha",
    "explainer": "Vabadus tehingute tegemiseks on k\u00f5igi teiste p\u00f5hiseaduslike \u00f5iguste alus. Ilma vabaduseta tehinguid teha, pole teil muid p\u00f5hiseaduslikke \u00f5igusi.",
    "mintUrl": ""
  },
  "uz": {
    "id": 45,
    "language": "O\u2018zbek",
    "languageEn": "Uzbek",
    "title": "Amalga oshirishda erkinlik",
    "explainer": "Mahkamaviy huquqlar qatorining barcha boshqa huquqlari o'zgarga kelgan transaksiyalar erkinligiga asoslangan. Transaksiyalar erkinligi yo'q bo'lsa, sizda boshqa mahkamaviy huquqlar yo'q.",
    "mintUrl": ""
  },
  "kk": {
    "id": 46,
    "language": "\u049a\u0430\u0437\u0430\u049b\u0448\u0430",
    "languageEn": "Kazakh",
    "title": "\u0416\u04af\u0439\u0435\u043b\u0435\u0440 \u0430\u0440\u0430\u0441\u044b\u043d\u0434\u0430 \u0430\u0437\u0430\u0442\u0442\u044b\u049b",
    "explainer": "\u0422\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u044f \u0436\u0430\u0441\u0430\u0443\u0493\u0430 \u0430\u0440\u043d\u0430\u043b\u0493\u0430\u043d \u0435\u0440\u043a\u0456\u043d\u0434\u0456\u043a \u0431\u0430\u0440\u043b\u044b\u049b \u0431\u0430\u0441\u049b\u0430 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u049b \u049b\u04b1\u049b\u044b\u049b\u0442\u0430\u0440\u0434\u044b\u04a3 \u049b\u04b1\u0440\u044b\u043b\u044b\u043c\u044b\u043d \u049b\u04b1\u0440\u0430\u0439\u0434\u044b. \u0422\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u044f \u0436\u0430\u0441\u0430\u0443\u0493\u0430 \u0435\u0440\u043a\u0456\u043d\u0456\u04a3 \u0436\u043e\u049b \u0431\u043e\u043b\u0441\u0430, \u0441\u0456\u0437\u0434\u0435 \u0431\u0430\u0441\u049b\u0430 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u049b \u049b\u04b1\u049b\u044b\u049b\u0442\u0430\u0440 \u0436\u043e\u049b.",
    "mintUrl": ""
  },
  "be": {
    "id": 47,
    "language": "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f",
    "languageEn": "Belarusian",
    "title": "\u0421\u0432\u0430\u0431\u043e\u0434\u0430 \u0437\u0434\u0437\u0435\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u044b\u0439",
    "explainer": "\u0421\u0432\u0430\u0431\u043e\u0434\u0430 \u0437\u0434\u0437\u0435\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u044b\u0439 \u043b\u044f\u0436\u044b\u0446\u044c \u0443 \u0430\u0441\u043d\u043e\u0432\u0435 \u045e\u0441\u0456\u0445 \u0456\u043d\u0448\u044b\u0445 \u043a\u0430\u043d\u0441\u0442\u044b\u0442\u0443\u0446\u044b\u0439\u043d\u044b\u0445 \u043f\u0440\u0430\u0432\u043e\u045e. \u0411\u0435\u0437 \u0441\u0432\u0430\u0431\u043e\u0434\u044b \u0437\u0434\u0437\u0435\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u044b\u0439, \u0432\u044b \u043d\u0435 \u043c\u0430\u0435\u0446\u0435 \u0456\u043d\u0448\u044b\u0445 \u043a\u0430\u043d\u0441\u0442\u044b\u0442\u0443\u0446\u044b\u0439\u043d\u044b\u0445 \u043f\u0440\u0430\u0432\u043e\u045e.",
    "mintUrl": ""
  },
  "simple": {
    "id": 48,
    "language": "Simple English",
    "languageEn": "Simple English",
    "title": "The ability to conduct transactions without restrictions or limitations",
    "explainer": "Being able to do business freely is the foundation of all other rights in the Constitution. If you can't do business freely, then you won't have any other rights in the Constitution.",
    "mintUrl": ""
  },
  "min": {
    "id": 49,
    "language": "Baso Minangkabau",
    "languageEn": "Minangkabau",
    "title": "Kebabasan untuak Transaksi",
    "explainer": "Kemerdekaan untuk melakukan transaksi merupakan dasar dari semua hak konstitusional lainnya. Tanpa kemerdekaan untuk melakukan transaksi, Anda tidak memiliki hak konstitusional lainnya.",
    "mintUrl": ""
  },
  "el": {
    "id": 50,
    "language": "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
    "languageEn": "Greek",
    "title": "\u0395\u03bb\u03b5\u03c5\u03b8\u03b5\u03c1\u03af\u03b1 \u03b3\u03b9\u03b1 \u03a3\u03c5\u03bd\u03b1\u03bb\u03bb\u03b1\u03b3\u03ad\u03c2",
    "explainer": "\u0397 \u03b5\u03bb\u03b5\u03c5\u03b8\u03b5\u03c1\u03af\u03b1 \u03bd\u03b1 \u03c0\u03c1\u03b1\u03b3\u03bc\u03b1\u03c4\u03bf\u03c0\u03bf\u03b9\u03b5\u03af\u03c2 \u03c3\u03c5\u03bd\u03b1\u03bb\u03bb\u03b1\u03b3\u03ad\u03c2 \u03b5\u03af\u03bd\u03b1\u03b9 \u03b7 \u03b2\u03ac\u03c3\u03b7 \u03cc\u03bb\u03c9\u03bd \u03c4\u03c9\u03bd \u03ac\u03bb\u03bb\u03c9\u03bd \u03c3\u03c5\u03bd\u03c4\u03b1\u03b3\u03bc\u03b1\u03c4\u03b9\u03ba\u03ce\u03bd \u03b4\u03b9\u03ba\u03b1\u03b9\u03c9\u03bc\u03ac\u03c4\u03c9\u03bd. \u03a7\u03c9\u03c1\u03af\u03c2 \u03c4\u03b7\u03bd \u03b5\u03bb\u03b5\u03c5\u03b8\u03b5\u03c1\u03af\u03b1 \u03bd\u03b1 \u03c0\u03c1\u03b1\u03b3\u03bc\u03b1\u03c4\u03bf\u03c0\u03bf\u03b9\u03b5\u03af\u03c2 \u03c3\u03c5\u03bd\u03b1\u03bb\u03bb\u03b1\u03b3\u03ad\u03c2, \u03b4\u03b5\u03bd \u03ad\u03c7\u03b5\u03b9\u03c2 \u03ba\u03b1\u03bd\u03ad\u03bd\u03b1 \u03ac\u03bb\u03bb",
    "mintUrl": ""
  },
  "hr": {
    "id": 51,
    "language": "Hrvatski",
    "languageEn": "Croatian",
    "title": "Sloboda za transakcije",
    "explainer": "Sloboda obavljanja transakcija le\u017ei u temelju svih drugih ustavnih prava. Bez slobode obavljanja transakcija, nemate druga ustavna prava.",
    "mintUrl": ""
  },
  "lt": {
    "id": 52,
    "language": "Lietuvi\u0173",
    "languageEn": "Lithuanian",
    "title": "Laisv\u0117 atlikti sandorius",
    "explainer": "Laisv\u0117 atlikti sandorius yra pagrindas visiems kitiems konstitucin\u0117ms teis\u0117ms. Be laisv\u0117s atlikti sandorius, j\u016bs neturite joki\u0173 kit\u0173 konstitucini\u0173 teisi\u0173.",
    "mintUrl": ""
  },
  "gl": {
    "id": 53,
    "language": "Galego",
    "languageEn": "Galician",
    "title": "Libertade para realizar transacci\u00f3ns",
    "explainer": "A liberdade para realizar transacci\u00f3ns \u00e9 a base de todos os demais dereitos constitucionais. Sen a liberdade para realizar transacci\u00f3ns, non tes ning\u00fan outro dereito constitucional.",
    "mintUrl": ""
  },
  "az": {
    "id": 54,
    "language": "Az\u0259rbaycanca",
    "languageEn": "Azerbaijani",
    "title": "H\u0259r\u0259k\u0259t etm\u0259k azadl\u0131\u011f\u0131",
    "explainer": "\u018fm\u0259liyyatlar \u00fczr\u0259 azadl\u0131q dig\u0259r b\u00fct\u00fcn konstitusiya h\u00fcquqlar\u0131n\u0131n alt\u0131nda yat\u0131r. \u018fm\u0259liyyatlar \u00fczr\u0259 azadl\u0131q olmadan, sizin dig\u0259r b\u00fct\u00fcn konstitusiya h\u00fcquqlar\u0131n\u0131z yoxdur.",
    "mintUrl": ""
  },
  "ur": {
    "id": 55,
    "language": "\u0627\u0631\u062f\u0648",
    "languageEn": "Urdu",
    "title": "\u062a\u0631\u0627\u06a9\u06cc \u06a9\u06cc \u0622\u0632\u0627\u062f\u06cc",
    "explainer": "\u062a\u0631\u0627\u06a9\u0634\u0646 \u06a9\u06cc \u0622\u0632\u0627\u062f\u06cc \u062a\u0645\u0627\u0645 \u062f\u06cc\u06af\u0631 \u0622\u0626\u06cc\u0646\u06cc \u062d\u0642\u0648\u0642 \u06a9\u06cc \u0628\u0646\u06cc\u0627\u062f \u06c1\u06d2\u06d4 \u062a\u0631\u0627\u06a9\u0634\u0646 \u06a9\u06cc \u0622\u0632\u0627\u062f\u06cc \u06a9\u06d2 \u0628\u063a\u06cc\u0631\u060c \u0622\u067e \u06a9\u06d2 \u067e\u0627\u0633 \u06a9\u0648\u0626\u06cc \u062f\u06cc\u06af\u0631 \u0622\u0626\u06cc\u0646\u06cc \u062d\u0642\u0648\u0642 \u0646\u06c1\u06cc\u06ba \u06c1\u06cc\u06ba\u06d4",
    "mintUrl": ""
  },
  "sl": {
    "id": 56,
    "language": "Sloven\u0161\u010dina",
    "languageEn": "Slovenian",
    "title": "Svoboda za izvajanje transakcij",
    "explainer": "Svoboda opravljanja transakcij je temelj vseh drugih ustavnih pravic. Brez svobode opravljanja transakcij nimate nobenih drugih ustavnih pravic.",
    "mintUrl": ""
  },
  "ka": {
    "id": 57,
    "language": "\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8",
    "languageEn": "Georgian",
    "title": "\u10e2\u10e0\u10d0\u10dc\u10d6\u10d0\u10e5\u10ea\u10d8\u10d4\u10d1\u10d8\u10e1 \u10d7\u10d0\u10d5\u10d8\u10e1\u10e3\u10e4\u10da\u10d4\u10d1\u10d0",
    "explainer": "\u10e2\u10e0\u10d0\u10dc\u10e1\u10d0\u10e5\u10ea\u10d8\u10d4\u10d1\u10d8\u10e1 \u10d7\u10d0\u10d5\u10d8\u10e1\u10e3\u10e4\u10da\u10d4\u10d1\u10d0 \u10d0\u10e0\u10d8\u10e1 \u10e7\u10d5\u10d4\u10da\u10d0\u10d6\u10d4 \u10eb\u10d5\u10d4\u10da\u10d4\u10d1\u10e3\u10e0\u10d4\u10d1\u10d0\u10d7\u10d0 \u10e1\u10d0\u10e5\u10db\u10d4. \u10e2\u10e0\u10d0\u10dc\u10e1\u10d0\u10e5\u10ea\u10d8\u10d4\u10d1\u10d8\u10e1 \u10d7\u10d0\u10d5\u10d8\u10e1",
    "mintUrl": ""
  },
  "nn": {
    "id": 58,
    "language": "Nynorsk",
    "languageEn": "Norwegian (Nynorsk)",
    "title": "Fridom til \u00e5 gjennomf\u00f8re transaksjonar",
    "explainer": "Fridom til \u00e5 gjennomf\u00f8re transaksjonar ligg til grunn for alle andre grunnlovsfesta rettar. Uten fridomen til \u00e5 gjennomf\u00f8re transaksjonar, har du ingen andre grunnlovsfesta rettar.",
    "mintUrl": ""
  },
  "hi": {
    "id": 59,
    "language": "\u0939\u093f\u0928\u094d\u0926\u0940",
    "languageEn": "Hindi",
    "title": "\u0932\u0947\u0928-\u0926\u0947\u0928 \u0915\u0940 \u0938\u094d\u0935\u0924\u0902\u0924\u094d\u0930\u0924\u093e",
    "explainer": "\u0932\u0947\u0928-\u0926\u0947\u0928 \u0915\u0940 \u0938\u094d\u0935\u0924\u0902\u0924\u094d\u0930\u0924\u093e \u0938\u092d\u0940 \u0905\u0928\u094d\u092f \u0938\u0902\u0935\u0948\u0927\u093e\u0928\u093f\u0915 \u0905\u0927\u093f\u0915\u093e\u0930\u094b\u0902 \u0915\u0940 \u0906\u0927\u093e\u0930 \u0939\u0948\u0964 \u0932\u0947\u0928-\u0926\u0947\u0928 \u0915\u0940 \u0938\u094d\u0935\u0924\u0902\u0924\u094d\u0930\u0924\u093e \u0915\u0947 \u092c\u093f\u0928\u093e, \u0906\u092a\u0915\u0947 \u092a\u093e\u0938 \u0915\u094b\u0908 \u0905\u0928\u094d\u092f \u0938\u0902\u0935\u0948\u0927\u093e\u0928\u093f\u0915 \u0905\u0927\u093f\u0915\u093e\u0930 \u0928\u0939\u0940\u0902 \u0939\u0948\u0902\u0964",
    "mintUrl": ""
  },
  "th": {
    "id": 60,
    "language": "\u0e44\u0e17\u0e22",
    "languageEn": "Thai",
    "title": "\u0e40\u0e2a\u0e23\u0e35\u0e20\u0e32\u0e1e\u0e43\u0e19\u0e01\u0e32\u0e23\u0e17\u0e33\u0e18\u0e38\u0e23\u0e01\u0e23\u0e23\u0e21",
    "explainer": "\u0e40\u0e2a\u0e23\u0e35\u0e20\u0e32\u0e1e\u0e43\u0e19\u0e01\u0e32\u0e23\u0e17\u0e33\u0e18\u0e38\u0e23\u0e01\u0e23\u0e23\u0e21\u0e40\u0e1b\u0e47\u0e19\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e02\u0e2d\u0e07\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e23\u0e31\u0e10\u0e18\u0e23\u0e23\u0e21\u0e19\u0e39\u0e0d\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14 \u0e42\u0e14\u0e22\u0e44\u0e21\u0e48\u0e21\u0e35\u0e40\u0e2a\u0e23\u0e35\u0e20\u0e32\u0e1e\u0e43\u0e19\u0e01\u0e32\u0e23\u0e17\u0e33\u0e18\u0e38\u0e23\u0e01\u0e23\u0e23\u0e21 \u0e04\u0e38\u0e13\u0e08\u0e30\u0e44\u0e21\u0e48\u0e21\u0e35\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e23\u0e31\u0e10\u0e18\u0e23\u0e23\u0e21\u0e19\u0e39\u0e0d\u0e43\u0e14\u0e46",
    "mintUrl": ""
  },
  "ta": {
    "id": 61,
    "language": "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
    "languageEn": "Tamil",
    "title": "\u0baa\u0bb0\u0bbf\u0bb5\u0bb0\u0bcd\u0ba4\u0bcd\u0ba4\u0ba9\u0bc8 \u0b9a\u0bc6\u0baf\u0bcd\u0baf \u0bb5\u0bbf\u0b9f\u0bc1\u0b95\u0bcd\u0b95\u0bc8",
    "explainer": "\u0baa\u0b9f\u0bcd\u0b9f\u0bbf\u0baf\u0bb2\u0bcd \u0b89\u0bb0\u0bbf\u0bae\u0bc8\u0b95\u0bb3\u0bbf\u0ba9\u0bcd \u0baa\u0bb2\u0bcd\u0bb5\u0bc7\u0bb1\u0bc1 \u0b89\u0bb0\u0bbf\u0bae\u0bc8\u0b95\u0bb3\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0b85\u0b9f\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bc8 \u0b9a\u0bc6\u0baf\u0bb1\u0bcd\u0baa\u0bbe\u0b9f\u0bcd\u0b9f\u0bc1 \u0bb5\u0bbf\u0b9f\u0bc1\u0ba4\u0bb2\u0bc8\u0baf\u0bc1\u0bae\u0bcd \u0b89\u0bb3\u0bcd\u0bb3\u0ba4\u0bc1. \u0b9a\u0bc6\u0baf\u0bb1\u0bcd\u0baa\u0bbe\u0b9f\u0bcd\u0b9f\u0bc1 \u0bb5\u0bbf\u0b9f\u0bc1\u0ba4\u0bb2\u0bc8\u0b95\u0bcd \u0b95\u0bca\u0ba3\u0bcd\u0b9f",
    "mintUrl": ""
  },
  "la": {
    "id": 62,
    "language": "Latina",
    "languageEn": "Latin",
    "title": "Libertas ad negotiandum",
    "explainer": "Libertas agendi subiacet cunctis aliis iuribus constitutionis. Sine libertate agendi, nullum aliud ius constitutionis habes.",
    "mintUrl": ""
  },
  "bn": {
    "id": 63,
    "language": "\u09ac\u09be\u0982\u09b2\u09be",
    "languageEn": "Bengali",
    "title": "\u09b2\u09c7\u09a8\u09a6\u09c7\u09a8 \u0995\u09b0\u09be\u09b0 \u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8\u09a4\u09be",
    "explainer": "\u09b8\u0982\u09ac\u09bf\u09a7\u09be\u09a8\u09bf\u0995 \u09b8\u0995\u09b2 \u0985\u09a7\u09bf\u0995\u09be\u09b0\u09c7\u09b0 \u09ad\u09bf\u09a4\u09cd\u09a4\u09bf \u09b9\u09b2 \u09b2\u09c7\u09a8\u09a6\u09c7\u09a8\u09c7\u09b0 \u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8\u09a4\u09be\u0964 \u09b2\u09c7\u09a8\u09a6\u09c7\u09a8\u09c7\u09b0 \u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8\u09a4\u09be \u09a8\u09be \u09a5\u09be\u0995\u09b2\u09c7, \u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09a8\u09cd\u09af \u0995\u09cb\u09a8\u0993 \u09b8\u0982\u09ac\u09bf\u09a7\u09be\u09a8\u09bf\u0995 \u0985\u09a7\u09bf\u0995\u09be\u09b0 \u09a8\u09c7\u0987\u0964",
    "mintUrl": ""
  },
  "mk": {
    "id": 64,
    "language": "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438",
    "languageEn": "Macedonian",
    "title": "\u0421\u043b\u043e\u0431\u043e\u0434\u0430 \u0437\u0430 \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u0438\u0438",
    "explainer": "\u0421\u043b\u043e\u0431\u043e\u0434\u0430\u0442\u0430 \u043d\u0430 \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u0438\u0438\u0442\u0435 \u043b\u0435\u0436\u0438 \u0432\u043e \u043e\u0441\u043d\u043e\u0432\u0430\u0442\u0430 \u043d\u0430 \u0441\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u0438 \u0443\u0441\u0442\u0430\u0432\u043d\u0438 \u043f\u0440\u0430\u0432\u0430. \u0411\u0435\u0437 \u0441\u043b\u043e\u0431\u043e\u0434\u0430 \u043d\u0430 \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u0438\u0438\u0442\u0435, \u043d\u0435\u043c\u0430\u0442\u0435 \u043d\u0438\u043a\u0430\u043a\u0432\u0438 \u0434\u0440\u0443\u0433\u0438 \u0443\u0441\u0442\u0430\u0432\u043d\u0438 \u043f\u0440\u0430\u0432\u0430.",
    "mintUrl": ""
  },
  "ast": {
    "id": 65,
    "language": "Asturianu",
    "languageEn": "Asturian",
    "title": "Llibert\u00e1 pa tresaccionar",
    "explainer": "La llibert\u00e1 pa realizar transacciones ye la base de tolos dem\u00e1s derechos constitucionales. Sin la llibert\u00e1 pa realizar transacciones, nun tienes otros derechos constitucionales.",
    "mintUrl": ""
  },
  "zh-yue": {
    "id": 66,
    "language": "\u7cb5\u8a9e",
    "languageEn": "Cantonese",
    "title": "\u81ea\u7531\u9032\u884c\u4ea4\u6613",
    "explainer": "\u81ea\u7531\u4ea4\u6613\u662f\u5176\u4ed6\u5baa\u6cd5\u6743\u5229\u7684\u57fa\u7840\u3002\u5982\u679c\u6ca1\u6709\u81ea\u7531\u4ea4\u6613\uff0c\u60a8\u5c06\u6ca1\u6709\u5176\u4ed6\u5baa\u6cd5\u6743\u5229\u3002",
    "mintUrl": ""
  },
  "lld": {
    "id": 67,
    "language": "Ladin",
    "languageEn": "Ladin",
    "title": "Liberd\u00e0 de tranzazion\u00e0",
    "explainer": "La liberd\u00e0 de tranzacion i \u00e9 la basa de tutes lis \u00e0teres dretes constituzion\u00e2ls. Sens la liberd\u00e0 de tranzacion, no \u00e0s \u00e0teres dretes constituzion\u00e2ls.",
    "mintUrl": ""
  },
  "lv": {
    "id": 68,
    "language": "Latvie\u0161u",
    "languageEn": "Latvian",
    "title": "Br\u012bv\u012bba veikt dar\u012bjumus",
    "explainer": "Br\u012bv\u012bba veikt dar\u012bjumus ir pamat\u0101 visiem citiem konstitucion\u0101lajiem ties\u012bbu aktiem. Bez br\u012bv\u012bbas veikt dar\u012bjumus, Jums nav citu konstitucion\u0101lo ties\u012bbu aktu.",
    "mintUrl": ""
  },
  "tg": {
    "id": 69,
    "language": "\u0422\u043e\u04b7\u0438\u043a\u04e3",
    "languageEn": "Tajik",
    "title": "\u041e\u0437\u043e\u0434\u04e3 \u0431\u0430\u0440\u043e\u0438 \u0411\u0430\u0440\u049b\u0430\u0440\u043e\u0440 \u043a\u0430\u0440\u0434\u0430\u043d\u0438 \u043c\u0443\u0442\u043e\u0431\u0438\u049b\u0430\u0442\u04b3\u043e",
    "explainer": "\u041e\u0437\u043e\u0434\u04e3 \u0431\u0430 \u0430\u043c\u0430\u043b\u043e\u0442\u0438 \u043c\u0443\u0431\u0430\u0434\u0430\u043b\u0430\u04b3\u043e \u0430\u0441\u043e\u0441\u0438 \u04b3\u0430\u043c\u0430\u0438 \u04b3\u0443\u049b\u0443\u049b\u04b3\u043e\u0438 \u043c\u0443\u049b\u0430\u0434\u0434\u0430\u0441\u0438\u0438 \u0434\u0430\u0432\u043b\u0430\u0442\u04e3 \u0430\u0441\u0442. \u0411\u0438\u0434\u043e\u043d\u0438 \u043e\u0437\u043e\u0434\u0438\u0438 \u043c\u0443\u0431\u0430\u0434\u0430\u043b\u0430, \u04b3\u0435\u04b7 \u04b3\u0443\u049b\u0443\u049b\u0438 \u043c\u0443\u049b\u0430\u0434\u0434\u0430\u0441\u0438\u0438 \u0434\u0438\u0433\u0430\u0440 \u043d\u0430\u0434\u043e\u0440\u0435\u0434.",
    "mintUrl": ""
  },
  "af": {
    "id": 70,
    "language": "Afrikaans",
    "languageEn": "Afrikaans",
    "title": "Vryheid om te transaksioneer",
    "explainer": "Vryheid om te transaksioneer l\u00ea ten grondslag aan alle ander grondwetlike regte. Sonder die vryheid om te transaksioneer, het jy geen ander grondwetlike regte nie.",
    "mintUrl": ""
  },
  "my": {
    "id": 71,
    "language": "\u1019\u103c\u1014\u103a\u1019\u102c\u1018\u102c\u101e\u102c",
    "languageEn": "Burmese",
    "title": "\u1004\u103d\u1031\u1037\u101c\u103b\u103e\u1031\u102c\u1037\u1014\u1031\u101e\u100a\u103a\u1037\u1021\u1001\u103c\u1031\u1021\u1014\u1031\u1010\u103d\u1004\u103a\u101c\u100a\u103a\u1038 \u1021\u1001\u103c\u1031\u1021\u1014\u1031\u1015\u103c\u102f\u101c\u102f\u1015\u103a\u1014\u102d\u102f\u1004\u103a\u101b\u1014\u103a\u101c\u102d\u102f\u1021\u1015\u103a\u101e\u100a\u103a\u104b",
    "explainer": "\u1004\u103c\u1019\u103a\u1038\u101c\u1000\u103a\u1001\u1036\u101b\u101b\u103e\u102d\u1014\u102d\u102f\u1004\u103a\u101e\u1031\u102c \u1021\u1001\u103c\u1031\u1021\u1014\u1031\u1019\u103b\u102c\u1038\u1021\u102c\u1038\u101c\u102f\u1036\u1038\u1000\u102d\u102f \u1021\u1001\u1019\u1032\u1037\u1015\u103c\u102f\u101c\u102f\u1015\u103a\u1014\u102d\u102f\u1004\u103a\u101b\u1014\u103a\u1021\u1010\u103d\u1000\u103a \u1021\u1011\u1030\u1038\u101e",
    "mintUrl": ""
  },
  "mg": {
    "id": 72,
    "language": "Malagasy",
    "languageEn": "Malagasy",
    "title": "Fahaleovantena mba hahafahana mametraka vola",
    "explainer": "Ny fahalalana mba hahafahan'ny olona mandray anjara amin'ny fifidianana no manamafy ny hamafisina ny hafainganam-pirenena rehetra. Raha tsy misy ny fahalalana mba hahafahan'ny olona mandray anjara amin'ny fifidianana, dia tsy misy hafainganam-pirenena hafa aminy.",
    "mintUrl": ""
  },
  "bs": {
    "id": 73,
    "language": "Bosanski",
    "languageEn": "Bosnian",
    "title": "Sloboda za transakcije",
    "explainer": "Sloboda za transakcije le\u017ei u osnovi svih drugih ustavnih prava. Bez slobode za transakcije, nemate druga ustavna prava.",
    "mintUrl": ""
  },
  "mr": {
    "id": 74,
    "language": "\u092e\u0930\u093e\u0920\u0940",
    "languageEn": "Marathi",
    "title": "\u0935\u094d\u092f\u0935\u0939\u093e\u0930\u093e\u091a\u0940 \u0938\u094d\u0935\u093e\u0924\u0902\u0924\u094d\u0930\u094d\u092f",
    "explainer": "\u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0915\u0930\u0923\u094d\u092f\u093e\u091a\u0940 \u0938\u094d\u0935\u093e\u0924\u0902\u0924\u094d\u0930\u094d\u092f \u092e\u094d\u0939\u0923\u091c\u0947 \u0938\u0930\u094d\u0935 \u0907\u0924\u0930 \u0938\u0902\u0935\u0948\u0927\u093e\u0928\u093f\u0915 \u0939\u0915\u094d\u0915\u093e\u0902\u091a\u0940 \u092e\u0942\u0932\u092d\u0942\u0924 \u0906\u0927\u093e\u0930. \u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0915\u0930\u0923\u094d\u092f\u093e\u091a\u0940 \u0938\u094d\u0935\u093e\u0924\u0902\u0924\u094d\u0930\u094d\u092f \u0928\u0938\u0932\u094d\u092f\u093e\u0938, \u0906\u092a\u0932\u094d\u092f\u093e\u0915\u0921\u0947 \u0915\u094b\u0923\u0924\u094d\u092f\u093e\u0939\u0940 \u0907\u0924\u0930 \u0938\u0902\u0935\u0948",
    "mintUrl": ""
  },
  "sq": {
    "id": 75,
    "language": "Shqip",
    "languageEn": "Albanian",
    "title": "Liria p\u00ebr t\u00eb kryer transaksione",
    "explainer": "Liria p\u00ebr t\u00eb kryer transaksione \u00ebsht\u00eb baza e t\u00eb gjitha t\u00eb drejtave kushtetuese t\u00eb tjera. Pa lirin\u00eb p\u00ebr t\u00eb kryer transaksione, nuk keni asnj\u00eb t\u00eb drejt\u00eb kushtetuese tjet\u00ebr.",
    "mintUrl": ""
  },
  "oc": {
    "id": 76,
    "language": "Occitan",
    "languageEn": "Occitan",
    "title": "Liberatat per transaccionar",
    "explainer": "La libertat de transaccionar es la base de tots los autres dreches constitucionals. Sens la libertat de transaccionar, av\u00e8tz pas d'autres dreches constitucionals.",
    "mintUrl": ""
  },
  "nds": {
    "id": 77,
    "language": "Plattd\u00fc\u00fctsch",
    "languageEn": "Low Saxon",
    "title": "Freed to handeln",
    "explainer": "De Freiheid to transakten is de Grundlage f\u00f6r all annere Grundw\u00e4rt. Ohne de Freiheid to transakten hest du keen annere Grundw\u00e4rt.",
    "mintUrl": ""
  },
  "ml": {
    "id": 78,
    "language": "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02",
    "languageEn": "Malayalam",
    "title": "\u0d07\u0d1f\u0d2a\u0d46\u0d1f\u0d32\u0d4d\u200d\u0d15\u0d4d\u0d15\u0d4d \u0d38\u0d4d\u0d35\u0d3e\u0d24\u0d28\u0d4d\u0d24\u0d4d\u0d30\u0d4d\u0d2f\u0d02",
    "explainer": "\u0d0e\u0d32\u0d4d\u0d32\u0d3e \u0d2e\u0d31\u0d4d\u0d31\u0d41 \u0d38\u0d02\u0d35\u0d3f\u0d27\u0d3e\u0d28 \u0d39\u0d15\u0d4d\u0d15\u0d41\u0d15\u0d33\u0d41\u0d02 \u0d05\u0d1f\u0d3f\u0d38\u0d4d\u0d25\u0d3e\u0d28\u0d2e\u0d3e\u0d15\u0d4d\u0d15\u0d41\u0d28\u0d4d\u0d28 \u0d35\u0d3e\u0d23\u0d3f\u0d1c\u0d4d\u0d2f \u0d38\u0d4d\u0d35\u0d3e\u0d24\u0d28\u0d4d\u0d24\u0d4d\u0d2f\u0d02 \u0d35\u0d3f\u0d1f\u0d4d\u0d1f\u0d41\u0d2a\u0d4b\u0d15\u0d41\u0d28\u0d4d\u0d28\u0d24\u0d3f\u0d28\u0d3e\u0d7d, \u0d28\u0d3f\u0d19",
    "mintUrl": ""
  },
  "be-tarask": {
    "id": 79,
    "language": "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f (\u0442\u0430\u0440\u0430\u0448\u043a\u0435\u0432\u0456\u0446\u0430)",
    "languageEn": "Belarusian (Tara\u0161kievica)",
    "title": "\u0421\u0432\u0430\u0431\u043e\u0434\u0430 \u0437\u0434\u0437\u0435\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u044b\u0439",
    "explainer": "\u0421\u0432\u0430\u0431\u043e\u0434\u0430 \u0437\u0434\u0437\u0435\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u044b\u0439 \u043b\u044f\u0436\u044b\u0446\u044c \u0443 \u0430\u0441\u043d\u043e\u0432\u0435 \u045e\u0441\u0456\u0445 \u0456\u043d\u0448\u044b\u0445 \u043a\u0430\u043d\u0441\u0442\u044b\u0442\u0443\u0446\u044b\u0439\u043d\u044b\u0445 \u043f\u0440\u0430\u0432\u043e\u045e. \u0411\u0435\u0437 \u0441\u0432\u0430\u0431\u043e\u0434\u044b \u0437\u0434\u0437\u0435\u0439\u0441\u043d\u0435\u043d\u043d\u044f \u0442\u0440\u0430\u043d\u0441\u0430\u043a\u0446\u044b\u0439 \u043d\u044f\u043c\u0430 \u0456\u043d\u0448\u044b\u0445 \u043a\u0430\u043d\u0441\u0442\u044b\u0442\u0443\u0446\u044b\u0439\u043d\u044b\u0445 \u043f\u0440\u0430\u0432\u043e\u045e.",
    "mintUrl": ""
  },
  "te": {
    "id": 80,
    "language": "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41",
    "languageEn": "Telugu",
    "title": "\u0c32\u0c47\u0c28\u0c3f\u0c35\u0c3f \u0c1a\u0c47\u0c2f\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c4d\u0c35\u0c3e\u0c24\u0c02\u0c24\u0c4d\u0c30\u0c4d\u0c2f\u0c02",
    "explainer": "\u0c35\u0c4d\u0c2f\u0c3e\u0c2a\u0c3e\u0c30\u0c02 \u0c1a\u0c47\u0c2f\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c38\u0c4d\u0c35\u0c3e\u0c24\u0c02\u0c24\u0c4d\u0c30\u0c4d\u0c2f\u0c02 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c2e\u0c30\u0c3f\u0c15\u0c4a\u0c28\u0c4d\u0c28\u0c3f \u0c38\u0c02\u0c35\u0c3f\u0c27\u0c3e\u0c28 \u0c39\u0c15\u0c4d\u0c15\u0c41\u0c32 \u0c06\u0c27\u0c3e\u0c30\u0c02\u0c17\u0c3e \u0c09\u0c02\u0c26\u0c3f. \u0c35\u0c4d\u0c2f\u0c3e\u0c2a\u0c3e\u0c30",
    "mintUrl": ""
  },
  "ky": {
    "id": 81,
    "language": "\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430",
    "languageEn": "Kirghiz",
    "title": "\u0418\u0448\u0442\u0435\u0440\u0434\u0438 \u0436\u0430\u043a\u0442\u044b\u0440\u0443\u0443 \u04e9\u0437\u0433\u04e9\u0440\u0442\u04af\u04af\u0433\u04e9 \u043a\u04e9\u0440\u04e9\u04e9\u043d\u04af\u043d \u0442\u0430\u043d\u0434\u043e\u043e",
    "explainer": "\u0418\u0448\u0442\u0435\u0440\u0434\u0438\u043a\u0442\u0435\u043d \u043a\u044b\u0439\u0440\u044b\u043a\u0442\u0443\u0443 \u044d\u0440\u043a\u0438\u043d\u0434\u0438\u0433\u0438 \u0431\u0430\u0440\u0434\u044b\u043a \u0431\u0430\u0448\u043a\u0430 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u043a \u0443\u043a\u0443\u043a\u0442\u0430\u0440\u0434\u044b\u043d \u0430\u043b\u0434\u044b\u043d \u0430\u043b\u044b\u043d\u0430\u0442. \u0418\u0448\u0442\u0435\u0440\u0434\u0438\u043a\u0442\u0435\u043d \u043a\u044b\u0439\u0440\u044b\u043a\u0442\u0443\u0443 \u044d\u0440\u043a\u0438\u043d \u0436\u043e\u043a \u0431\u043e\u043b\u0441\u043e, \u0431\u0430\u0448\u043a\u0430 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u043a \u0443\u043a\u0443\u043a\u0442\u0430\u0440\u044b\u04a3\u044b\u0437 \u0436\u043e\u043a.",
    "mintUrl": ""
  },
  "br": {
    "id": 82,
    "language": "Brezhoneg",
    "languageEn": "Breton",
    "title": "Frankiz da veza\u00f1 degaset a-benn obererezhio\u00f9",
    "explainer": "Frankiz da obererezh er c'halleriezh a zo an diazez a-raok pep holl gwirio\u00f9 konstituzionel all. Hep frankiz da obererezh, n'oc'h ket aotreus gwirio\u00f9 konstituzionel all.",
    "mintUrl": ""
  },
  "sw": {
    "id": 83,
    "language": "Kiswahili",
    "languageEn": "Swahili",
    "title": "Uhuru wa Kufanya Biashara",
    "explainer": "Uhuru wa kufanya shughuli za biashara ndio msingi wa haki zote za katiba. Bila uhuru wa kufanya shughuli za biashara, huna haki nyingine yoyote ya katiba.",
    "mintUrl": ""
  },
  "jv": {
    "id": 84,
    "language": "Basa Jawa",
    "languageEn": "Javanese",
    "title": "Kebebasan kanggo Transaksi",
    "explainer": "Kebebasan transaksi mendasari semua hak konstitusional lainnya. Tanpa kebebasan untuk bertransaksi, Anda tidak memiliki hak konstitusional lainnya.",
    "mintUrl": ""
  },
  "new": {
    "id": 85,
    "language": "\u0928\u0947\u092a\u093e\u0932 \u092d\u093e\u0937\u093e",
    "languageEn": "Newar / Nepal Bhasa",
    "title": "\u0935\u094d\u092f\u0935\u0939\u093e\u0930 \u0917\u0930\u094d\u0928 \u0938\u094d\u0935\u0924\u0928\u094d\u0924\u094d\u0930\u0924\u093e",
    "explainer": "\u0938\u0902\u0935\u093f\u0927\u093e\u0928\u093f\u0915 \u0905\u0927\u093f\u0915\u093e\u0930\u0939\u0930\u0942\u0915\u094b \u0938\u092c\u0948\u092d\u0928\u094d\u0926\u093e \u092e\u0942\u0932\u092d\u0942\u0924 \u0906\u0927\u093e\u0930 \u0932\u0947\u0916\u0928 \u0915\u094d\u0937\u092e\u0924\u093e \u0939\u094b\u0964 \u0932\u0947\u0916\u0928 \u0915\u094d\u0937\u092e\u0924\u093e \u0915\u094b \u092c\u093f\u0928\u093e\u0915\u094b \u0938\u0902\u0935\u093f\u0927\u093e\u0928\u093f\u0915 \u0905\u0927\u093f\u0915\u093e\u0930\u0939\u0930\u0942 \u091b\u0948\u0928\u0928\u094d\u0964",
    "mintUrl": ""
  },
  "vec": {
    "id": 86,
    "language": "V\u00e8neto",
    "languageEn": "Venetian",
    "title": "Libert\u00e0 de trasacionar",
    "explainer": "La libert\u00e0 de far transazioni sotovento tute le altre diriti costituzionali. Senza la libert\u00e0 de far transazioni, no ghe xe altri diriti costituzionali.",
    "mintUrl": ""
  },
  "pnb": {
    "id": 87,
    "language": "\u0634\u0627\u06c1 \u0645\u06a9\u06be\u06cc \u067e\u0646\u062c\u0627\u0628\u06cc (Sh\u0101hmukh\u012b Pa\u00f1j\u0101b\u012b)",
    "languageEn": "Western Panjabi",
    "title": "\u0a32\u0a48\u0a23-\u0a26\u0a47\u0a23 \u0a32\u0a08 \u0a06\u0a1c\u0a3e\u0a26\u0a40 (Lain-den lai azaadi)",
    "explainer": "\u0a32\u0a48\u0a23-\u0a26\u0a47\u0a23 \u0a32\u0a08 \u0a06\u0a1c\u0a3e\u0a26\u0a40 \u0a38\u0a2d \u0a39\u0a4b\u0a30 \u0a38\u0a70\u0a35\u0a48\u0a27\u0a3e\u0a28\u0a3f\u0a15 \u0a39\u0a71\u0a15\u0a3e\u0a02 \u0a26\u0a47 \u0a05\u0a27\u0a40\u0a28 \u0a39\u0a41\u0a70\u0a26\u0a40 \u0a39\u0a48\u0964 \u0a32\u0a48\u0a23-\u0a26\u0a47\u0a23 \u0a32\u0a08 \u0a06\u0a1c\u0a3e\u0a26\u0a40 \u0a28\u0a3e \u0a39\u0a4b\u0a35\u0a47 \u0a24\u0a3e\u0a02 \u0a24\u0a41\u0a38\u0a40\u0a02 \u0a15",
    "mintUrl": ""
  },
  "ht": {
    "id": 88,
    "language": "Kr\u00e8yol ayisyen",
    "languageEn": "Haitian",
    "title": "Lib\u00e8te pou f\u00e8 transaksyon",
    "explainer": "Lib\u00e8te pou f\u00e8 transaksyon anba li tout l\u00f2t dwa konstitisyon\u00e8l. San lib\u00e8te pou f\u00e8 transaksyon, ou pa gen okenn l\u00f2t dwa konstitisyon\u00e8l.",
    "mintUrl": ""
  },
  "pms": {
    "id": 89,
    "language": "Piemont\u00e8is",
    "languageEn": "Piedmontese",
    "title": "Libert\u00e0 'd transazi\u00f2ne",
    "explainer": "La libert\u00e0 'd transazion sotaian t\u00f2cc ij \u00e0utri drej \u00ebd la constitussion. Senza la libert\u00e0 'd transazion, a l'\u00e9 nen pi\u00f2 propi dr\u00e9 \u00ebd \u00e0utri drej costituziunaj.",
    "mintUrl": ""
  },
  "ba": {
    "id": 90,
    "language": "\u0411\u0430\u0448\u04a1\u043e\u0440\u0442",
    "languageEn": "Bashkir",
    "title": "\u0422\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u044f\u04a1\u0430 \u0430\u0437\u0430\u0442\u043b\u044b\u043a",
    "explainer": "\u0422\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u044f \u0431\u0443\u043b\u0443\u0443 \u04a1\u0443\u0493\u044b\u043b\u044b\u0448\u0442\u044b\u04a3 \u0431\u0430\u0440\u043b\u044b\u04a1 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u04a1 \u04bb\u0430\u043a\u0442\u0430\u0440\u044b\u043d \u0430\u0441\u044b\u043f \u0442\u0443\u0440\u0430. \u0422\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u044f \u04bb\u0430\u043a\u044b\u043d\u0430\u043d \u0442\u0430\u0431\u044b\u0493\u044b\u0499, \u0431\u0430\u0448\u04a1\u0430 \u043a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0438\u044f\u043b\u044b\u04a1 \u04bb\u0430\u043a\u0442\u0430\u0440\u044b\u0493\u044b\u0499 \u0439\u04d9\u0448\u0435\u0440 \u0431\u0443\u043b\u043c\u044b\u0439.",
    "mintUrl": ""
  },
  "lb": {
    "id": 91,
    "language": "L\u00ebtzebuergesch",
    "languageEn": "Luxembourgish",
    "title": "Fr\u00e4iheet fir ze transaktioun\u00e9ieren",
    "explainer": "Fr\u00e4iheet fir Transaktiounen leit all aner Verfassungsrechter zougrond. Ohne d'Fr\u00e4iheet fir Transaktiounen hues du keng aner Verfassungsrechter.",
    "mintUrl": ""
  },
  "su": {
    "id": 92,
    "language": "Basa Sunda",
    "languageEn": "Sundanese",
    "title": "Kebebasan Kanggo Ngadamel",
    "explainer": "Kebebasan kanggo ngadamel transaksi ngalakukeun sadaya hak konstitusional lianna. Tanpa kebebasan kanggo ngadamel transaksi, anjeun teu gaduh hak konstitusional lianna.",
    "mintUrl": ""
  },
  "ku": {
    "id": 93,
    "language": "Kurd\u00ee / \u0643\u0648\u0631\u062f\u06cc",
    "languageEn": "Kurdish",
    "title": "Azadiya Bazirganiy\u00ea",
    "explainer": "Azadiya l\u00eager\u00eena maf\u00ean dest\u00fbr\u00ee hem\u00ee maf\u00ean din \u00ean dest\u00fbr\u00eeya wey\u00ee. B\u00ea azadiya l\u00eager\u00eena maf\u00ean dest\u00fbr\u00ee, h\u00fbn maf\u00ean din \u00ean dest\u00fbr\u00ee tune ne.",
    "mintUrl": ""
  },
  "ga": {
    "id": 94,
    "language": "Gaeilge",
    "languageEn": "Irish",
    "title": "Saor\u00e1nacht le Hothruithe a Dh\u00e9anamh",
    "explainer": "Saoirse chun tranc\u00e1il faoi bhun gach ceart bunreacht\u00fail eile. Gan an saoirse chun tranc\u00e1il, n\u00edl aon chearta bunreacht\u00fala eile agat.",
    "mintUrl": ""
  },
  "lmo": {
    "id": 95,
    "language": "Lumbaart",
    "languageEn": "Lombard",
    "title": "Libert\u00e0 de transazion",
    "explainer": "La libert\u00e0 de f\u00e0 transazioni sota-costa tuti j'\u00e0ter drit constitutional. Senza la libert\u00e0 de f\u00e0 transazioni, ti n'ha minga \u00e0ter drit constitutional.",
    "mintUrl": ""
  },
  "szl": {
    "id": 96,
    "language": "\u015al\u016fnski",
    "languageEn": "Silesian",
    "title": "Swoboda do przeprowadzania transakcji",
    "explainer": "Wola do handlowania le\u017cy po\u0142o\u017ey\u0144y pod w\u0161yskimi inkszych prawami konstytucyjnimi. Bez wolno\u015bci do handlowania niy masz inkszych praw konstytucyjnych.",
    "mintUrl": ""
  },
  "is": {
    "id": 97,
    "language": "\u00cdslenska",
    "languageEn": "Icelandic",
    "title": "Frelsi til vi\u00f0skipta",
    "explainer": "Frelsi til vi\u00f0skipta liggur a\u00f0 baki \u00f6llum \u00f6\u00f0rum stj\u00f3rnarskr\u00e1r- og mannr\u00e9ttindum. \u00c1n frelsis til vi\u00f0skipta hefur \u00fe\u00fa engin \u00f6nnur stj\u00f3rnarskr\u00e1r- og mannr\u00e9ttindi.",
    "mintUrl": ""
  },
  "fy": {
    "id": 98,
    "language": "Frysk",
    "languageEn": "West Frisian",
    "title": "Frijheid om te transaksjonearjen",
    "explainer": "Frijheid om te transaksjearjen leit oan de basis fan alle oare gr\u00fbnwetlike rjochten. S\u00fbnder de frijheid om te transaksjearjen, hawwe jo gjin oare gr\u00fbnwetlike rjochten.",
    "mintUrl": ""
  },
  "cv": {
    "id": 99,
    "language": "\u0427\u0103\u0432\u0430\u0448",
    "languageEn": "Chuvash",
    "title": "\u0427\u04d1\u0432\u0430\u0448\u043b\u0430: \u0428\u04d7\u043d \u0447\u0115\u0440\u043b\u0435 \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438 \u0442\u0443\u0445\u0430\u043b\u043b\u0430 \u04ab\u044b\u0440\u0115\u043a",
    "explainer": "\u041f\u04d1\u0445\u04d1\u043d \u0430\u043d\u0430\u0432\u043d\u04d1 \u043a\u0443\u043b\u04d1\u043c\u043f\u0430\u0445\u04d7\u0440 \u043f\u0443\u043b\u0103\u0448\u043c\u0430 \u0445\u0443\u0441\u0443\u0441\u0438\u043d\u0447\u0435 \u043f\u0440\u0430\u0432\u0442\u0430\u0440\u0430\u0445 \u043f\u0443\u043b\u0103\u0448\u0442\u044b\u0440. \u041f\u04d7\u043b\u043f\u0435 \u043f\u0443\u043b\u0103\u0448\u043c\u0430 \u0445\u0443\u0441\u0443\u0441\u0438\u043d\u0447\u0435 \u043f\u0440\u0430\u0432\u0442\u0430\u0440\u0430\u0445 \u043f\u0443\u043b\u0103\u0448\u0442\u044b\u0440, \u043d\u0438\u04ab\u04d7\u04ab\u0435 \u0445\u0443\u0441\u0443\u0441\u0438\u043d\u0447\u0435 \u043f\u0440\u0430\u0432\u0442\u0430\u0440\u0430\u0445 \u043f\u0443\u043b\u0103\u0448\u0442\u044b\u0440.",
    "mintUrl": ""
  },
  "ckb": {
    "id": 100,
    "language": "Soran\u00ee / \u06a9\u0648\u0631\u062f\u06cc",
    "languageEn": "Sorani",
    "title": "\u0626\u0627\u0632\u0627\u062f\u06cc\u06cc\u06d5\u06a9\u0627\u0646\u06cc \u06af\u06c6\u0695\u06cc\u0646\u06cc \u06a9\u0627\u0631\u062a\u06d5\u06a9\u0627\u0646",
    "explainer": "\u0626\u0627\u0632\u0627\u062f\u06cc\u06cc \u067e\u0627\u0631\u06d5\u062f\u0627\u0646\u060c \u0628\u0646\u0686\u06cc\u0646\u06d5\u06cc \u062f\u06cc\u0627\u0631\u06cc\u06cc \u062f\u06cc\u06af\u0631\u06cc \u0642\u0627\u0646\u0648\u0646\u06cc\u06cc\u06d5\u06a9\u0627\u0646 \u0628\u06d5\u0634\u06ce\u0648\u06d5\u06cc\u06d5\u06a9\u06cc \u0628\u0627\u0633 \u0644\u06d5 \u0647\u06d5\u0645\u0648\u0648 \u062d\u0642\u06d5\u06a9\u0627\u0646\u06cc \u0642\u0627\u0646\u0648\u0646\u06cc\u06cc\u06d5\u06a9\u0627\u0646 \u062f\u06d5\u06a9\u0627\u062a. \u0628\u06d5\u0628\u06ce \u0626\u0627\u0632\u0627\u062f\u06cc\u06cc \u067e\u0627\u0631\u06d5\u062f\u0627\u0646\u060c \u0647\u06cc\u0686 \u062d\u0642\u06ce\u06a9\u06cc \u0642\u0627\u0646\u0648\u0646\u06cc\u06cc\u06d5\u06a9\u0627\u0646 \u0646\u06cc\u06cc\u06d5.",
    "mintUrl": ""
  },
}
