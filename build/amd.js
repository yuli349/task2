var modules;
function define(name, args, cb) {
    if (!modules) modules = {};
    if (typeof window === "undefined") {
        var moduleExports = {};
        var actualArgs = args.map(function(arg) {
            if (arg === "require") return require;
            if (arg === "exports") return moduleExports;
            return modules[arg];
        });

        cb.apply(null, actualArgs);

        modules[name] = moduleExports;
    } else {
        var arguments = args.map(function(arg) {
            if (arg === "require") return function() {};
            return window;
        });
        cb.apply(null, arguments);
    }
}
