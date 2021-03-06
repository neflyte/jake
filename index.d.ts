/// <reference types="node" />

// Type definitions for jake
// Based on definitions by: Kon <http://phyzkit.net/>

/**
 * Invoke Jake directly with optional arguments
 * @param args Jake CLI arguments
 */
declare function run(...args: any[]): void;

/**
 * Completes an asynchronous task, allowing Jake's execution to proceed to the next task
 * @param value A value to return from the task.
 */
declare function complete(value?: any): void;

/**
 * Creates a description for a Jake Task (or FileTask, DirectoryTask). When invoked, the description that is created will be associated with whatever Task is created next.
 * @param description The description for the Task
 */
declare function desc(description:string): void;

/**
 * Creates a Jake DirectoryTask. Can be used as a prerequisite for FileTasks, or for simply ensuring a directory exists for use with a Task's action.
 * @param name The name of the DirectoryTask
 */
declare function directory(name:string): jake.DirectoryTask;

/**
 * Causes Jake execution to abort with an error. Allows passing an optional error code, which will be used to set the exit-code of exiting process.
 * @param err The error to throw when aborting execution. If this argument is an Error object, it will simply be thrown. If a String, it will be used as the error-message. (If it is a multi-line String, the first line will be used as the Error message, and the remaining lines will be used as the error-stack.)
 */
declare function fail(...err:string[]): void;
declare function fail(...err:Error[]): void;
declare function fail(...err:any[]): void;

/**
 * The shape of a FileTask action
 */
declare type TFileTaskAction = (this: jake.FileTask) => void;

/**
 * Creates a Jake FileTask.
 * @param name The name of the Task
 * @param prereqs Prerequisites to be run before this task
 * @param action The action to perform for this task
 * @param opts Perform this task asynchronously. If you flag a task with this option, you must call the global `complete` method inside the task's action, for execution to proceed to the next task.
 */
declare function file(name:string, prereqs?:string[], action?:TFileTaskAction, opts?:jake.FileTaskOptions): jake.FileTask;

/**
 * The shape of a Rule (FileTask) action
 */
declare type TRuleAction = () => void;

/**
 * Creates Jake FileTask from regex patterns
 * @param pattern name/regex of the Task
 * @param source calculated from the name pattern
 * @param prereqs Prerequisites to be run before this task
 * @param action The action to perform for this task
 * @param opts Perform this task asynchronously. If you flag a task with this option, you must call the global `complete` method inside the task's action, for execution to proceed to the next task.
 */
declare function rule(pattern: RegExp, source: string | { (name: string): string; }, prereqs?: string[], action?: TRuleAction, opts?: jake.TaskOptions): void;

/**
 * The shape of the namespace scope function
 */
declare type TNamespaceScope = () => void;

/**
 * Creates a namespace which allows logical grouping of tasks, and prevents name-collisions with task-names. Namespaces can be nested inside of other namespaces.
 * @param name The name of the namespace
 * @param scope The enclosing scope for the namespaced tasks
 */
declare function namespace(name:string, scope:TNamespaceScope): void;

/**
 * The shape of a Task action
 */
declare type TTaskAction = (this: jake.Task, ...params: any[]) => any;

/**
 * @param name The name of the Task
 * @param prereqs Prerequisites to be run before this task
 * @param action The action to perform for this task
 * @param opts
 */
declare function task(name:string, prereqs?:string[], action?:TTaskAction, opts?:jake.TaskOptions): jake.Task;
declare function task(name:string, action?:TTaskAction, opts?:jake.TaskOptions): jake.Task;
declare function task(name:string, opts?:jake.TaskOptions, action?:TTaskAction): jake.Task;

/**
 * The shape of the NPMPublishTask definition
 */
declare type TNPMPublishTaskDefinition = () => void;

/**
 * @param name The name of the NpmPublishTask
 * @param packageFiles The files to include in the package
 */
declare function npmPublishTask(name:string, packageFiles:string[]): jake.NpmPublishTask;
/**
 * @param name The name of the NpmPublishTask
 * @param definition A function that creates the package definition
 */
declare function npmPublishTask(name:string, definition?:TNPMPublishTaskDefinition): jake.NpmPublishTask;


declare namespace jake{

    ////////////////////////////////////////////////////////////////////////////////////
	// File-utils //////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////

	export interface UtilOptions{
		silent?: boolean;
	}

	export type TMkdirPCallback = (er:Error, made:any) => void;

	/**
	 * The jake.mkdirP utility recursively creates a set of nested directories. It will not throw an error if any of the directories already exists.
	 * https://github.com/substack/node-mkdirp
	 */
	export function mkdirP(name:string, mode?:string, f?:TMkdirPCallback): void;
	export function mkdirP(name:string, f?:TMkdirPCallback): void;

	export type TCpRCallback = (err?: Error) => void;

