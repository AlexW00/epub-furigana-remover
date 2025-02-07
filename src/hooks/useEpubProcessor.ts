import { useState } from "react";
import { processEpubFile, validateEpubFile } from "../services/epubService";

export interface FileInfo {
	name: string;
	size: number;
}

export interface SuccessInfo {
	name: string;
	reduction: number;
}

export const useEpubProcessor = () => {
	const [file, setFile] = useState<File | null>(null);
	const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<SuccessInfo | null>(null);

	const handleFileSelect = (selectedFile: File | null) => {
		setError(null);
		setSuccess(null);

		if (!selectedFile) return;

		const validationError = validateEpubFile(selectedFile);
		if (validationError) {
			setError(validationError);
			return;
		}

		setFile(selectedFile);
		setFileInfo({
			name: selectedFile.name,
			size: selectedFile.size,
		});
	};

	const processFile = async () => {
		if (!file) return;

		try {
			setIsProcessing(true);
			setError(null);
			setSuccess(null);

			const result = await processEpubFile(file);

			// Create download link
			const url = URL.createObjectURL(result.blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = result.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			setSuccess({
				name: result.name,
				reduction: result.reduction,
			});
		} catch (err) {
			setError(
				"Error processing EPUB file. Please ensure it's a valid EPUB format."
			);
			console.error(err);
		} finally {
			setIsProcessing(false);
		}
	};

	return {
		file,
		fileInfo,
		isProcessing,
		error,
		success,
		handleFileSelect,
		processFile,
	};
};
