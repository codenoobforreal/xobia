// Custom error start
export class FileReaderError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = "FileReaderError";
	}
}
// Custom error end

// Test util start

// Test util end
