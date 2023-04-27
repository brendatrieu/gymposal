/**
 * @returns {Array} An array of objects containing headers to be used on the personal exercise log table within the launchpad.
 */
export const personalLogHeaders = [
  {
    id: 'date',
    numeric: false,
    label: 'Date',
  },
  {
    id: 'type',
    numeric: false,
    label: 'Type',
  },
  {
    id: 'totalMinutes',
    numeric: true,
    label: 'Total Minutes',
  },
];

/**
 * @returns {Array} An array of objects containing headers to be used on the group exercise log table within the group home page.
 */
export const groupLogHeaders = [
  {
    id: 'firstName',
    numeric: false,
    label: 'Name',
  },
  {
    id: 'date',
    numeric: false,
    label: 'Date',
  },
  {
    id: 'type',
    numeric: false,
    label: 'Type',
  },
  {
    id: 'totalMinutes',
    numeric: true,
    label: 'Total Minutes',
  },
];

/**
 * @returns {Array} An array of objects containing headers to be used on the group overview table within the group home page.
 */
export const groupSettingsHeaders = [
  {
    id: 'intervalReq',
    numeric: false,
    label: 'Interval',
  },
  {
    id: 'frequencyReq',
    numeric: true,
    label: 'Frequency',
  },
  {
    id: 'durationReq',
    numeric: true,
    label: 'Duration',
  },
  {
    id: 'passQty',
    numeric: true,
    label: 'Passes per Year',
  },
];

/**
 * @returns {Array} An array of objects containing headers to be used on the group overview table within the launchpad.
 */
export const groupsHeaders = [
  {
    id: 'groupName',
    numeric: false,
    label: 'Name',
    route: '/group-home/'
  },
  {
    id: 'totalMinutes',
    numeric: true,
    label: 'Total Minutes',
  },
];

/**
 * @returns {Array} An array of objects containing headers to be used on the penalties table within the launchpad.
 */
export const userPenaltiesHeaders = [
  {
    id: 'groupName',
    numeric: false,
    label: 'Name',
  },
  {
    id: 'date',
    numeric: true,
    label: 'Date',
  },
  {
    id: 'status',
    numeric: true,
    label: 'Status',
  },
  {
    id: 'betAmount',
    numeric: true,
    label: 'Amount Owed',
  },
];
