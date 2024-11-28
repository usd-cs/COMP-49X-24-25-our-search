import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MajorAccordion from "./MajorAccordion";
import { errorLoadingPostingsMessage } from "../resources/constants";

function MainAccordion({ postings, setSelectedPost, isStudent }) {
    return (
        <Box>
            {postings.length > 0 ? (
                postings.map((department) => (
                    <Accordion key={`dept=${department.id}`}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${department.id}-content`}
                            id={`panel${department.id}-header`}
                        >
                            <Typography>{department.name}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            {department.majors.map((major) => (
                                <MajorAccordion 
                                    key={major.id} 
                                    major={major} 
                                    setSelectedPost={setSelectedPost} 
                                    isStudent={isStudent}/>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography>{errorLoadingPostingsMessage}</Typography>   
                // There is an error message if this component has nothing to display because 
                // no matter what the app should always display the departments and majors
            )}
        </Box>
    );
}

export default MainAccordion;