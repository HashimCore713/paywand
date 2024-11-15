'use client'

import React, { useEffect, useRef, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Category, Header } from '../../../../payload/payload-types';
import { fetchCategories, fetchGlobals } from '../../../_api/fetchGlobals';
import { useFilter } from '../../../_providers/Filter';
import { Gutter } from '../../Gutter';
import SearchBar from '../../SearchBar';
import { HeaderNav } from '../Nav';

import classes from './index.module.scss';

const HeaderComponent = () => {
  const pathname = usePathname();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [header, setHeader] = useState<Header | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { header } = await fetchGlobals();
        setHeader(header);

        // Fetch categories using the updated fetchCategories function
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 540);
      setIsMediumScreen(window.innerWidth <= 540 && window.innerWidth > 370);
    };

    handleResize(); // Set the initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (currentScrollTop > lastScrollTop) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const toggleSearchBar = () => {
    setSearchOpen(prev => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const { setCategoryFilters } = useFilter();

  return (
    <nav className={[classes.header, !navVisible && classes.hideNav].filter(Boolean).join(' ')}>
      <Gutter className={classes.wrap}>
        <Link href="/">
          <Image src="/logo-black.svg" alt="logo" max-width={170} width={170} height={50} />
        </Link>
        {isLargeScreen && <SearchBar />}
        {isMediumScreen && (
          <div className={classes.searchIcon} onClick={toggleSearchBar}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
        )}
        <div className={classes.navContainer} ref={menuRef}>
          <button className={classes.menuIcon} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <HeaderNav header={header} categories={categories} menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
        </div>
        {!isMediumScreen && (
          <div className={classes.searchIcon} onClick={toggleSearchBar}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
        )}
        {searchOpen && !isLargeScreen && <SearchBar />}
      </Gutter>
    </nav>
  );
};

export default HeaderComponent;

