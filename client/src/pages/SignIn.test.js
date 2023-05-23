import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "./SignIn";
import Provider from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';

function AllWrappers({children}) {
  return (
    <BrowserRouter>
      <Provider>
        {children}
      </Provider>
    </BrowserRouter>
  )
}

// ----- Test Renders ----- //
test("field inputs should be rendered", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const usernameEl = screen.getByLabelText(/username/i);
  const passwordEl = screen.getByLabelText(/password/i);
  expect(usernameEl).toBeInTheDocument();
  expect(passwordEl).toBeInTheDocument();
})

test("buttons should be rendered", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const submitButtonEl = screen.getByRole("button", { name: "Submit" });
  const cancelButtonEl = screen.getByRole("button", { name: "Cancel" });
  expect(submitButtonEl).toBeInTheDocument();
  expect(cancelButtonEl).toBeInTheDocument();
})

// ----- Test Changes ----- //

test("field inputs should change", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const usernameEl = screen.getByLabelText(/username/i);
  const passwordEl = screen.getByLabelText(/password/i);
  fireEvent.change(usernameEl, { target: { value: "johndoe" } });
  fireEvent.change(passwordEl, { target: { value: "Abcdef0$" } });
  expect(usernameEl).toHaveValue("johndoe");
  expect(passwordEl).toHaveValue("Abcdef0$");
})

test("username and password fields should be required", async () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const usernameEl = screen.getByLabelText(/username/i);
  const passwordEl = screen.getByLabelText(/password/i);
  expect(usernameEl).toBeRequired();
  expect(passwordEl).toBeRequired();
})
