# GitHub Actions

Contains reusable workflows and actions for CoreMedia GitHub workflows.

We'll start with reusable workflows and might change (some of) them to actions later on.

## Reusable Workflows

> [!IMPORTANT]  
> The reusable workflows are now **deprecated**! It turned out that our projects are too different
> to provide reusable workflows that fit all. To support more and more projects the complexity of
> these workflows increased to a point where their maintenance did not seem reasonable anymore, and
> so we decided to deprecate them. The only exception is the `debug.yml` workflow, which can still
> be used (temporarily) to print out information about the environment and the workflow run that can
> be used when developing new workflows. 

The reusable workflows are located in the directory `.github/workflows`. See the `*.yml` files of
the workflows for usage information and description of `inputs`, `secrets` and `outputs`.

### Hints

Most of the provided workflows checkout the project's source code. These workflows provide an input
`checkout_ref` to allow builds on another branch or ref then the one that triggered the run. It can
e.g. be used to enable scheduled (nightly) builds on maintenance branches - workflows triggered by
cron schedules normally only work on the default branch.

## Running GitHub Workflows locally with nektos/act

In development mode it is convenient to be able to execute GitHub Workflows locally.
This way you do not need to push your changes to GitHub in order to see the outcome of a run.
A popular tool for this is [nektos/act](https://github.com/nektos/act).
In the following installation, usage and limitations are explained.

### Installation

The installation process for nektos/act is described [here](https://github.com/nektos/act#installation) in detail.
GitHub Workflows are executed on runners. Act uses docker containers for this.
Therefore, a docker installation is required.

When running act the first time, you will be asked to set the default docker image to use for the workflow runs.
They differ in size and therefore also in tools they provide. Beware, the large image is about 20 GB in size and might
take some time to download.
You can change the configured image to use at a later point in time via a `~/.actrc` file or the `-P` flag as
described [here](https://github.com/nektos/act#configuration).

### Usage

Information on how to run act can be gathered by calling `act --help`.

`act push --reuse -W .github/workflows/maven.yml --secret-file my.secrets`

With this command, act executes the Maven workflow as if it was triggered by a `push` event (default and can be
omitted).
It uses the `my.secrets` file to find secrets the workflow uses and does not remove the used container (`--reuse`).

The [triggering event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) is the first
argument to the act command. It must be configured to trigger the workflow in order for the workflow to actually run.

Workflows can rely on secrets and environment variables which GitHub collects from the repository settings. When running
workflows locally with act, you need to pass those to act yourself. For secrets and environment variables this can be
done via one of the [specified methods](https://github.com/nektos/act#secrets) (`--secret-file` or `--secret`).
Workflows, which can be triggered manually (event `workflow_dispatch`), might rely on inputs. They can be passed
as described [here](https://github.com/nektos/act#pass-inputs-to-manually-triggered-workflows) (`--input-file`
or `--input`).

As there might be some limitations which originate in running a workflow locally or nektos/act itself, it might be
necessary to [skip certain jobs](https://github.com/nektos/act#pass-inputs-to-manually-triggered-workflows)
or [skip specific steps](https://github.com/nektos/act#skipping-steps) when running a workflow locally. A scenarios
could be that sending a notification is not wanted when executing a workflow locally.

### Limitations

Act [does not come with all functionality GitHub Actions does](https://github.com/nektos/act#default-runners-are-intentionally-incomplete).

- Different images have different tools available. When you are using the middle-sized or small image and a command is
  not found it could be, that using the large image resolves this issue.
- Cache Action [is not supported by act](https://github.com/nektos/act/issues/285) and
  also [not planned to be supported](https://github.com/nektos/act/issues/329). The `--reuse` flag is the closest you
  get to a "cache" with the act defaults.
- Trying to run only specific jobs via the `--job` flag does not seem to work as reliable as running entire workflows
