import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import ModeratorsDataList from './ModeratorsTransferList';
import ParticipantsDataList from './ParticipantTransferList';
import { handleSuccessToastr, handleErrorToastr } from '../../../utils/toastr';
import Typography from '@material-ui/core/Typography';
import GroupInfos from './GroupInfos';
import Review from './Review';
import { Api } from '../../../config/constants';
import axios from 'axios';
const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  layout: {
    width: 'auto',
    maxWidth: '800px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 3)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}));

const steps = [
  'Group details',
  'Add moderators',
  'Add Participants',
  'Review '
];

export default function Checkout(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isDisabled, setDisabled] = React.useState(true);
  const [formValues, setformValues] = React.useState({
    grpName: '',
    grpDesc: '',
    moderators: [],
    participants: []
  });

  const submitData = async () => {
    setDisabled(true);

    const dataTosubmit = {
      name: formValues.grpName,
      desc: formValues.grpDesc,
      participants: formValues.moderators,
      moderators: formValues.participants,
      state: 'unhidden',
      discussions: [],
      polls: []
    };

    try {
      console.log('dataTosubmit:', dataTosubmit);
      await axios.post(`${Api.baseURL}/addGroup`, dataTosubmit);
    } catch (error) {
      if (error.message == 'Network Error') {
        handleErrorToastr(error.message, () => props.CloseModal());
      }
      return Error();
    }

    handleSuccessToastr('Group created successfully', () => props.CloseModal());
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      submitData();
    } else setActiveStep(activeStep + 1);
  };

  const realtimeErrorHandler = (output, key, value) => {
    setformValues({ ...formValues, [key]: value });
    setDisabled(!output);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const setChoosedModerators = moderators => {
    setformValues({ ...formValues, moderators });
  };
  const setChoosedParticipants = participants => {
    setformValues({ ...formValues, participants });
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <GroupInfos
            onChangeFormValidation={realtimeErrorHandler}
            grpDesc={formValues.grpDesc}
            grpName={formValues.grpName}
          />
        );
      case 1:
        return (
          <ModeratorsDataList
            choosedModerators={setChoosedModerators}
            existedModerators={formValues.moderators}
          />
        );
      case 2:
        return (
          <ParticipantsDataList
            choosedParticipants={setChoosedParticipants}
            existedParticipants={formValues.participants}
          />
        );
      case 3:
        return <Review GroupData={formValues} />;
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            CREATE A NEW GROUP
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {getStepContent(activeStep)}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className={classes.button}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                disabled={isDisabled}
                onClick={handleNext}
                className={classes.button}>
                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                {}
              </Button>
            </div>
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
