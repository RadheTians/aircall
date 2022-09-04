import React, { useEffect, useState }  from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import ArchiveIcon from '@material-ui/icons/Archive';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ActivityFeed from './Components/ActivityFeed.jsx';
import {getAllActivityFeeds} from './services/CommonService';
import Header from './Header.jsx';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';

// To customize styling of Tab.
const CustomTab = makeStyles({
  root: {
    textTransform: "none",
    fontSize: 10, 
  }
});


// To create custom TabPanel.
function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// To declare custom TabPanel props types.
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

// creating and setting accessibility props for tabs. 
function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

// Application entry point.
const App = () => {

  const classes = CustomTab();
  const [value, setValue] = useState(0);

  const [activityFeeds, setactivityFeeds] = useState([]);
  const flag = true;

  useEffect(() => {
    // To make default Rest API call when view is loaded.
    getAllActivityFeeds().then(data =>setactivityFeeds(data.data));   
  }, []);

  // To handle tabs change by user.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // To Make refresh Rest API call when feed is archive or unarchive.
  const refresh = () => {
    getAllActivityFeeds().then(data =>setactivityFeeds(data.data));   
  }

  return (
    <div className='container'>
      <div className="row">
        <div className="col-md-3 col-sm-3 col-mo-3">
          <Header/>
        </div>
        <div className="col-md-9 col-sm-9 col-mo-9">
          <div className="float-end">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="primary"
              variant="standard"
              
            >
              <Tab className={classes.root} label="Activity Feed" icon={<LocalActivityIcon />} {...a11yProps(0)} />
              <Tab className={classes.root} label="Archive" icon={<ArchiveIcon />} {...a11yProps(1)} />
            
            </Tabs>
          </div>
        
        </div>
      </div>
      
      <TabPanel value={value} index={0} >
        <ActivityFeed activityFeeds= {activityFeeds}  refresh={refresh} />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <ActivityFeed isArchived={flag} activityFeeds= {activityFeeds} refresh={refresh} />
      </TabPanel>
      </div>
      
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
