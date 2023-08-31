import React from 'react'
import { EmblaCarousel } from './carousel'
import './embla.css'
import {images} from './imageByIndex'

const OPTIONS = { loop: true }
const SLIDES = Array.from(Array(images.length).keys())

export const Banner = () => (
  <main className="sandbox">
    <section className="sandbox__carousel">
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </section>
  </main>
)