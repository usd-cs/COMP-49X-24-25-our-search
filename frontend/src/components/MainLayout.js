import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import MainAccordion from "./MainAccordion";
import PostDialog from "./PostDialog";
import TitleButton from "./TitleButton";
import SearchBar from "./SearchBar";
import ViewProfile from "./ViewProfile";
import Sidebar from "./Sidebar";

import PropTypes from 'prop-types';

MainLayout.propTypes = {
    isStudent: PropTypes.bool.isRequired,
    fetchPostings: PropTypes.func.isRequired,
};


function MainLayout({ isStudent, fetchPostings }) {

    const [selectedPost, setSelectedPost] = useState(null);
    const [postings, setPostings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const posts = await fetchPostings(isStudent);
            setPostings(posts);
        };
        fetchData();

    }, [fetchPostings, isStudent]);

    return (
        <Box>

            {/* The outermost box that puts the header, search bar, and view profile button next to each other */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row", // Horizontal layout
                    justifyContent: "space-between", // Distribute components evenly with space between them
                    alignItems: "center", // Vertically center items if necessary
                    padding: 2,
                }}
            >
                {/* Header */}
                <TitleButton></TitleButton>

                {/* Search bar */}
                {/* TO BE ADDED IN LATER SPRINTS - EDIT SEPARATE COMPONENT */}
                <SearchBar></SearchBar>

                {/* View profile button */}
                {/* TO BE ADDED IN LATER SPRINTS - EDIT SEPARATE COMPONENT */}
                <ViewProfile></ViewProfile>

            </Box>

            {/* The outermost box that puts the sidebar and the tabs next to each other */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row", // Horizontal layout
                    gap: 2, // Space between components
                    padding: 2,
                }}
            >
                {/* Sidebar */}
                {/* TO BE ADDED IN LATER SPRINTS - EDIT SEPARATE COMPONENT */}
                <Sidebar></Sidebar>

                {/* Main content */}
                <Box sx={{ width: "75%" }}>

                    <MainAccordion
                        sx={{
                            width: "75%", // Take up 75% of its parent's width
                            margin: "0 auto", // Center it horizontally
                            maxHeight: "500px", // Optional: Limit height
                            overflowY: "auto", // Add scroll if content overflows
                        }}
                        postings={postings}
                        setSelectedPost={setSelectedPost}
                        isStudent={isStudent}
                    />
                    <PostDialog
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                    />

                </Box>
            </Box>
        </Box>
    );
}

export default MainLayout;
