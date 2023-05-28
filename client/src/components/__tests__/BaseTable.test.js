import { render, screen } from "@testing-library/react";
import EnhancedTable from "../BaseTable";
import AllWrappers from "../../lib/tests-config";
import { personalLogHeaders } from '../../lib/tables-config';

// ----- Test Renders ----- //
test("table should render correct number of rows and cells", async () => {
  const data = [{
    date: '01/01/2023',
    type: 'Running',
    totalMinutes: 60,
    exerciseId: 1
  }, {
    date: '01/02/2023',
    type: 'Hiking',
    totalMinutes: 45,
    exerciseId: 2
  }];

  render(<EnhancedTable
    rows={data}
    tableName='Exercises'
    headers={personalLogHeaders}
    rowKey={'exerciseId'}
    />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(2);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(6);
  expect(screen.getByText('01/01/2023')).toBeInTheDocument();
})

test("table should not render captions or link", async () => {
  const data = [{
    date: '01/01/2023',
    type: 'Running',
    totalMinutes: 60,
    exerciseId: 1
  }, {
    date: '01/02/2023',
    type: 'Hiking',
    totalMinutes: 45,
    exerciseId: 2
  }];

  render(<EnhancedTable
    rows={data}
    tableName='Exercises'
    headers={personalLogHeaders}
    rowKey={'exerciseId'}
  />, { wrapper: AllWrappers });

  expect(screen.queryByTestId('table-caption')).not.toBeInTheDocument();
  expect(screen.queryByTestId('invite-link')).not.toBeInTheDocument();
})

test("table should render caption and link", async () => {
  const data = [{
    date: '01/01/2023',
    type: 'Running',
    totalMinutes: 60,
    exerciseId: 1
  }, {
    date: '01/02/2023',
    type: 'Hiking',
    totalMinutes: 45,
    exerciseId: 2
  }];

  render(<EnhancedTable
    rows={data}
    tableName='Exercises'
    headers={personalLogHeaders}
    rowKey={'exerciseId'}
    tableCaption="Table caption"
    link={true}
  />, { wrapper: AllWrappers });

  expect(screen.getByTestId('table-caption')).toBeInTheDocument();
  expect(screen.getByTestId('invite-link')).toBeInTheDocument();
})
