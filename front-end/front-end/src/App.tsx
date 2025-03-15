import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [leads, setLeads] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]); // List of agents
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // Function to fetch leads
  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLeads(data?.data?.leads);
        setAgents(data?.data?.agents);
      } else {
        alert("Failed to fetch leads");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while fetching leads");
    }
  };

  // Function to handle agent assignment
  const assignAgent = async (leadId: number, agentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/leads/${leadId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            agentId,
            followUpStatus: "Pending", // Example values, modify as necessary
            preferredPropertyType: "Apartment",
            budget: 300000,
            notes: "Looking for a 2-bedroom apartment",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchLeads(); // Refresh the leads after assigning
      } else {
        alert(data?.message || "Failed to assign agent");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while assigning agent");
    }
  };

  // Filter leads based on status
  const filteredLeads = statusFilter
    ? leads.filter((lead) => lead.status === statusFilter)
    : leads;

  return (
    <Container>
      {!token ? (
        <div className="login-form">
          <h2>Login</h2>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      ) : (
        <div className="leads-section">
          <h2>Leads</h2>

          {/* Filter by Status */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            style={{ marginBottom: 10, minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Unassigned">Unassigned</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>

          {/* Leads Table */}
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Contact</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Source</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Inquiry Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Follow-up</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Property Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Budget</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Notes</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Agent</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Assign Agent</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No leads available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead?.id}>
                      <TableCell>{lead?.name}</TableCell>
                      <TableCell>{lead?.contactInfo}</TableCell>
                      <TableCell>{lead?.source}</TableCell>
                      <TableCell>{lead?.inquiryDate}</TableCell>
                      <TableCell>{lead?.status}</TableCell>
                      <TableCell>{lead?.followUpStatus}</TableCell>
                      <TableCell>{lead?.preferredPropertyType}</TableCell>
                      <TableCell>${lead?.budget}</TableCell>
                      <TableCell>{lead?.notes}</TableCell>
                      <TableCell>
                        {lead?.assignedAgent
                          ? lead?.assignedAgent.username
                          : "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {!lead?.assignedAgent && (
                          <Select
                            onChange={(e) =>
                              assignAgent(lead.id, e?.target?.value)
                            }
                            displayEmpty
                          >
                            <MenuItem value="">Select Agent</MenuItem>
                            {agents.map((agent) => (
                              <MenuItem key={agent.id} value={agent.id}>
                                {agent.username}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
              setLeads([]);
            }}
            style={{ marginTop: 20 }}
          >
            Logout
          </Button>
        </div>
      )}
    </Container>
  );
}

export default App;
