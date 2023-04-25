import { CircularProgress } from '@mui/material';

export function handleLoading(isLoading) {
  return (<div
            style={{ display: 'flex',
              justifyContent: 'center',
              margin: '10rem auto' }}
          >
            <CircularProgress />
          </div>);
}

export function handleError(error) {
  return <div>Error Loading Form: {error.message}</div>;
}
