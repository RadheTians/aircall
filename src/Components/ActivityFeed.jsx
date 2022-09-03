import React, { useEffect, useState }  from 'react';
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

const ActivityFeed= (props) => {

  const { isArchived = false, activityFeeds, refresh } = props;
  const [expanded, setExpanded] = useState(false);

  let byday={};

  // To handleing on click archive and unarchive. 
  const onClick = (activity) => {
    makeFeedAction(activity.id,!isArchived).then(data => {
      refresh();
      // alert("Good Job!, Successful")
      
    })
  }

  // To handling expebd and Collapse of cards
  const handleCardExpandClick = () => {
    setExpanded(!expanded);
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
          <div className="offset-md-4 col-md-4">
            <Typography variant="caption" color='primary'>
            {key}
            </Typography>
          </div>
         
         {byday[key].map((activity) => (
           <div className="col-md-12">
             {activity.is_archived === isArchived ?   (
             <Card key={activity.id}  className='mb-3'>
             <CardActionArea>
               <CardContent onClick={handleCardExpandClick} >
                 <div className="row">
                   <div className="col-md-2">
                     <div className="vertical-ctr">
                       {activity.call_type === 'missed' ? <PhoneMissedIcon  color="primary" />: activity.call_type === 'voicemail' ? <VoicemailIcon color="primary"/>:<CallReceivedIcon color="primary"/>}
     
                     </div>
                   </div>
                   <div className="col-md-7">
                   <Typography gutterBottom variant="h5" component="p">
                 {activity.direction === 'inbound' ? activity.from: activity.to}
                 </Typography>
                 <Typography variant="caption"  >
                 Tried to call {activity.direction === 'inbound' ? activity.to : activity.from}
                 </Typography>
                   </div>
                   <div className="col-md-3">
                   <Typography variant="caption" component="p">
                   {moment(activity.created_at).format('hh:mm A')}
                 </Typography>
                 <IconButton onClick={(e) => onClick(activity)} color="secondary">
                  {!activity.is_archived ? <ArchiveIcon/>: <UnarchiveIcon/>}
                </IconButton>
                   </div>
                 </div>
               
               </CardContent>
             </CardActionArea>
             <Collapse in={expanded} timeout="auto" unmountOnExit>
             <CardContent>
              <div className="row">
                <div className="col-md-8">
                <Typography paragraph>
              {activity.id}
             </Typography>
                </div>
                <div className="col-md-4">
                <Typography paragraph>
              
              {activity.via}
             </Typography>
                </div>
                <div className="col-md-8">
                <Typography paragraph>
              
              {activity.duration} sec
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
