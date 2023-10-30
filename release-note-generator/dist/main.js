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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const releaseNoteMappings = __importStar(require("./release-note-mappings.json"));
const core = __importStar(require("@actions/core"));
async function run() {
    try {
        const pullRequestTitle = core.getInput("pull-request-title", { required: true });
        const packageId = pullRequestTitle.replace(/^.*Bump (.+) from .+$/g, "$1");
        const updateInfo = pullRequestTitle.replace(/^.+ (from \S+ to \S+).*$/g, "$1");
        const packageInfo = releaseNoteMappings[packageId];
        if (packageInfo) {
            let outputStyle = core.getInput("output-style", { required: true });
            if (outputStyle === 'jira-list-entry') {
                core.setOutput("release-note", `- [${packageInfo.name}|${packageInfo.link}] ${updateInfo}`);
            }
            else {
                core.setOutput("release-note", `Output style ${outputStyle} is not supported. You'll have to assemble a release note yourself with package name '${packageInfo.name}' and release notes link '${packageInfo.link}'.`);
            }
        }
        else {
            core.setOutput("release-note", `- ${packageId} ${updateInfo}`);
            core.setOutput("not-found-msg", `No release note mapping found for the package '${packageId}'. Please add a mapping for that package to the [release-note-mappings.json](/CoreMedia/github-actions/blob/main/release-note-generator/src/release-note-mappings.json).`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
exports.run = run;
run();