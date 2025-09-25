import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const UploadStatus = (image: { uploading: boolean; uploaded: boolean; error?: string }) => {
  if (image.uploading) {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
        <Loader2 className="h-6 w-6 text-white animate-spin" />
      </div>
    );
  }
  if (image.uploaded) {
    return (
      <div className="absolute top-2 right-2">
        <CheckCircle className="w-5 h-5 text-green-400" />
      </div>
    );
  }
  if (image.error) {
    return (
      <div className=" absolute top-2 right-2">
        <AlertCircle className="w-5 h-5 text-red-400" />
      </div>
    );
  }
  return null;
};

export default UploadStatus;
