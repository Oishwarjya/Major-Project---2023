"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print_es = exports.parse_es = exports.wrap_in_function = exports.fix_esexports = exports.remove_void0 = exports.fix_esmodule = exports.rename_exports = exports.rewrite_deps = exports.collect_deps = exports.collect_imports = exports.collect_exports = exports.remove_use_strict = exports.insert_class_name = exports.relativize_modules = exports.apply = void 0;
const typescript_1 = __importDefault(require("typescript"));
function apply(node, ...transforms) {
    const result = typescript_1.default.transform(node, transforms);
    return result.transformed[0];
}
exports.apply = apply;
function is_require(node) {
    return typescript_1.default.isCallExpression(node) &&
        typescript_1.default.isIdentifier(node.expression) &&
        node.expression.text === "require" &&
        node.arguments.length === 1;
}
function relativize_modules(relativize) {
    function relativize_specifier(context, source, expr) {
        const { factory } = context;
        if (expr != null && typescript_1.default.isStringLiteralLike(expr) && expr.text.length > 0) {
            const relative = relativize(source.fileName, expr.text);
            if (relative != null)
                return factory.createStringLiteral(relative);
        }
        return null;
    }
    return (context) => {
        return {
            transformSourceFile(root) {
                const { factory } = context;
                function visit(node) {
                    if (typescript_1.default.isImportDeclaration(node)) {
                        const moduleSpecifier = relativize_specifier(context, root, node.moduleSpecifier);
                        if (moduleSpecifier != null) {
                            const { modifiers, importClause, assertClause } = node;
                            return factory.updateImportDeclaration(node, modifiers, importClause, moduleSpecifier, assertClause);
                        }
                    }
                    if (typescript_1.default.isExportDeclaration(node)) {
                        const moduleSpecifier = relativize_specifier(context, root, node.moduleSpecifier);
                        if (moduleSpecifier != null) {
                            const { modifiers, isTypeOnly, exportClause, assertClause } = node;
                            return factory.updateExportDeclaration(node, modifiers, isTypeOnly, exportClause, moduleSpecifier, assertClause);
                        }
                    }
                    if (is_require(node)) {
                        const moduleSpecifier = relativize_specifier(context, root, node.arguments[0]);
                        if (moduleSpecifier != null) {
                            const { expression, typeArguments } = node;
                            return factory.updateCallExpression(node, expression, typeArguments, [moduleSpecifier]);
                        }
                    }
                    return typescript_1.default.visitEachChild(node, visit, context);
                }
                return typescript_1.default.visitNode(root, visit);
            },
            transformBundle(_root) {
                throw new Error("unsupported");
            },
        };
    };
}
exports.relativize_modules = relativize_modules;
function is_static(node) {
    return typescript_1.default.canHaveModifiers(node) && typescript_1.default.getModifiers(node)?.find((modifier) => modifier.kind == typescript_1.default.SyntaxKind.StaticKeyword) != null;
}
function insert_class_name() {
    function has__name__(node) {
        return node.members.find((member) => typescript_1.default.isPropertyDeclaration(member) && member.name.getText() == "__name__" && is_static(member)) != null;
    }
    return (context) => (root) => {
        const { factory } = context;
        function visit(node) {
            node = typescript_1.default.visitEachChild(node, visit, context);
            if (typescript_1.default.isClassDeclaration(node) && node.name != null && !has__name__(node)) {
                const property = factory.createPropertyDeclaration(factory.createModifiersFromModifierFlags(typescript_1.default.ModifierFlags.Static), "__name__", undefined, undefined, factory.createStringLiteral(node.name.text));
                node = factory.updateClassDeclaration(node, node.modifiers, node.name, node.typeParameters, node.heritageClauses, [property, ...node.members]);
            }
            return node;
        }
        return typescript_1.default.visitNode(root, visit);
    };
}
exports.insert_class_name = insert_class_name;
function remove_use_strict() {
    return (context) => (root) => {
        const { factory } = context;
        const statements = root.statements.filter((node) => {
            if (typescript_1.default.isExpressionStatement(node)) {
                const expr = node.expression;
                if (typescript_1.default.isStringLiteral(expr) && expr.text == "use strict")
                    return false;
            }
            return true;
        });
        return factory.updateSourceFile(root, statements);
    };
}
exports.remove_use_strict = remove_use_strict;
function collect_exports(exported) {
    return (_context) => (root) => {
        for (const statement of root.statements) {
            if (typescript_1.default.isExportDeclaration(statement)) {
                if (statement.isTypeOnly)
                    continue;
                const { exportClause, moduleSpecifier } = statement;
                if (moduleSpecifier == null || !typescript_1.default.isStringLiteral(moduleSpecifier))
                    continue;
                const module = moduleSpecifier.text;
                if (exportClause == null) {
                    // export * from "module"
                    exported.push({ type: "namespace", module });
                }
                else if (typescript_1.default.isNamespaceExport(exportClause)) {
                    // export * as name from "module"
                    const name = exportClause.name.text;
                    exported.push({ type: "namespace", name, module });
                }
                else if (typescript_1.default.isNamedExports(exportClause)) {
                    // export {name0, name1 as nameA} from "module"
                    const bindings = [];
                    for (const elem of exportClause.elements) {
                        bindings.push([elem.propertyName?.text, elem.name.text]);
                    }
                    exported.push({ type: "bindings", bindings, module });
                }
            }
            else if (typescript_1.default.isExportAssignment(statement) && !(statement.isExportEquals ?? false)) {
                // export default name
                exported.push({ type: "named", name: "default" });
            }
            else if (typescript_1.default.isClassDeclaration(statement) || typescript_1.default.isFunctionDeclaration(statement)) {
                const flags = typescript_1.default.getCombinedModifierFlags(statement);
                if (flags & typescript_1.default.ModifierFlags.Export) {
                    // export class X {}
                    // export function f() {}
                    if (statement.name != null) {
                        const name = statement.name.text;
                        exported.push({ type: "named", name });
                    }
                }
                else if (flags & typescript_1.default.ModifierFlags.ExportDefault) {
                    // export default class X {}
                    // export function f() {}
                    exported.push({ type: "named", name: "default" });
                }
            }
        }
        return root;
    };
}
exports.collect_exports = collect_exports;
function isImportCall(node) {
    return typescript_1.default.isCallExpression(node) && node.expression.kind == typescript_1.default.SyntaxKind.ImportKeyword;
}
function collect_imports(imports) {
    return (context) => (root) => {
        function visit(node) {
            if (typescript_1.default.isImportDeclaration(node) || typescript_1.default.isExportDeclaration(node)) {
                const name = node.moduleSpecifier;
                if (name != null && typescript_1.default.isStringLiteral(name) && name.text.length != 0)
                    imports.add(name.text);
            }
            else if (isImportCall(node)) {
                const [name] = node.arguments;
                if (typescript_1.default.isStringLiteral(name) && name.text.length != 0)
                    imports.add(name.text);
            }
            return typescript_1.default.visitEachChild(node, visit, context);
        }
        return typescript_1.default.visitNode(root, visit);
    };
}
exports.collect_imports = collect_imports;
function collect_deps(source) {
    function traverse(node) {
        if (is_require(node)) {
            const [arg] = node.arguments;
            if (typescript_1.default.isStringLiteral(arg) && arg.text.length > 0)
                deps.add(arg.text);
        }
        typescript_1.default.forEachChild(node, traverse);
    }
    const deps = new Set();
    traverse(source);
    return [...deps];
}
exports.collect_deps = collect_deps;
function rewrite_deps(resolve) {
    return (context) => (root) => {
        const { factory } = context;
        function visit(node) {
            if (is_require(node)) {
                const [arg] = node.arguments;
                if (typescript_1.default.isStringLiteral(arg) && arg.text.length > 0) {
                    const dep = arg.text;
                    const val = resolve(dep);
                    if (val != null) {
                        const literal = typeof val == "string" ? factory.createStringLiteral(val) : factory.createNumericLiteral(val);
                        node = factory.updateCallExpression(node, node.expression, node.typeArguments, [literal]);
                        typescript_1.default.addSyntheticTrailingComment(node, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, ` ${dep} `, false);
                    }
                    return node;
                }
            }
            return typescript_1.default.visitEachChild(node, visit, context);
        }
        return typescript_1.default.visitNode(root, visit);
    };
}
exports.rewrite_deps = rewrite_deps;
// XXX: this is pretty naive, but affects very litte code
function rename_exports() {
    return (context) => (root) => {
        const { factory } = context;
        function is_exports(node) {
            return typescript_1.default.isIdentifier(node) && node.text == "exports";
        }
        const has_exports = root.statements.some((stmt) => {
            return typescript_1.default.isVariableStatement(stmt) && stmt.declarationList.declarations.some((decl) => is_exports(decl.name));
        });
        if (has_exports) {
            function visit(node) {
                if (is_exports(node)) {
                    const updated = factory.createIdentifier("exports$1");
                    const original = node;
                    typescript_1.default.setOriginalNode(updated, original);
                    typescript_1.default.setTextRange(updated, original);
                    return updated;
                }
                return typescript_1.default.visitEachChild(node, visit, context);
            }
            return typescript_1.default.visitNode(root, visit);
        }
        else
            return root;
    };
}
exports.rename_exports = rename_exports;
function fix_esmodule() {
    return (context) => (root) => {
        const { factory } = context;
        let found = false;
        const statements = root.statements.map((node) => {
            if (!found && typescript_1.default.isExpressionStatement(node)) {
                const expr = node.expression;
                if (typescript_1.default.isCallExpression(expr) && expr.arguments.length == 3) {
                    const [, arg] = expr.arguments;
                    if (typescript_1.default.isStringLiteral(arg) && arg.text == "__esModule") {
                        found = true;
                        const es_module = factory.createIdentifier("__esModule");
                        const call = factory.createCallExpression(es_module, [], []);
                        return factory.createExpressionStatement(call);
                    }
                }
            }
            return node;
        });
        return factory.updateSourceFile(root, statements);
    };
}
exports.fix_esmodule = fix_esmodule;
function remove_void0() {
    return (context) => (root) => {
        const { factory } = context;
        let found = false;
        const statements = root.statements.filter((node) => {
            if (!found && typescript_1.default.isExpressionStatement(node)) {
                let { expression } = node;
                while (typescript_1.default.isBinaryExpression(expression) &&
                    typescript_1.default.isPropertyAccessExpression(expression.left) &&
                    typescript_1.default.isIdentifier(expression.left.expression) &&
                    expression.left.expression.text == "exports") {
                    expression = expression.right;
                }
                if (typescript_1.default.isVoidExpression(expression)) {
                    found = true;
                    return false;
                }
            }
            return true;
        });
        return factory.updateSourceFile(root, statements);
    };
}
exports.remove_void0 = remove_void0;
function fix_esexports() {
    return (context) => (root) => {
        const { factory } = context;
        const statements = root.statements.map((node) => {
            if (typescript_1.default.isExpressionStatement(node)) {
                const expr = node.expression;
                if (typescript_1.default.isCallExpression(expr) && typescript_1.default.isPropertyAccessExpression(expr.expression) && expr.arguments.length == 3) {
                    const { expression, name } = expr.expression;
                    if (typescript_1.default.isIdentifier(expression) && expression.text == "Object" &&
                        typescript_1.default.isIdentifier(name) && name.text == "defineProperty") {
                        const [exports, name, config] = expr.arguments;
                        if (typescript_1.default.isIdentifier(exports) && exports.text == "exports" &&
                            typescript_1.default.isStringLiteral(name) &&
                            typescript_1.default.isObjectLiteralExpression(config)) {
                            for (const item of config.properties) {
                                if (typescript_1.default.isPropertyAssignment(item) &&
                                    typescript_1.default.isIdentifier(item.name) && item.name.text == "get" &&
                                    typescript_1.default.isFunctionExpression(item.initializer)) {
                                    const { statements } = item.initializer.body;
                                    if (statements.length == 1) {
                                        const [stmt] = statements;
                                        if (typescript_1.default.isReturnStatement(stmt) && stmt.expression != null) {
                                            const es_export = factory.createIdentifier("__esExport");
                                            const call = factory.createCallExpression(es_export, [], [name, stmt.expression]);
                                            return factory.createExpressionStatement(call);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return node;
        });
        return factory.updateSourceFile(root, statements);
    };
}
exports.fix_esexports = fix_esexports;
function wrap_in_function(module_name) {
    return (context) => (root) => {
        const { factory } = context;
        const p = (name) => factory.createParameterDeclaration(undefined, undefined, name);
        const params = [p("require"), p("module"), p("exports"), p("__esModule"), p("__esExport")];
        const block = factory.createBlock(root.statements, true);
        const func = factory.createFunctionDeclaration(undefined, undefined, "_", undefined, params, undefined, block);
        typescript_1.default.addSyntheticLeadingComment(func, typescript_1.default.SyntaxKind.MultiLineCommentTrivia, ` ${module_name} `, false);
        return factory.updateSourceFile(root, [func]);
    };
}
exports.wrap_in_function = wrap_in_function;
function parse_es(file, code, target = typescript_1.default.ScriptTarget.ES2017) {
    return typescript_1.default.createSourceFile(file, code != null ? code : typescript_1.default.sys.readFile(file), target, true, typescript_1.default.ScriptKind.JS);
}
exports.parse_es = parse_es;
function print_es(source) {
    const printer = typescript_1.default.createPrinter();
    return printer.printNode(typescript_1.default.EmitHint.SourceFile, source, source);
}
exports.print_es = print_es;
//# sourceMappingURL=transforms.js.map