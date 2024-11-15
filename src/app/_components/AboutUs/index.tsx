import React from 'react';
import classes from './index.module.scss';

const AboutUs = ({text}) => {
  return (
    <section className={classes.aboutinfo}>
      <p>{text}</p>
    </section>
  );
};

export default AboutUs;
