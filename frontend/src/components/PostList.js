import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, } from "@mui/material";
import { noPostsMessage } from "../resources/constants";
import PropTypes from 'prop-types';

function PostList({ postings, setSelectedPost, isStudent }) {

    return (
        <TableContainer component={Paper}>
            {isStudent && postings.length > 0 ? (  // Check that there are postings in this major
                postings.filter((post) => post.is_active).length > 0 ? (  // Check if the postings in the major are active
                    <Table>   
                        <TableBody>
                            {postings
                                .filter((post) => post.is_active) // Only display active posts
                                .map((post) => (
                                    <TableRow
                                        key={`post-${post.id}`}
                                        hover
                                        onClick={() => setSelectedPost(post)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <TableCell>{post.name}</TableCell>
                                        <TableCell>{post.research_periods}</TableCell>
                                        <TableCell>
                                            {post.faculty[0].first_name} {post.faculty[0].last_name}
                                        </TableCell>
                                        <TableCell>{post.faculty[0].email}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography style={{ padding: "16px" }}>{noPostsMessage}</Typography>  
                    // Display message if none of the posts are active
                )
            ) : (
                <Typography style={{ padding: "16px" }}>{noPostsMessage}</Typography>
                // Display message if there are no posts in this major
            )}
        </TableContainer>
    );    
}

PostList.propTypes = {
    postings: PropTypes.array.isRequired,
    setSelectedPost: PropTypes.func.isRequired,
    isStudent: PropTypes.bool.isRequired
}

export default PostList;
