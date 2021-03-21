var modules;
function define(name, args, cb) {
    if (!modules) modules = {};

    // NodeJS
    if (typeof window === "undefined") {
        var moduleExports = {};
        var actualArgs = args.map(function(arg) {
            if (arg === "require") return require;
            if (arg === "exports") return moduleExports;
            return modules[arg];
        });

        cb.apply(null, actualArgs);

        modules[name] = moduleExports;

        // Main module
        if (name === "index") {
            module.exports = moduleExports;
        }
    }

    // Browser
    else {
        // Not implemented...
    }
}
