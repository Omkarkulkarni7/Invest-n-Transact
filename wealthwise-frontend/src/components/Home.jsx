import React, { useEffect, useState } from "react";
import { Typography, Container, Box, Paper, CircularProgress, Grid, Avatar } from "@mui/material";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user) {
                const accessToken = localStorage.getItem("accessToken");
                try {
                    const response = await API.get(`/user/${user.userId}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    setUserInfo(response.data);
                } catch (err) {
                    console.log(err);
                }
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper 
                elevation={4} 
                sx={{ 
                    padding: 5, 
                    marginTop: 6, 
                    borderRadius: 3, 
                    textAlign: "center", 
                    background: "linear-gradient(135deg, #8ECFFF, #2C3E50)", 
                    color: "white"
                }}
            >
                {userInfo && (
                    <>
                        <Avatar 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                margin: "0 auto 15px", 
                                bgcolor: "#2C3E50", 
                                fontSize: 32 
                            }}
                        >
                            {userInfo.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography variant="h4" gutterBottom>
                            Welcome, {userInfo.name}!
                        </Typography>

                        <Typography variant="h6">
                            User Dashboard
                        </Typography>

                        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>Email:</strong> {userInfo.email}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2} sx={{ padding: 2, borderRadius: 2 }}>
                                    <Typography variant="body1" color="text.primary">
                                        <strong>Role:</strong> {userInfo.role}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Home;
