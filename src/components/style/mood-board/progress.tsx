import { cn } from '@/lib/utils';

type ImageProgressIndicatorProps = {
  currentCount: number;
  maxCount: number;
  className?: string;
};

const ImageProgressIndicator = ({
  currentCount,
  maxCount,
  className,
}: ImageProgressIndicatorProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Circular indicators */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxCount }, (_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-200',
              index < currentCount
                ? 'bg-purple-500' // Filled state - matches the purple color in your image
                : 'bg-gray-300' // Empty state
            )}
          />
        ))}
      </div>

      {/* Text indicator */}
      <span className="text-sm font-medium text-gray-700 ml-1">
        {currentCount}/{maxCount} images
      </span>
    </div>
  );
};

export default ImageProgressIndicator;
