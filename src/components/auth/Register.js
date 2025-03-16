import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Form, Button, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
      setIsRegistered(true); // Trigger success animation
    } catch (err) {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="w-100 d-flex justify-content-center"
      >
        <Card className="auth-card p-4">
          {isRegistered ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div 
                initial={{ rotate: -10 }} 
                animate={{ rotate: 10 }} 
                transition={{ yoyo: Infinity, duration: 0.5 }}
              >
                🎉
              </motion.div>
              <h2 className="text-success">Registration Successful!</h2>
              <p>You can now <Link to="/login">Login</Link> to your account.</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-center mb-3">Create an Account</h2>
              <p className="text-center text-muted">Sign up to start splitting expenses</p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Create a password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" variant="success" className="w-100 mt-3" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                  </Button>
                </motion.div>
              </Form>

              <Row className="mt-3 text-center">
                <Col>
                  <p>Already have an account? <Link to="/login">Login</Link></p>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default Register;
