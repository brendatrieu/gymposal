import { render, screen } from "@testing-library/react";
import EnhancedTable from "../GroupsTable";
import AllWrappers from "../../lib/tests-config";
import { groupsHeaders } from '../../lib/tables-config';

const data = [{
  groupName: 'Group1',
  totalMinutes: 100,
  groupId: 1
}, {
  groupName: 'Group2',
  totalMinutes: 200,
  groupId: 2
}];

// ----- Test Renders ----- //
test("table should render correct number of rows and cells", async () => {
  render(<EnhancedTable
    rows={data}
    tableName='Exercises'
    headers={groupsHeaders}
    rowKey={'exerciseId'}
    />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(2);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(4);
  expect(screen.getByText('Group1')).toBeInTheDocument();
})

test("table should render 'New' button", async () => {
  render(<EnhancedTable
    rows={data}
    tableName='Groups'
    headers={groupsHeaders}
    rowKey={'groupId'}
  />, { wrapper: AllWrappers });

  expect(screen.getByTestId('new-button')).toBeInTheDocument();
})
