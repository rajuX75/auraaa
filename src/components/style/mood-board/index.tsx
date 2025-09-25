'use client';

import { MoodBoardImage, useMoodBoard } from '@/hooks/use-styles';
import { cn } from '@/lib/utils';
import ImageBoard from './images-board';

type Props = {
  guideImages: MoodBoardImage[];
};

const MoodBoard = ({ guideImages }: Props) => {
  const { images, dragActive, removeImage, handleDrag, handleDrop, handleFileInput, canAddMore } =
    useMoodBoard(guideImages);
  return (
    <div className="flex flex-col gap-10">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 min-h-[500px] flex items-center justify-center',
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border/50 hover:border-border'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrop}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
        </div>
        {images.length > 5 && (
          <>
            <div className="lg:hidden absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {images.map((image, index) => {
                  const seed = image.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                  const random1 = ((seed * 9301 + 49297) % 2333280) / 233280;
                  const random2 = (((seed + 1) * 9301 + 49297) % 233280) / 233280;
                  const random3 = (((seed + 2) * 9301 + 49297) % 233280) / 233280;
                  const rotation = (random1 - 0.05) * 20;
                  const xOffset = (random2 - 0.05) * 40;
                  const yOffset = (random3 - 0.05) * 30;

                  return (
                    <ImageBoard
                      key={`mobile-${image.id}`}
                      image={image}
                      removeImage={removeImage}
                      xOffset={xOffset}
                      yOffset={yOffset}
                      rotation={rotation}
                      zIndex={index + 1}
                      marginLeft="-80px"
                      marginTop="-96px"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodBoard;
