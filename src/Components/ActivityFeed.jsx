import React, { useEffect, useState }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import VoicemailIcon from '@material-ui/icons/Voicemail';
import PhoneMissedIcon from '@material-ui/icons/PhoneMissed';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import moment from 'moment';
import {makeFeedAction} from '../services/CommonService';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// To Provide styling on expandable/collapse icon
const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const ActivityFeed= (props) => {

  const classes = useStyles();
  const { isArchived = false, activityFeeds, refresh } = props;
  const [expanded, setExpanded] = useState(null);

  let byday={};

  // To handleing on click archive and unarchive. 
  const onClick = (activity) => {
    makeFeedAction(activity.id,!isArchived).then(data => {
      refresh();
      // alert("Good Job!, Successful")
      
    })
  }

  // To handling expebd and Collapse of cards
  const handleCardExpandClick = (id) => {
    if(id=== expanded) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
    
  };

  // To group call by date.
  function groupday() {
    activityFeeds.map((activity) =>{
      if(activity.is_archived === isArchived ) {
        let d = moment(activity.created_at).format('MMMM, DD yyyy')
        byday[d] = byday[d]||[];
        byday[d].push(activity);
      }
    })
    return byday;
  }

  return ( 

    <div className='vertical-scroll'>
      {Object.keys(groupday()).map((key,index) =>(
         <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="text-center">
            <Typography variant="caption" color='primary'>
            {key}
            </Typography>
            </div>
           
          </div>
         
         {byday[key].map((activity) => (
           <div className="col-md-12 col-sm-12">
             {activity.is_archived === isArchived ?   (
             <Card key={activity.id}  className='mb-3'>
             <CardActionArea>
               <CardContent>
                 <div className="row">
                   <div className="col-md-2 col-sm-2 col-mo-2">
                     <div className="vertical-ctr">
                       {activity.call_type === 'missed' ? <PhoneMissedIcon  color="primary" />: activity.call_type === 'voicemail' ? <VoicemailIcon color="primary"/>:<CallReceivedIcon color="primary"/>}
     
                     </div>
                   </div>
                   <div className="col-md-7 col-sm-7 col-mo-7">
                      <p className='fw-bold'>
                        {activity.direction === 'inbound' ? activity.from: activity.to}
                      </p>
                      <p className='fw-light'style={{fontSize: 12}} >
                        {activity.direction === 'inbound' ? "Tried to call " + activity.to : "Received a ring from " + activity.from}
                      </p>
                   </div>
                   <div className="col-md-3 col-sm-3 col-mo-3">
                   <Typography variant="caption" component="p">
                   {moment(activity.created_at).format('hh:mm A')}
                 </Typography>
                  <IconButton onClick={(e) => onClick(activity)} color="secondary">
                    {!activity.is_archived ? <ArchiveIcon/>: <UnarchiveIcon/>}
                  </IconButton>
                  <IconButton
                 
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={(e) => handleCardExpandClick(activity.id)}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                   </div>
                 </div>
               
               </CardContent>
             </CardActionArea>
             <Collapse in={expanded ===  activity.id} timeout="auto" unmountOnExit>
             <CardContent>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-mo-6">
                  <Typography variant="caption">
                  <span className="fw-bold">Call Id:</span> {activity.id}
                  </Typography>
                </div>
                <div className="col-md-6 col-sm-6 col-mo-6">
                  <Typography variant="caption">
                  <span className="fw-bold">Duration:</span> {activity.duration} seconds
                  </Typography>
                </div>
                <div className="col-md-8 col-sm-8 col-mo-8">
                <Typography variant="caption">
                <span className="fw-bold">Via:</span> {activity.via}
                </Typography>
                </div>
              </div>
             </CardContent>
             
             </Collapse>
           </Card>): ''}
               
             </div>
         ))}
         
         </div>
      ))}
       
       
    </div>

 

  );
};

export default ActivityFeed;
