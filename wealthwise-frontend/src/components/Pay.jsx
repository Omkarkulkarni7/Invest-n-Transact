import React, { useState } from "react";
import { Typography, Container, Paper, TextField, Button, Box, CircularProgress, Alert } from "@mui/material";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Pay = () => {
    const { user } = useAuth();
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSendMoney = async () => {
        setLoading(true);
        setMessage("");
        setError("");
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await API.post(
                "/payments/send",
                { senderId: user.userId, receiverId, amount },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #8EC5FC, #E0C3FC)", padding: 4 }}>
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, textAlign: "center", background: "white" }}>
                    <Typography variant="h5" gutterBottom>
                        Make a Payment
                    </Typography>
                    <TextField
                        label="Receiver User ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={receiverId}
                        onChange={(e) => setReceiverId(e.target.value)}
                    />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSendMoney}
                        disabled={loading}
                        sx={{ marginTop: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Send Money"}
                    </Button>
                    {message && (
                        <Alert severity="success" sx={{ marginTop: 2 }}>
                            {message}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Pay;