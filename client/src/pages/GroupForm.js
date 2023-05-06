import { useEffect } from 'react';
import { useUser, useAlert } from '../context/AppContext';
import { FormControl, TextField, MenuItem, Typography, Button, Box } from '@mui/material';
import FormBox from '../components/FormBox';
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { postNewGroup, patchGroupSettings } from '../lib/api';

export default function GroupForm() {
  const { register, setValue, handleSubmit, reset } = useForm();
  const { user } = useUser();
  const { groupId } = useParams();
  const { state } = useLocation();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  // groupId is an added dependency to reset the form if users navigate from a group settings page to a create group page.
  useEffect(() => {
    if (!user) return navigate('/sign-in');
    if (state) {
      for (const field in state[0]) {
        setValue(field, state[0][field]);
      }
    } else {
      reset();
    }
  }, [ user, navigate, state, groupId, setValue, reset ]);

  async function onSubmit(group) {
    try {
      let response = null;
      if (groupId) {
        response = await patchGroupSettings(groupId, group);
        navigate(`/group-home/${groupId}`);
      } else {
        group.userId = user.userId;
        group.activeDate =
        response = await postNewGroup(group);
        navigate(`/group-home/${response.groupId}`);
      }
      setAlert('GroupSaved');
    } catch (err) {
      console.error(err);
      setAlert('ErrorOccurred', err);
    }
  }

  return (
    <div>
      <FormBox my={4} sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl direction="column" fullWidth >
            <Typography variant="h4">
              {state ? 'Group Settings' : 'Create New Group'}
            </Typography>
            <TextField
              required
              label="Group Name"
              {...register("groupName")}
              sx={{ marginY: 3 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              type="number"
              label="Exercise Frequency per Interval"
              inputProps={{ min: 1 }}
              InputLabelProps={{ shrink: true }}
              {...register("frequencyReq")}
            />
            <TextField
              required
              select
              label="Exercise Interval"
              defaultValue={state ? state[0].intervalReq : 'Weekly'}
              sx={{ marginY: 3 }}
              InputLabelProps={{ shrink: true }}
              {...register("intervalReq")}
            >
              <MenuItem key="weekly" value="Weekly">
                Weekly
              </MenuItem>
              <MenuItem key="monthly" value="Monthly">
                Monthly
              </MenuItem>
            </TextField>
            <TextField
              required
              type="number"
              label="Exercise Duration in Minutes"
              inputProps={{ min: 1 }}
              InputLabelProps={{ shrink: true }}
              {...register("durationReq")}
            />
            <TextField
              type="number"
              label="Bet Amount"
              inputProps={{ min: 0.00, step: 'any' }}
              sx={{ marginTop: 3 }}
              InputLabelProps={{ shrink: true }}
              {...register("betAmount")}
            />
            <TextField
              type="number"
              label="Number of Free Passes per Year"
              inputProps={{ min: 0 }}
              sx={{ marginY: 3 }}
              InputLabelProps={{ shrink: true }}
              {...register("passQty")}
            />
            <Box display="flex" flexWrap="wrap" justifyContent="flex-end">
              <Button type="submit"
                sx={{ ml: 2, mt: 2 }}
                variant="contained"
              >
                Submit
              </Button>
              <Link to={state ? `/group-home/${groupId}` : "/"}>
                <Button
                  sx={{ ml: 2, mt: 2 }}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Link>
            </Box>
          </FormControl>
        </form>
      </FormBox>
    </div>
  )
}
