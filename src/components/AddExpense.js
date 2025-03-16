import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createExpense, fetchExpenses } from "../store/expenseSlice";

const AddExpense = ({ groupId, show, handleClose }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) =>
    state.groups.groups.find((g) => g.id === groupId)?.members || []
  );

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  // Initialize splits when members change
  useEffect(() => {
    if (members.length > 0) {
      setSplits(
        members.map((member) => ({
          memberId: member._id,
          amount: 0,
        }))
      );
    }
  }, [members]);

  // Handle input changes for custom split amounts
  const handleSplitChange = (index, value) => {
    const updatedSplits = [...splits];
    updatedSplits[index].amount = parseFloat(value) || 0;
    setSplits(updatedSplits);
  };

  // Calculate participants for the expense
  const calculateParticipants = () => {
    if (splitType === "equal") {
      const amountOwed = parseFloat(amount) / members.length;
      return members.map((member) => ({
        memberId: member._id,
        amountOwed,
        status: "unpaid",
      }));
    } else {
      return splits.map((split) => ({
        memberId: split.memberId,
        amountOwed: parseFloat(split.amount) || 0,
        status: "unpaid",
      }));
    }
  };

  // Submit Expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setError(null);

    if (!description || !amount || amount <= 0 || members.length === 0) {
      setError("Please enter valid details.");
      return;
    }

    const participants = calculateParticipants();

    const expenseData = {
      groupId,
      description,
      amount: parseFloat(amount),
      splitType,
      splits: splitType === "equal" ? [] : splits,
      participants, // Add participants list here
    };

    setLoading(true);
    try {
      await dispatch(createExpense(expenseData));
      handleClose(); // Close modal on success
    } catch (err) {
      setError("Failed to add expense. Try again.");
    } finally {
      setLoading(false);
      dispatch(fetchExpenses(groupId));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered animation>
      <Modal.Header closeButton>
        <Modal.Title>Add Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          {/* Amount */}
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
              />
            </InputGroup>
          </Form.Group>

          {/* Split Type */}
          <Form.Group className="mb-3">
            <Form.Label>Split Type</Form.Label>
            <Form.Select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
              <option value="equal">Equal</option>
              <option value="custom">Custom</option>
            </Form.Select>
          </Form.Group>

          {/* Custom Splits */}
          {splitType === "custom" && (
            <div>
              <h6>Enter individual shares:</h6>
              {members.map((member, index) => (
                <InputGroup className="mb-2" key={member._id}>
                  <InputGroup.Text>{member.name}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="0"
                    value={splits[index]?.amount || 0}
                    onChange={(e) => handleSplitChange(index, e.target.value)}
                    required
                  />
                </InputGroup>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddExpense;
