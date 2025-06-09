import React from 'react';
import './HomeView.css';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import Footer from '../components/Footer';
import Genres from '../components/Genres';

const HomeView = () => {
  return (
    <div className="home-view">
      <Header />
      <div className="main-layout">
        <div className="sidebar">
          <Genres />
        </div>
        <div className="content-area">
          <Hero />
          <Feature />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeView;
