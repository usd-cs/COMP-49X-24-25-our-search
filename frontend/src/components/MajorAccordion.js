import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostList from "./PostList";

function MajorAccordion({ major, setSelectedPost, isStudent }) {
    return (
        <Accordion>
            
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${major.id}-content`}
                id={`panel${major.id}-header`}
            >
                <Typography>{major.name}</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <PostList 
                    postings={major.posts} 
                    setSelectedPost={setSelectedPost}
                    isStudent={isStudent}
                />
            </AccordionDetails>

        </Accordion>
    );
}

export default MajorAccordion;
