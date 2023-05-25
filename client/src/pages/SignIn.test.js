import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";
import Launchpad from "./Launchpad";
import App from "../App";
import AllWrappers from "../lib/tests-config";
import nock from 'nock';

afterAll(() => {
  nock.cleanAll();
  nock.restore();
});

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

test("username and password fields should be required", () => {
  render(<SignIn />, { wrapper: AllWrappers });
  const usernameEl = screen.getByLabelText(/username/i);
  const passwordEl = screen.getByLabelText(/password/i);
  expect(usernameEl).toBeRequired();
  expect(passwordEl).toBeRequired();
})

// test("submit function should be called", async () => {
//   nock('https://gymposal.azurewebsites.net/')
//     .defaultReplyHeaders({
//       'access-control-allow-origin': '*',
//     })
//     .intercept('/api/sign-in', 'GET')
//     .reply(200, {
//       userId: 2,
//       firstName: 'Harry'
//     })
//   render(<App />, { wrapper: AllWrappers });
//   const usernameEl = screen.getByLabelText(/username/i);
//   const passwordEl = screen.getByLabelText(/password/i);
//   const submitButtonEl = screen.getByRole("button", { name: "Submit" });
//   await fireEvent.change(usernameEl, { target: { value: "ronweasley" } });
//   await fireEvent.change(passwordEl, { target: { value: "Test1234567890!" } });
//   await fireEvent.submit(submitButtonEl);
//   // expect(screen.getByText
//   await waitFor(() => {
//     expect(screen.getByTestId('snackbar')).toBeInTheDocument()
//   });
// })
