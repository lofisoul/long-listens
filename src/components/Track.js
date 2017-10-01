import React from 'react';

class Track extends React.Component {

  render() {
    const {details, index} = this.props;
    return (
      <li className="track">
        {details}
      </li>

    )
  }
}

export default Track;
