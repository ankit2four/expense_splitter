import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    { title: "Real-time Expense Tracking", text: "Monitor and split expenses with ease.", delay: 0.2 },
    { title: "Edit Payments", text: "Set payments as paid", delay: 0.4 },
    { title: "Group Management", text: "Organize expenses efficiently within groups.", delay: 0.6 },
    { title: "Detailed Analytics", text: "View insights into spending patterns.", delay: 0.8 }
  ];

  return (
    <section className="features-section">
      <Container>
        <h2 className="text-center mb-4">Why Choose Expense Splitter?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={3} key={index}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: feature.delay }}
              >
                <Card className="feature-card text-center p-3">
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features;
