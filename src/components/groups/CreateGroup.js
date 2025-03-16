import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../store/groupSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const CreateGroup = () => {
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState(""); // Comma-separated emails
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Group name is required!");
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim());
    dispatch(createGroup({ name: groupName, members: emailList }))
      .catch(() => toast.error("Failed to create group"));

    setGroupName("");
    setEmails("");
    navigate("/dashboard");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <h3 className="mb-3 text-center">Create Group</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Group Name</label>
            <input
              type="text"
              className="form-control"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Invite Friends (Emails, comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Group</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
