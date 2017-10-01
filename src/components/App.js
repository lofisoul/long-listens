import React from 'react';
import Boombox from './Boombox';
import Cassette from './Cassette';
import Track from './Track';
import SC from 'soundcloud';
//import base from 'base';

class App extends React.Component {
  constructor() {
    super();
    //methods to bind
    this.initMixList = this.initMixList.bind(this);
    //initial state [HQ]
    this.state = {
      //add user/auth?
      tracks: []
    }
  }

  componentWillMount() {
    //rebase will be going in here
  }

  addTrack(track) {
    const tracks = {...this.state.tracks};

    const timestamp = Date.now();
    tracks[`tracks=${timestamp}`] = track;
    this.setState({tracks});
  }

  initMixList() {
    SC.initialize({
      client_id: 'aa43f640526cb3f753a3a2ce40a340b4',
      redirect_uri: 'http://localhost:3000/callback'
    });

    //const sc_url = 'https://soundcloud.com';
    //these vars will change but not scoped to SC blocks
    var user = 'lofisoul';
    var user_id = 63317612;
    var mixes = {};

    //get userID
    // SC.resolve(`${sc_url}/${user}`).then(function(user){
    //   //maybe this becomes a state object?
    //   user_id = user.id;
    //   console.log(`${user} is ${user_id}`)
    // });

    console.log(`${user} is ${user_id}`);


    SC.get(`/users/${user_id}/favorites`,{
      limit: 5000,
      offset:0,
      duration: {
        from: 1800 * 1000 // anything over 30 minutes
      }
    }).then(function(){
      const tracks = {...this.setState.tracks};
      //const mixes = [];
      // console.log(tracks);
      // for(let i = 0; i<tracks.length; i++) {
      //   if(tracks[i].duration > 1800 * 1000) {
      //     mixes.push(tracks[i]);
      //     tracks = [...mixes]
      //   }
      // }
      // console.log(tracks);
      this.setState({tracks});
    });
  }



  render() {
    return (
      <div className="App">
        <h1>Long Listens</h1>
        <Boombox />
        <Cassette />
        <ul className="tracklist">
          {
            Object
              .keys(this.state.tracks)
              .map(key => <Track key={key} index={key} details={this.state.tracks[key]}
              />)
          }
        </ul>
          <button onClick={this.initMixList} className="init-btn" type="button">
          Launch Long Listens
          </button>
      </div>
    );
  }
}

export default App;
