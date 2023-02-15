"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile_typescript = exports.read_tsconfig = exports.parse_tsconfig = exports.compile_files = exports.default_transformers = exports.compiler_host = exports.report_diagnostics = exports.is_failed = void 0;
const chalk_1 = __importDefault(require("chalk"));
const typescript_1 = __importDefault(require("typescript"));
const path_1 = require("path");
const transforms = __importStar(require("./transforms"));
const error_1 = require("./error");
function is_failed(obj) {
    return "diagnostics" in obj && obj.diagnostics != null;
}
exports.is_failed = is_failed;
function normalize(path) {
    return path.replace(/\\/g, "/");
}
const diagnostics_host = {
    getCanonicalFileName: (path) => path,
    getCurrentDirectory: typescript_1.default.sys.getCurrentDirectory,
    getNewLine: () => typescript_1.default.sys.newLine,
};
function report_diagnostics(diagnostics) {
    const errors = typescript_1.default.sortAndDeduplicateDiagnostics(diagnostics);
    const text = typescript_1.default.formatDiagnosticsWithColorAndContext(errors, diagnostics_host);
    return { count: errors.length, text };
}
exports.report_diagnostics = report_diagnostics;
function compiler_host(inputs, options, bokehjs_dir) {
    const default_host = typescript_1.default.createIncrementalCompilerHost(options);
    const host = {
        ...default_host,
        fileExists(name) {
            return inputs.get(name) != null || default_host.fileExists(name);
        },
        readFile(name) {
            return inputs.get(name) != null ? inputs.get(name) : default_host.readFile(name);
        },
        getSourceFile(name, target, _onError) {
            const source = inputs.get(name);
            if (source != null) {
                const sf = typescript_1.default.createSourceFile(name, source, target);
                const version = default_host.createHash(source);
                return { ...sf, version }; // version is internal to the compiler
            }
            else
                return default_host.getSourceFile(name, target, _onError);
        },
    };
    if (bokehjs_dir != null) {
        host.getDefaultLibLocation = () => {
            // bokeh/server/static or bokehjs/build
            if ((0, path_1.basename)(bokehjs_dir) == "static")
                return (0, path_1.join)(bokehjs_dir, "lib");
            else
                return (0, path_1.join)((0, path_1.dirname)(bokehjs_dir), "node_modules/typescript/lib");
        };
    }
    return host;
}
exports.compiler_host = compiler_host;
function default_transformers(options) {
    const transformers = {
        before: [],
        after: [],
        afterDeclarations: [],
    };
    const insert_class_name = transforms.insert_class_name();
    transformers.before.push(insert_class_name);
    const base = options.baseUrl;
    if (base != null) {
        const relativize_modules = transforms.relativize_modules((file, module_path) => {
            if (!module_path.startsWith(".") && !module_path.startsWith("/")) {
                const module_file = (0, path_1.join)(base, module_path);
                if (typescript_1.default.sys.fileExists(module_file) ||
                    typescript_1.default.sys.fileExists(`${module_file}.ts`) ||
                    typescript_1.default.sys.fileExists((0, path_1.join)(module_file, "index.ts")) ||
                    options.outDir != null && typescript_1.default.sys.fileExists((0, path_1.join)(options.outDir, `${module_path}.js`))) {
                    const rel_path = normalize((0, path_1.relative)((0, path_1.dirname)(file), module_file));
                    return rel_path.startsWith(".") ? rel_path : `./${rel_path}`;
                }
            }
            return null;
        });
        transformers.after.push(relativize_modules);
        transformers.afterDeclarations.push(relativize_modules);
    }
    return transformers;
}
exports.default_transformers = default_transformers;
function compile_files(inputs, options, transformers, host) {
    const program = typescript_1.default.createIncrementalProgram({ rootNames: inputs, options, host });
    const emitted = program.emit(undefined, undefined, undefined, false, transformers);
    const diagnostics = [
        ...program.getConfigFileParsingDiagnostics(),
        ...program.getSyntacticDiagnostics(),
        ...program.getOptionsDiagnostics(),
        ...program.getGlobalDiagnostics(),
        ...program.getSemanticDiagnostics(),
        ...emitted.diagnostics,
    ];
    return diagnostics.length != 0 ? { diagnostics } : {};
}
exports.compile_files = compile_files;
function parse_tsconfig(tsconfig_json, base_dir, preconfigure) {
    const host = {
        useCaseSensitiveFileNames: typescript_1.default.sys.useCaseSensitiveFileNames,
        readDirectory: typescript_1.default.sys.readDirectory,
        fileExists: typescript_1.default.sys.fileExists,
        readFile: typescript_1.default.sys.readFile,
    };
    const tsconfig = typescript_1.default.parseJsonConfigFileContent(tsconfig_json, host, base_dir, preconfigure);
    if (tsconfig.errors.length != 0) {
        return { diagnostics: tsconfig.errors };
    }
    return { files: tsconfig.fileNames, options: tsconfig.options };
}
exports.parse_tsconfig = parse_tsconfig;
function read_tsconfig(tsconfig_path, preconfigure) {
    const tsconfig_file = typescript_1.default.readConfigFile(tsconfig_path, typescript_1.default.sys.readFile);
    if (tsconfig_file.error != null) {
        return { diagnostics: [tsconfig_file.error] };
    }
    return parse_tsconfig(tsconfig_file.config, (0, path_1.dirname)(tsconfig_path), preconfigure);
}
exports.read_tsconfig = read_tsconfig;
function compile_project(tsconfig_path, config) {
    const tsconfig = read_tsconfig(tsconfig_path);
    if (is_failed(tsconfig))
        return { diagnostics: tsconfig.diagnostics };
    const { files, options } = tsconfig;
    const transformers = default_transformers(tsconfig.options);
    const inputs = config.inputs?.(files) ?? new Map();
    const host = compiler_host(inputs, options, config.bokehjs_dir);
    const input_files = [...inputs.keys(), ...files];
    return compile_files(input_files, options, transformers, host);
}
function compile_typescript(tsconfig_path, config = {}) {
    const result = compile_project(tsconfig_path, config);
    if (is_failed(result)) {
        const { count, text } = report_diagnostics(result.diagnostics);
        throw new error_1.BuildError("typescript", `There were ${chalk_1.default.red(`${count}`)} TypeScript errors:\n${text}`);
    }
}
exports.compile_typescript = compile_typescript;
//# sourceMappingURL=compiler.js.map