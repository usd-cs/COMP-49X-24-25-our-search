import React from 'react';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import MainAccordion from '../components/MainAccordion';
import { mockResearchOps } from '../resources/mockData';
import { errorLoadingPostingsMessage } from '../resources/constants';

const mockSetSelectedPost = jest.fn();

describe('MainAccordion', () => {

    test('renders correct number of departments and majors', () => {
        render(<MainAccordion 
            postings={mockResearchOps} 
            setSelectedPost={mockSetSelectedPost}
            isStudent={true}
        ></MainAccordion>);

        mockResearchOps.forEach(department => {
            const departmentHeader = screen.getByText(department.name);
            expect(departmentHeader).toBeInTheDocument();

            // Expand the accordion to check for majors
            act(() => {
                departmentHeader.click();
            });

            department.majors.forEach(major => {
                expect(screen.getByText(major.name)).toBeInTheDocument();
            });
        });
    });

    test('renders message if no students/research opportunities exist', () => {
        render(<MainAccordion 
            postings={[]} 
            setSelectedPost={mockSetSelectedPost}
            isStudent={true}
        ></MainAccordion>);

        expect(screen.getByText(errorLoadingPostingsMessage)).toBeInTheDocument();
    });

});