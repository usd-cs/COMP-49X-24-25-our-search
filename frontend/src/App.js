import React, { useState } from "react";
import MainLayout from "./components/MainLayout";
import fetchPostings from "./utils/fetchPostings";   // we want to pass this into MainLayout so we can test that it gets called

function App() {

    const [isStudent] = useState(true); // hardcoded to true for sprint 1

    return (
            <MainLayout
                isStudent={isStudent}
                fetchPostings={fetchPostings}
            />
    );
}

export default App;
