import { useState, useEffect } from "react";
import Image from "next/image";

import photo1 from "@/app/assets/photos/1.png";
import photo2 from "@/app/assets/photos/2.png";
import photo3 from "@/app/assets/photos/3.png";
import photo4 from "@/app/assets/photos/4.png";
import photo5 from "@/app/assets/photos/5.png";

const images = [
  { src: photo1, caption: "Image 1" },
  { src: photo2, caption: "Image 2" },
  { src: photo3, caption: "Image 3" },
  { src: photo4, caption: "Image 4" },
  { src: photo5, caption: "Image 5" },
];

const AutoCarousel: React.FC = () => {
  return (
    <div className="relative w-full h-[40rem] overflow-hidden">
      <div className="carousel-track-container">
        {/* Single carousel track with all images twice for seamless looping */}
        <div className="carousel-track">
          {images.map((image, index) => (
            <div key={index} className="image-container relative w-full mx-2">
              <Image
                src={image.src}
                width={2000}
                height={2000}
                className="object-cover"
                alt={`Slide ${index + 1}`}
              />
              <div className="absolute bottom-5 left-5 bg-black text-white px-4 py-2 opacity-75 rounded-lg">
                {image.caption}
              </div>
            </div>
          ))}

          {/* Duplicate the images for seamless loop */}
          {images.map((image, index) => (
            <div
              key={index + images.length}
              className="image-container relative w-full mx-2"
            >
              <Image
                src={image.src}
                width={2000}
                height={2000}
                className="object-cover"
                alt={`Slide ${index + 1}`}
              />
              <div className="absolute bottom-5 left-5 bg-black text-white px-4 py-2 opacity-75 rounded-lg">
                {image.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-track-container {
          width: 100%;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          animation: slide 70s linear infinite; /* Adjusted duration for 5 images */
        }

        .image-container {
          flex: 0 0 100%; /* Ensure that each image takes the full width of the container */
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              -500%
            ); /* Move the entire width of two sets of images */
          }
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AutoCarousel;
