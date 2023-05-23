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
test("username input should be rendered", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const usernameEl = screen.getByLabelText(/username/i)
  expect(usernameEl).toBeInTheDocument();
})

test("password input should be rendered", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const passwordEl = screen.getByLabelText(/password/i)
  expect(passwordEl).toBeInTheDocument();
})

test("submit button input should be rendered", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const buttonEl = screen.getByText("Submit")
  expect(buttonEl).toBeInTheDocument();
})

test("cancel button input should be rendered", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const buttonEl = screen.getByText("Cancel")
  expect(buttonEl).toBeInTheDocument();
})

test("submit button input should be disabled", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const passwordEl = screen.getByLabelText(/password/i)
  const buttonEl = screen.getByText("Submit")
  fireEvent.change(passwordEl, {target: {value: "Abcdef0)"}})
  expect(buttonEl).toBeDisabled();
})

// ----- Test Changes ----- //

test("username input should change", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const usernameEl = screen.getByLabelText(/username/i)
  fireEvent.change(usernameEl, { target: { value: "johndoe" } })
  expect(usernameEl.value).toEqual("johndoe");
})

test("password input should change", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const passwordEl = screen.getByLabelText(/password/i)
  fireEvent.change(passwordEl, { target: { value: "Abcdef0$" } })
  expect(passwordEl.value).toEqual("Abcdef0$");
})
