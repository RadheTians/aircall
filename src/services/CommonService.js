import axios from "axios";

const base_url = 'https://aircall-job.herokuapp.com/';

const getAllActivityFeeds = () => {
  return axios.get(base_url + 'activities' );
}

const makeFeedAction = (id, isArchived) => {
  return axios.post(base_url + 'activities/'+id, {
    is_archived: isArchived
  } );
}

export { getAllActivityFeeds, makeFeedAction };