	/**
	 * The jake.cpR utility does a recursive copy of a file or directory.
	 * Note that this command can only copy files and directories; it does not perform globbing (so arguments like '*.txt' are not possible).
	 * @param path the file/directory to copy,
	 * @param destination the destination.
	 * @param opts additional options
	 * @param callback Callback function
	 */
	export function cpR(path:string, destination:string, opts?:UtilOptions, callback?:TCpRCallback): void;
	export function cpR(path:string, destination:string, callback?:TCpRCallback): void;

	/**
	 * The jake.readdirR utility gives you a recursive directory listing, giving you output somewhat similar to the Unix find command. It only works with a directory name, and does not perform filtering or globbing.
	 * @return an array of file paths for all files in the 'pkg' directory, and all its subdirectories.
	 */
	export function readdirR(name:string, opts?:UtilOptions): string[];

	/**
	 * The jake.rmRf utility recursively removes a directory and all its contents.
	 */
	export function rmRf(name:string, opts?:UtilOptions): void;

	//////////////////////////////////////////////////////////////////////////////////////////////
	// Running shell-commands ////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////

	export interface ExecOptions{
		/**
		 * print to stdout, default false
		 */
		printStdout?:boolean;
		/**
		 * print to stderr, default false
		 */
		printStderr?:boolean;
		/**
		 * stop execution on error, default true
		 */
		breakOnError?:boolean;
		/**
		*
		*/
		windowsVerbatimArguments?: boolean
	}
	export type TExecCallback = () => void;
	export function exec(cmds:string[], callback?:TExecCallback, opts?:ExecOptions):void;


	/**
	 * @event cmdStart When a new command begins to run. Passes one arg, the command being run.
	 * @event cmdEnd When a command finishes. Passes one arg, the command being run.
	 * @event stdout When the stdout for the child-process receives data. This streams the stdout data. Passes one arg, the chunk of data.
	 * @event stderr When the stderr for the child-process receives data. This streams the stderr data. Passes one arg, the chunk of data.
	 * @event error When a shell-command
	 */
	export interface Exec extends NodeJS.EventEmitter {
		append(cmd:string): void;
		run(): void;
	}

	export function createExec(cmds:string[] | string, callback?:TExecCallback, opts?:ExecOptions ):Exec;
	export function createExec(cmds:string[] | string, opts?:ExecOptions,  callback?:TExecCallback):Exec;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Logging and output ////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////

	export interface Logger{
		log(value:any): void;
		error(value:any): void;
	}

