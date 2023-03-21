import styles from "./Header.module.scss";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

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
