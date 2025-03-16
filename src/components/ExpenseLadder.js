import { useEffect, useState } from "react";
import { Card, Button, ListGroup, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, markExpensePaid } from "../store/expenseSlice";
import { FaPlus } from "react-icons/fa"; // Import Plus icon

import AddExpense from "./AddExpense"; // Import AddExpense component

const ExpenseLadder = ({ groupId, onBack }) => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const loading = useSelector((state) => state.expenses.loading);
  const error = useSelector((state) => state.expenses.error);
  const [showAddExpense, setShowAddExpense] = useState(false); // State for Add Expense modal

  useEffect(() => {
    if (groupId) {
      dispatch(fetchExpenses(groupId));
    }
  }, [dispatch, groupId]);

  const handleMarkPaid = async (expenseId, memberId = null) => {
    try {
      await dispatch(markExpensePaid({ expenseId, memberId })).unwrap();
      dispatch(fetchExpenses(groupId)); // Refresh expenses after marking as paid
    } catch (error) {
      console.error("Error marking expense as paid:", error);
    }
  };

  return (
    <div className="container mt-4 position-relative" style={{ maxWidth: "720px", margin: "0 auto" }}>
      <Button
        variant="outline-dark"
        onClick={onBack}
        className="mb-3 d-flex align-items-center gap-2 shadow-sm px-3 py-2"
        style={{
          borderRadius: "8px",
          fontWeight: "500",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <i className="bi bi-arrow-left"></i> Back to Groups
      </Button>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">Error: {error}</p>
      ) : expenses.length === 0 ? (
        <p className="text-center">No expenses found for this group.</p>
      ) : (
        expenses.map((expense) => (
          <Card
            key={expense._id}
            className="mb-4 shadow-lg border-0" // Increased gap (mb-4) and more shadow (shadow-lg)
            style={{
              maxWidth: "100%",
            }}
          >
            <Card.Body className="p-4">
              <Card.Title className="fw-bold fs-4 text-primary">{expense.description.toUpperCase()}</Card.Title>
              <Card.Subtitle className="text-muted mb-3">
                <strong>Created by:</strong> {expense.createdBy.name}
              </Card.Subtitle>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <strong>Amount:</strong> <Badge bg="primary">${expense.amount}</Badge>
                </h5>
                <h6 className="mb-0 text-muted">
                  <strong>Split Type:</strong> {expense.splitType.charAt(0).toUpperCase() + expense.splitType.slice(1)}
                </h6>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div>
                  <strong>Participants:</strong>
                </div>
                <div>
                  <strong>Total Paid: </strong>
                  <Badge bg="success">
                    {expense.participants.filter(p => p.status === "paid").length} / {expense.participants.length}
                  </Badge>
                </div>
              </div>

              <ListGroup className="mt-3">
                {expense.participants.map((participant) => (
                  <ListGroup.Item key={participant.memberId._id} className="d-flex justify-content-between">
                    {participant.memberId.name}
                    {participant.status === "paid" ? (
                      <Badge bg="success">Paid</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleMarkPaid(expense._id, participant.memberId._id)}
                      >
                        Mark as Paid
                      </Button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Button
              className=" mt-1"
                size="sm"
                variant="outline-success"
                onClick={() => handleMarkPaid(expense._id, null)}
              >
                Mark as Paid by All
              </Button>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Add Expense Floating Button */}
      <Button
        variant="primary"
        className="position-fixed d-flex align-items-center justify-content-center rounded-circle shadow-lg"
        style={{
          width: "60px",
          height: "60px",
          right: "30px",
          bottom: "30px",
          zIndex: 1050,
          fontSize: "24px",
        }}
        onClick={() => setShowAddExpense(true)}
        title="Add Expense" // Tooltip on hover
      >
        <FaPlus /> {/* Plus icon */}
      </Button>

      {/* Add Expense Modal */}
      <AddExpense groupId={groupId} show={showAddExpense} handleClose={() => setShowAddExpense(false)} />
    </div>
  );
};

export default ExpenseLadder;
