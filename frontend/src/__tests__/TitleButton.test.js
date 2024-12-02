import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TitleButton from '../components/TitleButton';
import { appTitle } from '../resources/constants';

describe('TitleButton', () => {

    let reloadMock;
    beforeEach(() => {
        // Mocking `window.location.reload` to avoid actually reloading the page during the test
        reloadMock = jest.fn();
        delete window.location;  // Deleting the property to redefine it
        window.location = { reload: reloadMock };
    });

    afterEach(() => {
        jest.restoreAllMocks();  // Restoring the original implementation of `window.location.reload` after the test
    });

    test('renders the app title button', () => {
        render(<TitleButton></TitleButton>)

        const titleButton = screen.getByRole('button', { name: appTitle });
        expect(titleButton).toBeInTheDocument();
    });

    test('reloads the page if button is clicked', () => {
        render(<TitleButton></TitleButton>)

        const titleButton = screen.getByRole('button', { name: appTitle });
        fireEvent.click(titleButton);

        expect(reloadMock).toHaveBeenCalled();
    });

});