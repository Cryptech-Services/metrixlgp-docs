import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    href: '/category/earn',
    title: 'Earn',
    Image: require('@site/static/img/liquidity-interact-2.png').default,
    description: (
      <strong>
        Provide MRX and gMRX liquidity in exchange for LGP-LP and a portion of
        the trading fees.
      </strong>
    ),
  },
  {
    href: '/category/trade',
    title: 'Trade',
    Image: require('@site/static/img/swap-interact-2.png').default,
    description: (
      <strong>
        Trade between MRX and gMRX instantly, while always retaining ownership
        of your keys.
      </strong>
    ),
  },
  {
    href: '/category/govern',
    title: 'Govern',
    Image: require('@site/static/img/govern-interact-2.png').default,
    description: (
      <strong>
        Deposit MRX to mint g and gMRX allowing you to retain your DGP voting
        rights and earn MRX.
      </strong>
    ),
  },
];

function Feature({Image, href, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <a href={href}>
          <img src={Image} className={styles.featureSvg} />
        </a>
      </div>

      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>
          <a href={href}>{title}</a>
        </Heading>

        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
