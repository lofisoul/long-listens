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
    this.getMoreData = this.getMoreData.bind(this);
    this.functionTest = this.functionTest.bind(this);
    //initial state [HQ]
    this.state = {
      //add user/auth
      tracks: [],
      next_href: '',
      more_data: false
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

    const page_size = 3000;
    // console.log('first call');
    // SC.get(`/users/${user_id}/favorites`,{
    //   limit: page_size//,
    //   //offset:0,
    //   // duration: {
    //   //   from: 1800 * 1000 // anything over 30 minutes
    //    //}
    // }).then(res => {
    //   console.log(res);
    //   //const trackLength = res.data.tracks.length;
    //   //const randomNumber = Math.floor((Math.random()*trackLength)+1);
    //   //this.setState({track:res.data.tracks[randomNumber]})
    // })
    // .catch(err => {
    //   console.log(`eror ${err}`);
    // })

    //console.log('paged call');
    SC.get(`/users/${user_id}/favorites`,{
      limit: page_size,
      linked_partitioning: 1
      //offset:0,
      // duration: {
      //   from: 1800 * 1000 // anything over 30 minutes
       //}
    }).then(res => {
      console.log(res);
      const nextHref = res.next_href;
      console.log(res.next_href);
      const next_href = nextHref.replace('https://api.soundcloud.com/','');
      if (res.next_href) {
        this.setState({next_href: next_href, more_data:true});
        do{
          this.getMoreData(this.next_href)
          //this.setState({more_date:false});
        } while(this.more_data === true);
        console.log('do while done!');
      } else {
        this.setState({next_href: next_href, more_data:false});
        console.log('hit the else');
      }
      // const trackLength = res.data.tracks.length;
      // const randomNumber = Math.floor((Math.random()*trackLength)+1);
      // this.setState({track:res.data.tracks[randomNumber]})
    })
    .catch(err => {
      console.log(`ERROR ${err}`);
    })
  }

  getMoreData(url) {
    url = this.state.next_href;
    console.log(`get more data url = ${url}`);
    if(this.state.more_data === false || this.state.next_href === undefined) {
      this.setState({next_href: '', more_data:false});
      console.log('done getting more!');
      return;
    } else {
      SC.get(url,{
        limit: 3000,
        linked_partitioning: 1
        //offset:0,
        // duration: {
        //   from: 1800 * 1000 // anything over 30 minutes
         //}
      }).then(res => {
        console.log(res);
        const nextHref = res.next_href;
        console.log(nextHref);
        if (res.next_href !== undefined) {
          const next_href = nextHref.replace('https://api.soundcloud.com/','');
          this.setState({next_href: next_href, more_data:true});
        } else {
          this.setState({next_href: '', more_data:false});
        }
        // const trackLength = res.data.tracks.length;
        // const randomNumber = Math.floor((Math.random()*trackLength)+1);
        // this.setState({track:res.data.tracks[randomNumber]})
      })
      .catch(err => {
        console.log(`**ERROR** ${err}`);
      })
    }
  }

  functionTest(msg) {
    console.log(msg);
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
          <button onClick={this.getMoreData} className="get-btn" type="button" next_href={this.state.next_href} disabled={this.state.more_data === false}>
          Get More
          </button>
      </div>
    );
  }
}

export default App;
