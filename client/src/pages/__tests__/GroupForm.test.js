import { render, screen, fireEvent } from "@testing-library/react";
import GroupForm from "../GroupForm";
import AllWrappers from "../../lib/tests-config";

test("field inputs and buttons should be rendered", () => {
  render(<GroupForm />, { wrapper: AllWrappers });
  const groupNameEl = screen.getByLabelText(/Group Name/i);
  const frequencyEl = screen.getByLabelText(/Exercise Frequency per Interval/i);
  const durationEl = screen.getByLabelText(/Exercise Duration in Minutes/i);
  const betAmountEl = screen.getByLabelText(/Bet Amount/i);
  const passQtyEl = screen.getByLabelText(/Number of Free Passes per Year/i);
  const submitButtonEl = screen.getByRole("button", { name: "Submit" });
  const cancelButtonEl = screen.getByRole("button", { name: "Cancel" });

  expect(groupNameEl).toBeInTheDocument();
  expect(frequencyEl).toBeInTheDocument();
  expect(durationEl).toBeInTheDocument();
  expect(betAmountEl).toBeInTheDocument();
  expect(passQtyEl).toBeInTheDocument();
  expect(submitButtonEl).toBeInTheDocument();
  expect(cancelButtonEl).toBeInTheDocument();
})

test("field inputs should change", () => {
  render(<GroupForm />, { wrapper: AllWrappers });
  const groupNameEl = screen.getByLabelText(/Group Name/i);
  const frequencyEl = screen.getByLabelText(/Exercise Frequency per Interval/i);
  const durationEl = screen.getByLabelText(/Exercise Duration in Minutes/i);
  const betAmountEl = screen.getByLabelText(/Bet Amount/i);
  const passQtyEl = screen.getByLabelText(/Number of Free Passes per Year/i);

  fireEvent.change(groupNameEl, { target: { value: "Group 1" } });
  fireEvent.change(frequencyEl, { target: { value: 2 } });
  fireEvent.change(durationEl, { target: { value: 30 } });
  fireEvent.change(betAmountEl, { target: { value: 0.5 } });
  fireEvent.change(passQtyEl, { target: { value: 1 } });

  expect(groupNameEl).toHaveValue("Group 1");
  expect(frequencyEl).toHaveValue(2);
  expect(durationEl).toHaveValue(30);
  expect(betAmountEl).toHaveValue(0.5);
  expect(passQtyEl).toHaveValue(1);
})

test("field inputs should not change if input data types do not align with input requirements", () => {
  render(<GroupForm />, { wrapper: AllWrappers });
  const frequencyEl = screen.getByLabelText(/Exercise Frequency per Interval/i);
  const durationEl = screen.getByLabelText(/Exercise Duration in Minutes/i);
  const betAmountEl = screen.getByLabelText(/Bet Amount/i);
  const passQtyEl = screen.getByLabelText(/Number of Free Passes per Year/i);

  fireEvent.change(frequencyEl, { target: { value: 'test' } });
  fireEvent.change(durationEl, { target: { value: 'test' } });
  fireEvent.change(betAmountEl, { target: { value: 'test' } });
  fireEvent.change(passQtyEl, { target: { value: 'test' } });

  expect(frequencyEl).not.toHaveValue('test');
  expect(durationEl).not.toHaveValue('test');
  expect(betAmountEl).not.toHaveValue('test');
  expect(passQtyEl).not.toHaveValue('test');
})

test("specified field inputs should be required", () => {
  render(<GroupForm />, { wrapper: AllWrappers });
  const groupNameEl = screen.getByLabelText(/Group Name/i);
  const frequencyEl = screen.getByLabelText(/Exercise Frequency per Interval/i);
  const durationEl = screen.getByLabelText(/Exercise Duration in Minutes/i);

  expect(groupNameEl).toBeRequired();
  expect(frequencyEl).toBeRequired();
  expect(durationEl).toBeRequired();
})

test("optional field inputs should not be required", () => {
  render(<GroupForm />, { wrapper: AllWrappers });
  const betAmountEl = screen.getByLabelText(/Bet Amount/i);
  const passQtyEl = screen.getByLabelText(/Number of Free Passes per Year/i);

  expect(betAmountEl).toBeInTheDocument();
  expect(passQtyEl).toBeInTheDocument();
})
