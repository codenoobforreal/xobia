// start of json type
// generate from https://jvilk.com/MakeTypes/
export interface Task {
	category: string;
	category_translation: string;
	tasks: TasksEntity[];
}

export interface TasksEntity {
	task: string;
	id: string;
	description: string;
	supported: boolean;
	translation: TaskTranslation;
	model?: string | null;
}

export interface TaskTranslation {
	task: string;
	id: string;
	description: string;
	supported: string;
}
// end of json type

// start of error type

export interface FileReaderError extends Error {
	name: "FileReaderError";
}

// end of error type
