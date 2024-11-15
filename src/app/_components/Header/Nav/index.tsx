'use client'

import React from 'react';
import Link from 'next/link';
import { PiShoppingCart } from 'react-icons/pi';
import { PiUser } from 'react-icons/pi';
import { FaSignInAlt } from 'react-icons/fa';
import { PiShoppingBagOpen } from 'react-icons/pi';

import { Category, Header as HeaderType } from '../../../../payload/payload-types';
import { useAuth } from '../../../_providers/Auth';
import { useFilter } from '../../../_providers/Filter';
import { Button } from '../../Button';
import { CartLink } from '../../CartLink';

import classes from './index.module.scss';

interface HeaderNavProps {
  header: HeaderType;
  categories: Category[]; // Include categories as a prop
  menuOpen: boolean;
  closeMenu: () => void; // Add this prop to close the menu
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ header, categories, menuOpen, closeMenu }) => {
  const { user } = useAuth();
  const { setCategoryFilters } = useFilter();

  const navItems = [
    { icon: <PiShoppingBagOpen className={classes.icon} />, link: '/products' },
    user && { icon: <PiUser className={classes.icon} />, link: '/account' },
    { icon: <PiShoppingCart className={classes.icon} />, component: <CartLink /> },
    !user && {
      icon: <FaSignInAlt />,
      component: (
        <Button
          el="link"
          href="/login"
          label="Login"
          appearance="primary"
          onClick={() => {
            closeMenu();
            window.location.href = '/login';
          }}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <nav
      className={[
        classes.nav,
        user === undefined && classes.hide,
        menuOpen && classes.showMenu,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {categories.map((category, i) => (
        <div key={i} className={classes.navItem}>
          <Link
            href="/products"
            onClick={() => {
              setCategoryFilters([category.id]);
              closeMenu(); // Close menu on click
            }}
            className={classes.categoryLink}
          >
            {category.title}
          </Link>
          {navItems[i] && (
            <>
              {navItems[i].link ? (
                <Link
                  href={navItems[i].link}
                  onClick={closeMenu} // Close menu on click
                >
                  {navItems[i].icon}
                </Link>
              ) : (
                navItems[i].component
              )}
            </>
          )}
        </div>
      ))}
      {categories.length < navItems.length &&
        navItems.slice(categories.length).map((navItem, i) => (
          <div key={`extra-${i}`} className={classes.navItem}>
            {navItem.link ? (
              <Link
                href={navItem.link}
                onClick={closeMenu} // Close menu on click
              >
                {navItem.icon}
              </Link>
            ) : (
              navItem.component
            )}
          </div>
        ))}
    </nav>
  );
};
