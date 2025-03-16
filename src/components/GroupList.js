import { useEffect, useState } from "react";
import { Card, Button, Dropdown, ListGroup, Modal, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups, addMember, removeMember, pinGroup, deleteGroup } from "../store/groupSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure this is imported!


const getRandomLightColor = () => {
  const colors = [
    "#f8f9fa", // Light gray
    "#e3f2fd", // Light blue
    "#f1f8e9", // Light green
    "#fff3e0", // Light orange
    "#fce4ec", // Light pink
    "#ede7f6", // Light purple
    "#f0f4c3", // Light lime
    "#f5f5f5", // Light grayish white
    "#fffde7", // Light yellow
    "#f3e5f5", // Light lavender
    "#e8f5e9", // Light mint green
    "#e1f5fe", // Light sky blue
    "#fff1f3", // Light blush pink
    "#f4e1d2", // Light peach
    "#e3f4e1", // Pale green
    "#f1e1f3", // Light lilac
    "#c8e6c9", // Pale teal
    "#bbdefb", // Soft blue
    "#fff8e1", // Pale butter yellow
    "#fbe9e7", // Soft coral
  ]
  ;
  return colors[Math.floor(Math.random() * colors.length)];
};

const GroupList = ({ onSelectGroup }) => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups);
  const loading = useSelector((state) => state.groups.loading);
  const error = useSelector((state) => state.groups.error);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleAction = async (action, groupId, memberId = null) => {
    try {
      switch (action) {
        case "add":
          if (memberEmail.trim()) {
            await dispatch(addMember({ groupId, email: memberEmail })).unwrap();
            setMemberEmail("");
            setShowAddModal(false);
            dispatch(fetchGroups());
          }
          break;
        case "remove":
          if (memberId) {
            await dispatch(removeMember({ groupId, memberId })).unwrap();
            setShowManageModal(false);
            dispatch(fetchGroups());
          }
          break;
        case "pin":
          await dispatch(pinGroup(groupId)).unwrap();
          dispatch(fetchGroups());
          break;
        case "delete":
          await dispatch(deleteGroup(groupId)).unwrap();
          dispatch(fetchGroups());
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  return (
    <div className="container">
      {loading && <p className="text-center">Loading groups...</p>}
      {error && <p className="text-danger text-center">Error: {error}</p>}
      {!loading && !error && groups.length === 0 && <p className="text-center">No groups found.</p>}

      <Row className="g-4"> {/* Responsive Grid Row with Gutter */}
        {groups.map((group) => (
          <Col key={group._id} xs={12} sm={6} md={4} lg={3}> 
            <Card 
  className="shadow-sm border-0 h-100 p-2 rounded-3 m-4"
  style={{
    cursor: "pointer", 
    backgroundColor: getRandomLightColor(),
    transition: "transform 0.2s ease-in-out",
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.01)"}
  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
>
  <Card.Body className="d-flex flex-column justify-content-between h-100">
    {/* Top Section: Title & Three-Dot Menu */}
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <Card.Title onClick={() => onSelectGroup(group._id)} className="fw-bold ">{group.name.toUpperCase()}</Card.Title>
      </div>
      <Dropdown align="end" flip={false} container="body">
  <Dropdown.Toggle
    variant="light"
    className="border-0 d-flex align-items-center justify-content-center"
    style={{
      width: "36px",
      height: "36px",
      fontSize: "22px",
      borderRadius: "50%",
      backgroundColor: "transparent",
    }}
  >
    &#x22EE;
  </Dropdown.Toggle>
  <Dropdown.Menu 
    style={{ zIndex: 9999, position: "absolute", transform: "translate3d(0px, 38px, 0px) !important" }}
    className="shadow-lg"
  >
    <Dropdown.Item onClick={() => { setSelectedGroup(group._id); setShowAddModal(true); }}>
      Add Member
    </Dropdown.Item>
    <Dropdown.Item onClick={() => { setSelectedGroup(group._id); setShowManageModal(true); }}>
      Manage Members
    </Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item onClick={() => handleAction("pin", group._id)}>
      {group.isPinned ? "Unpin Group" : "Pin Group"}
    </Dropdown.Item>
    <Dropdown.Item className="text-danger" onClick={() => handleAction("delete", group._id)}>
      Delete Group
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

    </div>
    {/* Group Owner & Creation Time */}
    <div  onClick={() => onSelectGroup(group._id)} className="mt-2 mb-2">
      <Card.Subtitle className="text-muted small">
        Owner: <strong>{group.createdBy.name}</strong>
      </Card.Subtitle>
      <Card.Text className="text-muted small">
        {new Date(group.createdAt).toLocaleString()}
      </Card.Text>
    </div>

    {/* Members Section */}
    <div onClick={() => onSelectGroup(group._id)} className="mt-2">
      <Card.Subtitle className="text-muted small mb-1">Members:</Card.Subtitle>
      <div className="d-flex flex-wrap gap-2">
        {group.members.map((member) => (
          <span key={member._id} className="badge bg-light text-dark px-2 py-1">
            {member.name}
          </span>
        ))}
      </div>
    </div>
  </Card.Body>
</Card>

          </Col>
        ))}
      </Row>

      {/* Add Member Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered backdrop="static">
        <Modal.Body className="p-4 text-center">
          <h5 className="fw-bold mb-3">Add Member</h5>
          <Form.Control
            type="email"
            placeholder="Enter member's email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="mb-3"
          />
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={() => handleAction("add", selectedGroup)}>Add</Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Manage Members Modal */}
      <Modal show={showManageModal} onHide={() => setShowManageModal(false)} centered backdrop="static">
        <Modal.Body className="p-4">
          <h5 className="fw-bold mb-3 text-center">Manage Members</h5>
          <ListGroup>
            {groups.find((group) => group._id === selectedGroup)?.members.map((member) => (
              <ListGroup.Item key={member._id} className="d-flex justify-content-between align-items-center">
                {member.name}
                <Button variant="danger" size="sm" onClick={() => handleAction("remove", selectedGroup, member._id)}>
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="d-flex justify-content-center mt-3">
            <Button variant="secondary" onClick={() => setShowManageModal(false)}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GroupList;
