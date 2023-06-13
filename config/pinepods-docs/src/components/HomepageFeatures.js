import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Own Everything, Run Everywhere',
    Svg: require('../../static/img/os.svg').default,
    description: (
      <>
        Every aspect of PinePods is fully open sourced and the code is available on Github. There's zero data collection and you can self-host every aspect of the application. Run anywhere you can run a browser or python. There's a client on linux, mac, and windows. A mobile client is in the works. 
      </>
    ),
  },
  {
    title: 'Zero Cost, Full Functionality',
    Svg: require('../../static/img/opensource.svg').default,
    description: (
      <>
        Get all the features of the paid podcast apps. PinePods will never cost a dime and survives solely on donations. Rest easy knowing you'll always be able to sync your saved podcasts and user settings between devices.
      </>
    ),
  },
  {
    title: 'Powered by Python',
    Svg: require('../../static/img/pythonlogo.svg').default,
    description: (
      <>
        Everything, and I mean everything in this application is made with python. The UI, the API, the client, and web component. PinePods is made primarily with the framework Flet. 
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
