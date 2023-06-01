import { render, screen, waitFor } from "@testing-library/react";
import AlertBanner from "../AlertBanner";
import AppProvider from "../../context/AppContext";
import { BrowserRouter } from "react-router-dom";

test("User table should render correct number of rows and cells", async () => {
  render(
    <BrowserRouter>
      <AppProvider alert={{severity: 'success', message: 'This test passed.'}}>
        <AlertBanner />
      </AppProvider>
    </BrowserRouter>
  );

  await waitFor(async () => {expect(await screen.findByText('This test passed.')).toBeInTheDocument()});
})
