import * as releaseNoteMappings from "./release-note-mappings.json";
import * as core from "@actions/core";

export async function run(): Promise<void> {
  try {
    const pullRequestTitle = core.getInput("pull-request-title", { required: true });

    const packageId = pullRequestTitle.replace(/^.*Bump (.+) from .+$/g, "$1") as keyof typeof releaseNoteMappings;
    const updateInfo = pullRequestTitle.replace(/^.+ (from \S+ to \S+).*$/g, "$1");

    const packageInfo = releaseNoteMappings[packageId];
    if (packageInfo) {
      core.setOutput("release-note", `- [${packageInfo.name}|${packageInfo.link}] ${updateInfo}`);
    } else {
      core.setOutput("release-note", `- ${packageId} ${updateInfo}`);
      core.setOutput("not-found-msg", `No release note mapping found for the package '${packageId}'. Please add a mapping for that package to the [release-note-mappings.json](/CoreMedia/github-actions/blob/main/release-note-generator/src/release-note-mappings.json).`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
