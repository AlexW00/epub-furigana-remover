import JSZip from "jszip";

export interface ProcessedResult {
	blob: Blob;
	name: string;
	reduction: number;
}

export const processEpubFile = async (file: File): Promise<ProcessedResult> => {
	const zip = new JSZip();
	const originalContent = await file.arrayBuffer();
	const epub = await zip.loadAsync(originalContent);

	// Process each file in the EPUB
	const newZip = new JSZip();

	// Recursively process all files
	for (const [path, zipEntry] of Object.entries(epub.files)) {
		if (zipEntry.dir) {
			newZip.folder(path);
			continue;
		}

		let content: string | Uint8Array;

		// Process HTML/XHTML files
		if (path.endsWith(".html") || path.endsWith(".xhtml")) {
			const textContent = await zipEntry.async("string");

			// First remove rp tags and their contents
			let processed = textContent.replace(/<rp>.*?<\/rp>/g, "");
			// Then remove rt tags and their contents
			processed = processed.replace(/<rt>.*?<\/rt>/g, "");
			// Finally remove empty ruby tags, preserving their contents
			content = processed.replace(/<ruby>(.*?)<\/ruby>/g, "$1");
		} else {
			// Keep non-HTML files as is
			content = await zipEntry.async("uint8array");
		}

		// Preserve the original file path structure
		newZip.file(path, content);
	}

	const processedContent = await newZip.generateAsync({
		type: "blob",
		compression: "DEFLATE", // Use compression to reduce file size
		compressionOptions: {
			level: 9, // Maximum compression
		},
	});

	const outputName = file.name.replace(".epub", "_no_furigana.epub");

	// Calculate size reduction
	const reduction = ((file.size - processedContent.size) / file.size) * 100;

	return {
		blob: processedContent,
		name: outputName,
		reduction: parseFloat(reduction.toFixed(1)),
	};
};

export const validateEpubFile = (file: File): string | null => {
	if (!file.name.toLowerCase().endsWith(".epub")) {
		return "Please select a valid EPUB file";
	}

	if (file.size > 100 * 1024 * 1024) {
		return "File size must be less than 100MB";
	}

	return null;
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
