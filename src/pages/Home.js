import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "./Home.css";
import Features from "../components/Features";
import CustomNavbar from "../components/Common/Navbar";


const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home-page"
    >
        <CustomNavbar />
      {/* Hero Section */}
      <section className="hero text-center text-white">
        <Container>
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Split Expenses, Simplified!
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Track shared expenses, settle up, and manage group spending easily.
          </motion.p>
          <div className="cta-buttons">
            <Link to="/register">
              <Button variant="primary" size="lg" className="me-3">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline-light" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <Container>
          <h2 className="text-center mb-4">How It Works</h2>
          <Row className="justify-content-center">
            {[
              { title: "Create a Group", text: "Invite friends & start tracking.", delay: 0.2 },
              { title: "Add Expenses", text: "Split bills fairly & keep records.", delay: 0.4 },
              { title: "Settle Payments", text: "Mark expenses as paid & settle balances.", delay: 0.6 }
            ].map((step, index) => (
              <Col md={4} key={index}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: step.delay }}
                >
                  <Card className="step-card text-center p-4">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
        <Features/>
      </section>

      {/* Footer */}
      <footer className="footer text-center text-white py-3">
        <p>© 2025 Expense Splitter. All rights reserved.</p>
      </footer>
    </motion.div>
  );
};

export default Home;
