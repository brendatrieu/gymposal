import { render, screen } from "@testing-library/react";
import NavMenu from "../NavMenu";
import AllWrappers from "../../lib/tests-config";

test("menu should render items", async () => {
  await render(<NavMenu />, { wrapper: AllWrappers });

  expect(screen.getByText('Inbox')).toBeInTheDocument();
  // expect(screen.getByText('Log Exercise')).toBeInTheDocument();
  // expect(screen.getByText('Create Group')).toBeInTheDocument();
})
