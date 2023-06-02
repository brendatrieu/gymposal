import { render, screen } from "@testing-library/react";
import NavMenu from "../NavMenu";
import AllWrappers from "../../lib/tests-config";

// ----- User Exercises Table ----- //
test("User table should render correct number of rows and cells", async () => {
  await render(<NavMenu />, { wrapper: AllWrappers });

  expect(await screen.findByText('Inbox')).toBeInTheDocument();
})
