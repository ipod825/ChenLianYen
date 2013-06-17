/*  
 * Class: ConsoleLogger
 *     The interface to access logger is the function log(string)
 *     This is one kind of logger that will write all messages to console
 */
var ConsoleLogger = function()
{
    // For logging
    this.tag = "[ConsoleLogger]: ";        // The tag used to debug this class
    this.logLevel = this.LOG_LEVEL_DEBUG;  // Default log level is debug
};

// Prototype
ConsoleLogger.prototype = {
    // Log Levels, level with bigger number will log to function calls
    // with log level smaller
    LOG_LEVEL_NONE    : 6,
    LOG_LEVEL_ERROR   : 5,
    LOG_LEVEL_WARNING : 4,
    LOG_LEVEL_DEBUG   : 3,
    LOG_LEVEL_INFO    : 2,
    LOG_LEVEL_VERBOSE : 1,
    LOG_LEVEL_ALL     : 0,

    /*
     * Function: setLogLevel
     *     This function set the log level of the logger. For those logging
     *     methods with lower logging level than the log level of the logger,
     *     those logs are not going to be printed in console
     * 
     * Parameters: 
     *     level - the logging level in string form
     */
    setLogLevel : function(level)
    {
        switch(level)
        {
            case "none":
                this.logLevel = this.LOG_LEVEL_NONE;
                break;
            case "error":
                this.logLevel = this.LOG_LEVEL_ERROR;
                break;
            case "warning":
                this.logLevel = this.LOG_LEVEL_WARNING;
                break;
            case "info":
                this.logLevel = this.LOG_LEVEL_INFO;
                break;
            case "debug":
                this.logLevel = this.LOG_LEVEL_DEBUG;
                break;
            case "verbose":
                this.logLevel = this.LOG_LEVEL_VERBOSE;
                break;
            case "all":
                this.logLevel = this.LOG_LEVEL_ALL;
                break;
            default:
                console.log(this.tag + "log level not defined");
                this.logLevel = this.LOG_LEVEL_DEBUG;
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
        if(this.logLevel <= this.LOG_LEVEL_ERROR)
        { this.log("E: " + tag, message); }
    },

    warning : function(tag, message)
    {
        if(this.logLevel <= this.LOG_LEVEL_WARNING)
        { this.log("W: " + tag, message); }
    },

    verbose : function(tag, message)
    {
        if(this.logLevel <= this.LOG_LEVEL_VERBOSE)
        { this.log("V: " + tag, message); }
    },

    debug : function(tag, message)
    {
        if(this.logLevel <= this.LOG_LEVEL_DEBUG)
        { this.log("D: " + tag, message); }
    },

    info : function(tag, message)
    {
        if(this.logLevel <= this.LOG_LEVEL_INFO)
        { this.log("I: " + tag, message); }
    }
};

