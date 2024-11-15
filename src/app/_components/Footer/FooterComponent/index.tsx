'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Footer, Media } from '../../../../payload/payload-types'
import { inclusions, noFooterUrls, profileNavItems } from '../../../constants'
import { Button } from '../../Button'
import { Gutter } from '../../Gutter'

import classes from './index.module.scss'

const FooterComponent = ({ footer }: { footer: Footer }) => {
  const pathname = usePathname()
  const navItems = footer?.navItems || []

  /////////////
  const SliderContent = ({ text }) => {
    const [position, setPosition] = useState(0);
    const sliderRef = useRef(null);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setPosition(prevPosition => (prevPosition - 1) % sliderRef.current.offsetWidth);
      }, 10); // Adjust speed as needed (lower number = faster)
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className={classes.contactSlider}>
        <div className={classes.sliderContent} ref={sliderRef} style={{ transform: `translateX(${position}px)` }}>
        <Link href="/contact" passHref>
          <span className={classes.sliderText}>{text}&nbsp;</span>
        </Link>
        <Link href="/contact" passHref>
          <span className={classes.sliderText}>{text}&nbsp;</span>
        </Link>
        </div>
      </div>
    );
  };
  ////////////

  return (
    <footer className={noFooterUrls.includes(pathname) ? classes.hide : ''}>
      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            <Link href="/">
              <Image src="/logo-white.svg" alt="logo" width={170} height={50} />
            </Link>

            <p>{footer?.copyright}</p>

            <div className={classes.socialLinks}>
              {navItems.map(item => {
                const icon = item?.link?.icon as Media

                return (
                  <Button
                    key={item.link.label}
                    el="link"
                    href={item.link.url}
                    newTab={true}
                    className={classes.socialLinkItem}
                  >
                    <Image
                      src={icon?.url}
                      alt={item.link.label}
                      width={24}
                      height={24}
                      className={classes.socialIcon}
                    />
                  </Button>
                )
              })}
            </div>
          </div>
        </Gutter>
        <SliderContent text="Get In Contact" />
        <Gutter>
          <div
            className={classes.credit}
            onClick={() => window.open('https://coresconnect.com', '_blank', 'noopener,noreferrer')}
            style={{ cursor: 'pointer' }}
          >
            WEBSITE MAINTAINED & DEVELOPED BY <span className={classes.highlight}>CORES CONNECT</span>
          </div>
        </Gutter>
      </div>
    </footer>
  )
}

export default FooterComponent
