'use client'

import React from 'react'
import { Media } from '../../_components/Media'
import classes from './index.module.scss'

interface ImageGalleryProps {
  metaImage: any
  gallery: any[]
  onThumbnailClick: (image: any) => void
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ metaImage, gallery, onThumbnailClick }) => {
  return (
    <div className={classes.galleryWrapper}>
      <div className={classes.mainImage}>
        <Media imgClassName={classes.image} resource={metaImage} fill />
      </div>
      <div className={classes.thumbnails}>
        {gallery.map((image, index) => (
          <div
            key={index}
            className={`${classes.thumbnail} ${metaImage === image ? classes.selected : ''}`}
            onClick={() => onThumbnailClick(image)}
          >
            <Media imgClassName={classes.thumbnailImage} resource={image} fill />
          </div>
        ))}
      </div>
    </div>
  )
}
