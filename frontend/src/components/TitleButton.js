import React from "react";
import { Box, Typography } from "@mui/material";
import { appTitle } from "../resources/constants";

function TitleButton() {
    const handleReload = () => {
        window.location.reload(); // Reloads the page
    };
    
    return (
        <Box
            component="button" 
            onClick={handleReload} 
            sx={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'inherit',
            }}
        >
            <Typography
                variant="h5"
            >
                {appTitle}
            </Typography>
        </Box>
    );

}

export default TitleButton;