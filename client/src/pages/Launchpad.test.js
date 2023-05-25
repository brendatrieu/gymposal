import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Launchpad from "./Launchpad";
import App from "../App";
import AllWrappers from "../lib/tests-config";
import nock from 'nock';


afterAll(() => {
  nock.cleanAll();
  nock.restore();
});

test("submit function should be called", async () => {
  const mockSetState = jest.fn();

  jest.mock('react', () => ({
    useState: user => [user, mockSetState]
  }));

  await mockSetState({ userId: 2, firstName: 'Harry' })

  const mockSetLoading = jest.fn();

  jest.mock('react', () => ({
    useState: loading => [loading, mockSetLoading]
  }));

  await mockSetLoading(false);

  nock('https://gymposal.azurewebsites.net/')
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
    })
    .intercept('/api/exercises/2', 'GET')
    .reply(200, [{
      date: '01/01/2022',
      totalMinutes: 50,
      type: 'Running'
    }])

  nock('https://gymposal.azurewebsites.net/')
  .defaultReplyHeaders({
    'access-control-allow-origin': '*',
  })
    .intercept('/api/chart-exercises/2', 'GET')
  .reply(200, [{
    date: '01/01/2022',
    totalMinutes: 50,
    type: 'Running',
    userId: 2,
    firstName: 'Harry'
  }])

  nock('https://gymposal.azurewebsites.net/')
  .defaultReplyHeaders({
    'access-control-allow-origin': '*',
  })
    .intercept('/api/groups/2', 'GET')
  .reply(200, [])

  nock('https://gymposal.azurewebsites.net/')
  .defaultReplyHeaders({
    'access-control-allow-origin': '*',
  })
    .intercept('/api/user-penalties/2', 'GET')
  .reply(200, [])



  render(<Launchpad />, { wrapper: AllWrappers });
  // const usernameEl = screen.getByLabelText(/username/i);
  // const passwordEl = screen.getByLabelText(/password/i);
  // const submitButtonEl = screen.getByRole("button", { name: "Submit" });
  // await fireEvent.change(usernameEl, { target: { value: "ronweasley" } });
  // await fireEvent.change(passwordEl, { target: { value: "Password1!" } });
  // await fireEvent.click(submitButtonEl);
  // // expect(screen.getByText
  await waitFor(() => {
    expect(screen.getByTestId('greeting')).toBeInTheDocument()
  });
})
