import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import './RatingStars.scss';

const RatingStars = (props) => {
  const { count, values, setValues } = props;
  const [stars, setStars] = useState([]);
  const [value, setValue] = useState(values.rating);

  useEffect(() => {
    // update parent value
    setValues((prev) => ({ ...prev, rating: value }));

    // build stars array in a local var to avoid repeated state updates
    const newStars = [];
    for (let i = 0; i < value; i++) {
      newStars.push({ icon: StarOutlinedIcon, outline: true });
    }
    for (let i = value; i < count; i++) {
      newStars.push({ icon: StarBorderOutlinedIcon, outline: false });
    }
    setStars(newStars);
  }, [value, count, setValues]);
  
  return (
    <div className="star-div form-input">
      Rating:
      <div className="star-container">
        {stars.map((a, idx) =>
          <a.icon onClick={() => { setValue(idx + 1) }} className={`star star-${a.outline ? 'outline' : 'border'}`} key={idx} />
        )}
      </div>
    </div>
  )
}

RatingStars.defaultProps = {
  count: 5
}

RatingStars.propTypes = {
  count: PropTypes.number,
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
}

export default RatingStars