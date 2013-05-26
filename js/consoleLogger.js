/*  
 *  The interface to access logger is the function log(string)
 *  This is one kind of logger that will write all messages to console
 */

// Constructor
var ConsoleLogger = function()
{
	// The tag used to debug this class
	this.tag = "[ConsoleLogger]: ";
	// Default log level is warning
	this.logLevel = this.LOG_LEVEL_WARNING;
};

// Prototype
ConsoleLogger.prototype = {
	// Log Levels, level with bigger number will log to function calls
	// with log level smaller
	LOG_LEVEL_ERROR   : 5,
	LOG_LEVEL_WARNING : 4,
	LOG_LEVEL_INFO    : 3,
	LOG_LEVEL_DEBUG   : 2,
	LOG_LEVEL_VERBOSE : 1,
	LOG_LEVEL_NONE    : 0,

	setLogLevel : function(level)
	{
		switch(level)
		{
			case "error":
				this.logLevel = this.LOG_LEVEL_ERROR;
				break;
			case "warning":
				this.logLevel = this.LOG_LEVEL_WARNING;
				break;
			case "verbose":
				this.logLevel = this.LOG_LEVEL_VERBOSE;
				break;
			case "debug":
				this.logLevel = this.LOG_LEVEL_DEBUG;
				break;
			case "info":
				this.logLevel = this.LOG_LEVEL_INFO;
				break;
			case "none":
				this.logLevel = this.LOG_LEVEL_INFO;
				break;
			default:
				console.log(this.tag + "log level not defined");
				this.logLevel = this.LOG_LEVEL_NONE;
				break;
		}
	},

	log : function(tag, message)
	{
		var string = "";
		if(tag)     string += tag;
		if(message) string += message;
		console.log(string);
	},

	error : function(tag, message)
	{
		if(this.logLevel >= this.LOG_LEVEL_ERROR)
		{
			this.log("E: " + tag, message);
		}
	},

	warning : function(tag, message)
	{
		if(this.logLevel >= this.LOG_LEVEL_WARNING)
		{
			this.log("W: " + tag, message);
		}
	},

	verbose : function(tag, message)
	{
		if(this.logLevel >= this.LOG_LEVEL_VERBOSE)
		{
			this.log("V: " + tag, message);
		}
	},

	debug : function(tag, message)
	{
		if(this.logLevel >= this.LOG_LEVEL_DEBUG)
		{
			this.log("D: " + tag, message);
		}
	},

	info : function(tag, message)
	{
		if(this.logLevel >= this.LOG_LEVEL_INFO)
		{
			this.log("I: " + tag, message);
		}
	}
};