	export var logger: Logger;

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// program ////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	export interface IProgram {
		opts: Record<string, any> & { quiet: boolean; };
		taskNames: string[];
		taskArgs: string[];
		envVars: Record<string, string>;
	}
	export var program: IProgram;

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Tasks /////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////


	export interface TaskOptions{
		/**
		 * Perform this task asynchronously. If you flag a task with this option, you must call the global `complete` method inside the task's action, for execution to proceed to the next task.
		 * @default false
		 */
		async?: boolean;
		/**
		 * number of parllel async tasks
		*/
		parallelLimit?: number;
		/**
		 * Run prerequisites asynchronously
		 * @default false
		 */
		syncPrereqs?: boolean;
	}

	/**
	 * A Jake Task
	 *
	 * @event complete
	 */
	export class Task extends NodeJS.EventEmitter {
		/**
		 * Allow accessing properties by string
		 */
		[key: string]: any;

		/**
		 * Task Constructor
		 * @param name The name of the Task
		 * @param prereqs Prerequisites to be run before this task
		 * @param action The action to perform for this task
		 * @param opts Perform this task asynchronously. If you flag a task with this option, you must call the global `complete` method inside the task's action, for execution to proceed to the next task.
		 */
		constructor(name:string, prereqs?:string[], action?:TTaskAction, opts?:TaskOptions);

		/**
		 * Runs prerequisites, then this task. If the task has already been run, will not run the task again.
		 */
		invoke(...args: any[]): void;

		/**
		 * Runs this task, without running any prerequisites. If the task has already been run, it will still run it again.
		 */
		reenable(): void;

		/**
		 * Re-enables and runs the task
		 */
		execute(...args: any[]): void;

		addListener(event: string, listener: Function): this;
		on(event: string, listener: Function): this;
		once(event: string, listener: Function): this;
		removeListener(event: string, listener: Function): this;
		removeAllListeners(event?: string): this;
		setMaxListeners(n: number): this;
		getMaxListeners(): number;
		listeners(event: string): Function[];
		emit(event: string, ...args: any[]): boolean;
		listenerCount(type: string): number;
		complete(value?: any): void;
		value: any;

		name?: string;
		prereqs?: string[];
		action?: (...params: any[]) => any;
		taskStatus?: string;
		async?: boolean;
		description?: string;
		fullName: string;
	}

	export class DirectoryTask extends FileTask {
		/**
         * @param name The name of the directory to create.
		 */
		constructor(name:string);
	}

	export interface FileTaskOptions{
		/**
		 * Perform this task asynchronously. If you flag a task with this option, you must call the global `complete` method inside the task's action, for execution to proceed to the next task.
		 * @default false
		 */
		async?: boolean;
	}

	export class FileTask extends Task{
		/**
		 * @param name The name of the Task
		 * @param prereqs Prerequisites to be run before this task
		 * @param action The action to perform to create this file
		 * @param opts Perform this task asynchronously. If you flag a task with this option, you must call the global `complete` method inside the task's action, for execution to proceed to the next task.
	     */
		constructor(name:string, prereqs?:string[], action?:TFileTaskAction, opts?:FileTaskOptions);
	}

	export interface FileFilter{
		(filename:string): boolean;
	}

	export class FileList{
		constructor();

		/**
	     * Includes file-patterns in the FileList. Should be called with one or more
		 * pattern for finding file to include in the list. Arguments should be strings
		 * for either a glob-pattern or a specific file-name, or an array of them
		 */
		include(files:string[]): void;
		include(...files:string[]): void;

		/**
		 * Indicates whether a particular file would be filtered out by the current
		 * exclusion rules for this FileList.
		 * @param name The filename to check
         * @return Whether or not the file should be excluded
         */
		shouldExclude(name:string): boolean;

		/**
		 * Excludes file-patterns from the FileList. Should be called with one or more
		 * pattern for finding file to include in the list. Arguments can be:
		 * 1. Strings for either a glob-pattern or a specific file-name
		 * 2. Regular expression literals
		 * 3. Functions to be run on the filename that return a true/false
		 */
		exclude(file:string[]): void;
		exclude(...file:string[]): void;
		exclude(file:RegExp[]): void;
		exclude(...file:RegExp[]): void;
		exclude(file:FileFilter[]): void;
		exclude(...file:FileFilter[]): void;

		/**
		 * Populates the FileList from the include/exclude rules with a list of
		 * actual files
		 */
		resolve(): void;

		/**
		 * Convert to a plain-jane array
		 */
		toArray(): string[];

		/**
	 	 * Get rid of any current exclusion rules
      	 */
  		clearExclude(): void;
	}

	export class PackageTask{
        /**
         * Instantiating a PackageTask creates a number of Jake Tasks that make packaging and distributing your software easy.
         * @param name The name of the project
         * @param version The current project version (will be appended to the project-name in the package-archive
         * @param definition Defines the contents of the package, and format of the package-archive. Will be executed on the instantiated PackageTask (i.e., 'this', will be the PackageTask instance), to set the various instance-propertiess.
         */
		constructor(name:string, version:string, definition:()=>void);

		/**
		 * 	Equivalent to the '-C' command for the `tar` and `jar` commands. ("Change to this directory before adding files.")
		 */
		archiveChangeDir: string;

		/**
		 * Specifies the files and directories to include in the package-archive. If unset, this will default to the main package directory -- i.e., name + version.
         */
     	archiveContentDir: string;

     	/**
     	 * The shell-command to use for creating jar archives.
         */
        jarCommand: string;

        /**
         * Can be set to point the `jar` utility at a manifest file to use in a .jar archive. If unset, one will be automatically created by the `jar` utility. This path should be relative to the root of the package directory (this.packageDir above, likely 'pkg')
         */
        manifestFile: string;

        /**
         * The name of the project
         */
		name: string;

		/**
		 * If set to true, uses the `jar` utility to create a .jar archive of the package
		 */
		needJar: boolean;

		/**
         * If set to true, uses the `tar` utility to create a gzip .tgz archive of the package
         */
        needTar: boolean;

        /**
         * If set to true, uses the `tar` utility to create a bzip2 .bz2 archive of the package
         */
		needTarBz2: boolean;

		/**
         * If set to true, uses the `zip` utility to create a .zip archive of the package
		 */
		needZip: boolean;

		/**
		 * The list of files and directories to include in the package-archive
         */
        packageFiles: FileList;

        /**
         * The shell-command to use for creating tar archives.
         */
        tarCommand: string;

        /**
         * The project version-string
		 */
		version: string;

		/**
		 * The shell-command to use for creating zip archives.
		 */
		zipCommand: string;

	}

	export class TestTask{
		constructor(name:string, definition?:()=>void);
	}

	export class NpmPublishTask{
		constructor(name:string, packageFiles:string[]);
		constructor(name:string, definition?:TNPMPublishTaskDefinition);
	}

	export function addListener(event: string, listener: Function): NodeJS.EventEmitter;
	export function on(event: string, listener: Function): NodeJS.EventEmitter;
	export function once(event: string, listener: Function): NodeJS.EventEmitter;
	export function removeListener(event: string, listener: Function): NodeJS.EventEmitter;
	export function removeAllListener(event: string): NodeJS.EventEmitter;
	export function setMaxListeners(n: number): void;
	export function listeners(event: string): Function[];
	export function emit(event: string, ...args: any[]): boolean;
}
