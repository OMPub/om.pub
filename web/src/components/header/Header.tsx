import styles from "./Header.module.scss";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useRouter } from "next/router";

function formatAddress(address: any) {
  if (!address || !address.startsWith("0x")) {
    return address;
  }
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

interface Props {
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export default function Header(props: Props) {
  const router = useRouter();
  const ensResolution = useEnsName({
    address: props.address,
    enabled: true,
  });
  const ensAvatar = useEnsAvatar({ address: props.address });

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className={`${styles.header} pt-4 pb-4`}>
      <Container>
        <Navbar.Brand href="/">
          <h3>The OM Pub</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link
              href="/faq"
              className={router.pathname == "/faq" ? styles.linkActive : ""}>
              FAQ
            </Nav.Link>
            <Nav.Link
              href="/contact"
              className={
                router.pathname == "/contact" ? styles.linkActive : ""}>
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
