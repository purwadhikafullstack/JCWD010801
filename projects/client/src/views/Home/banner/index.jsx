import React from 'react'
import { EmblaCarousel } from './carousel'
import './embla.css'
import {images} from './imageByIndex'

const OPTIONS = { loop: true }
// const SLIDES = Array.from(Array(images.length).keys())
const SLIDES = Array.from(Array(images.length).keys())
console.log(SLIDES)

export const Banner = ({ slides, options }) => {
    return (
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    )
}