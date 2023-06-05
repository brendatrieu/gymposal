import { render, screen, fireEvent } from '@testing-library/react';
import NavMenu from '../NavMenu';
import AllWrappers from '../../lib/tests-config';

test('Menu is able to be toggled and show links within it', () => {
  render(<NavMenu />, { wrapper: AllWrappers });
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));

  expect(screen.getByText('About')).toBeInTheDocument();
  expect(screen.getByText('Log Exercise')).toBeInTheDocument();
  expect(screen.getByText('Create Group')).toBeInTheDocument();
  expect(screen.getByText('Log Exercise')).toBeInTheDocument();
  expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
})
