"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSize?: number;
  required?: boolean;
  className?: string;
  helperText?: string;
  onChange?: (file: File | null) => void;
}

export function FileUpload({
  id,
  label,
  accept = ".pdf,.doc,.docx",
  maxSize = 5, // In MB
  required = false,
  className,
  helperText = `Accepted formats: ${accept.split(",").join(", ")}. Max size: ${maxSize}MB`,
  onChange,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("No file selected");
  const [fileSize, setFileSize] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setError("");

    if (!files || files.length === 0) {
      setFileName("No file selected");
      setFileSize("");
      if (onChange) onChange(null);
      return;
    }

    const file = files[0];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      e.target.value = "";
      setFileName("No file selected");
      setFileSize("");
      if (onChange) onChange(null);
      return;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Accepted formats: ${accept}`);
      e.target.value = "";
      setFileName("No file selected");
      setFileSize("");
      if (onChange) onChange(null);
      return;
    }

    setFileName(file.name);
    setFileSize(`(${fileSizeInMB.toFixed(2)} MB)`);
    if (onChange) onChange(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          required={required}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Choose File
          </button>
          <span className="text-sm text-muted-foreground">
            {fileName} {fileSize}
          </span>
        </div>
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    </div>
  );
} 