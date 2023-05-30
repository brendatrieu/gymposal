import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../SignUp";
import AllWrappers from "../../lib/tests-config";

test("field inputs and buttons should be rendered", () => {
  render(<SignUp />, { wrapper: AllWrappers });
  const firstNameEl = screen.getByLabelText(/First Name/i);
  const lastNameEl = screen.getByLabelText(/Last Name/i);
  const emailEl = screen.getByLabelText(/Email Address/i);
  const usernameEl = screen.getByLabelText(/Username/i);
  const passwordEl = screen.getByTestId("password");
  const confirmPasswordEl = screen.getByLabelText(/Confirm Password/i);
  const submitButtonEl = screen.getByRole("button", { name: "Submit" });
  const cancelButtonEl = screen.getByRole("button", { name: "Cancel" });

  expect(firstNameEl).toBeInTheDocument();
  expect(lastNameEl).toBeInTheDocument();
  expect(emailEl).toBeInTheDocument();
  expect(usernameEl).toBeInTheDocument();
  expect(passwordEl).toBeInTheDocument();
  expect(confirmPasswordEl).toBeInTheDocument();
  expect(submitButtonEl).toBeInTheDocument();
  expect(cancelButtonEl).toBeInTheDocument();
})

test("field inputs should change", () => {
  render(<SignUp />, { wrapper: AllWrappers });
  const firstNameEl = screen.getByLabelText(/First Name/i);
  const lastNameEl = screen.getByLabelText(/Last Name/i);
  const emailEl = screen.getByLabelText(/Email Address/i);
  const usernameEl = screen.getByLabelText(/Username/i);
  const passwordEl = screen.getByTestId("password");
  const confirmPasswordEl = screen.getByLabelText(/Confirm Password/i);

  fireEvent.change(firstNameEl, { target: { value: "John" } });
  expect(firstNameEl).toHaveValue("John");

  fireEvent.change(lastNameEl, { target: { value: "Doe" } });
  expect(lastNameEl).toHaveValue("Doe");

  fireEvent.change(emailEl, { target: { value: "test@email.com" } });
  expect(emailEl).toHaveValue("test@email.com");

  fireEvent.change(usernameEl, { target: { value: "johndoe" } });
  expect(usernameEl).toHaveValue("johndoe");

  fireEvent.change(passwordEl, { target: { value: "test" } });
  expect(passwordEl).toHaveValue("test");

  fireEvent.change(confirmPasswordEl, { target: { value: "test" } });
  expect(confirmPasswordEl).toHaveValue("test");
})

test("specified field inputs should be required", () => {
  render(<SignUp />, { wrapper: AllWrappers });
  const firstNameEl = screen.getByLabelText(/First Name/i);
  const lastNameEl = screen.getByLabelText(/Last Name/i);
  const emailEl = screen.getByLabelText(/Email Address/i);
  const usernameEl = screen.getByLabelText(/Username/i);
  const passwordEl = screen.getByTestId("password");
  const confirmPasswordEl = screen.getByLabelText(/Confirm Password/i);

  expect(firstNameEl).toBeRequired();
  expect(lastNameEl).toBeRequired();
  expect(emailEl).toBeRequired();
  expect(usernameEl).toBeRequired();
  expect(passwordEl).toBeRequired();
  expect(confirmPasswordEl).toBeRequired();
})
