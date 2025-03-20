
import { useState } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  onImageError: () => void;
}

const ImagePreview = ({ imageUrl, onImageError }: ImagePreviewProps) => {
  if (!imageUrl) return null;
  
  return (
    <div className="relative mt-2 rounded-md overflow-hidden aspect-video bg-gray-100">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-full object-cover"
        onError={onImageError}
      />
    </div>
  );
};

export default ImagePreview;
