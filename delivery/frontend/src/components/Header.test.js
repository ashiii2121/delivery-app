import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

test('renders header with title and navigation links', () => {
    render(
        <BrowserRouter>
            <Header />
        </BrowserRouter>
    );

    expect(screen.getByText('Zomato')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Restaurants')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
});