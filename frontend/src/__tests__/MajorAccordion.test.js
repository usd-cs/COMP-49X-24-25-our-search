import React from 'react';
import { act } from 'react';
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

        const majorHeader = screen.getByText(mockMajorOnePost[0].name);
        expect(majorHeader).toBeInTheDocument();

        // Expand the accordion to check for posts
        act(() => {
            majorHeader.click();
        });
        expect(screen.getByText(mockMajorOnePost[0].posts[0].name)).toBeInTheDocument(); 
    });

});