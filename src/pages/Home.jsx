import React from 'react';
import Hero from '../components/sections/Hero';
import SelectedWork from '../components/sections/SelectedWork';
import About from '../components/sections/About';
import Process from '../components/sections/Process';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SelectedWork />
      <Process />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
