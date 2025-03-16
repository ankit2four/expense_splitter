import { useState, useContext } from "react";
import { Tab, Nav, Dropdown } from "react-bootstrap";
import GroupList from "../components/GroupList";
import CreateGroup from "../components/groups/CreateGroup";
import ExpenseLadder from "../components/ExpenseLadder";
import AuthContext from "../context/AuthContext"; // Import Auth Context
import "./GroupPage.css";


const GroupPage = () => {
  const { user, logout } = useContext(AuthContext); // Get user & logout function
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  return (
    <div className="container mt-5 position-relative">
      {/* Profile Button in Top Right */}
      {user && (
        <div className="position-absolute top-0 end-0 mt-0 me-2">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-primary"
              className="rounded-circle d-flex align-items-center justify-content-center shadow"
              style={{
                width: "40px",
                height: "40px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {user.name[0].toUpperCase()} {/* First letter of username */}
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow">
              <Dropdown.Header className="text-center">
                <strong>{user.name}</strong> <br />
                <small className="text-muted">{user.email}</small>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="text-danger text-center">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {!selectedGroupId ? (
        <Tab.Container defaultActiveKey="groups">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="groups" className="fw-bold">My Groups</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="create"  className="fw-bold">Create Group</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="mt-4">
          <Tab.Pane eventKey="groups">
  <GroupList onSelectGroup={setSelectedGroupId} />
</Tab.Pane>

            <Tab.Pane eventKey="create">
              <CreateGroup />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      ) : (
        <ExpenseLadder groupId={selectedGroupId} onBack={() => setSelectedGroupId(null)} />
      )}
    </div>
  );
};

export default GroupPage;
