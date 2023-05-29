import { render, screen } from "@testing-library/react";
import EnhancedTable from "../BaseTable";
import AllWrappers from "../../lib/tests-config";
import { personalLogHeaders,
  userPenaltiesHeaders,
  groupLogHeaders,
  groupPenaltiesHeaders,
  groupSettingsHeaders } from '../../lib/tables-config';

const individualData = [{
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

// ----- User Exercises Table ----- //
test("User table should render correct number of rows and cells", async () => {
  render(<EnhancedTable
    rows={individualData}
    tableName='Exercises'
    headers={personalLogHeaders}
    rowKey={'exerciseId'}
    />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(2);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(6);
  expect(screen.getByText('01/01/2023')).toBeInTheDocument();
})

test("User table should not render captions or link", async () => {
  render(<EnhancedTable
    rows={individualData}
    tableName='Exercises'
    headers={personalLogHeaders}
    rowKey={'exerciseId'}
  />, { wrapper: AllWrappers });

  expect(screen.queryByTestId('User table-caption')).not.toBeInTheDocument();
  expect(screen.queryByTestId('invite-link')).not.toBeInTheDocument();
})

test("User table should render caption and link", async () => {
  render(<EnhancedTable
    rows={individualData}
    tableName='Exercises'
    headers={personalLogHeaders}
    rowKey={'exerciseId'}
    tableCaption="Table caption"
    link={true}
  />, { wrapper: AllWrappers });

  expect(screen.getByTestId('table-caption')).toBeInTheDocument();
  expect(screen.getByTestId('invite-link')).toBeInTheDocument();
})

// ----- User Penalties Exercises Table ----- //
const userPenaltiesData = [{
  groupName: 'Group1',
  date: '01/02/2023',
  betAmount: 5,
  status: 'Open',
  penaltyId: 1
}];

test("User penalties table should render correct number of rows and cells", async () => {
  render(<EnhancedTable
    rows={userPenaltiesData}
    tableName='Penalties'
    headers={userPenaltiesHeaders}
    rowKey={'penaltyId'}
  />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(1);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(4);
  expect(screen.getByText('Penalties')).toBeInTheDocument();
})

// ----- Group Members' Exercises Table ----- //
const groupMembersData = [{
  firstName: 'John',
  date: '01/01/2023',
  type: 'Running',
  totalMinutes: 60,
  exerciseId: 1
}, {
  firstName: 'Jane',
  date: '01/02/2023',
  type: 'Hiking',
  totalMinutes: 45,
  exerciseId: 2
},
{
  firstName: 'Jane',
  date: '01/03/2023',
  type: 'Yoga',
  totalMinutes: 30,
  exerciseId: 3
}];

test("Group members' exercise table should render correct number of rows and cells", async () => {
  render(<EnhancedTable
    rows={groupMembersData}
    tableName='Exercises'
    headers={groupLogHeaders}
    rowKey={'exerciseId'}
  />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(3);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(12);
  expect(screen.getByText('Yoga')).toBeInTheDocument();
})

// ----- Group Penalties Exercises Table ----- //
const groupPenaltiesData = [{
  firstName: 'Jane',
  date: '01/02/2023',
  betAmount: 5,
  status: 'Open',
  penaltyId: 1
}];

test("Group penalties table should render correct number of rows and cells", async () => {
  render(<EnhancedTable
    rows={groupPenaltiesData}
    tableName='Penalties'
    headers={groupPenaltiesHeaders}
    rowKey={'penaltyId'}
  />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(1);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(4);
  expect(screen.getByText('Penalties')).toBeInTheDocument();
})

// ----- Group Penalties Exercises Table ----- //
const groupSettingsData = [{
  intervalReq: 'Weekly',
  frequencyReq: 2,
  durationReq: 30,
  betAmount: 0.5,
  passQty: 2,
  groupId: 1
}];

test("Group settings table should render correct number of rows and cells", async () => {
  render(<EnhancedTable
    rows={groupSettingsData}
    tableName='Penalties'
    headers={groupSettingsHeaders}
    rowKey={'groupId'}
  />, { wrapper: AllWrappers });

  expect(screen.getAllByTestId('table-row')).toHaveLength(1);
  expect(screen.getAllByTestId('table-cell')).toHaveLength(5);
  expect(screen.getByText('Penalties')).toBeInTheDocument();
})
