import React from 'react';
import { render, screen } from '@testing-library/react';
import MajorAccordion from '../components/MajorAccordion';
import { mockMajorNoPosts, mockMajorOnePost } from '../resources/mockData';

describe('MajorAccordion', () => {

    const mockSetSelectedPost = jest.fn();

    test('renders major name', () => {
        render(<MajorAccordion 
            major={mockMajorNoPosts} 
            setSelectedPost={mockSetSelectedPost}
            isStudent={true}
        ></MajorAccordion>);

        expect(screen.getByText(mockMajorNoPosts.name)).toBeInTheDocument();
    });

    test('renders posts for the major', () => {
        render(<MajorAccordion 
            major={mockMajorOnePost} 
            setSelectedPost={mockSetSelectedPost}
            isStudent={true}
        ></MajorAccordion>);

        //TODO try to check that a postlist is in here
    });

});