# GitHub Actions

Contains reusable workflows and actions for CoreMedia GitHub workflows.

We'll start with reusable workflows and might change (some of) them to actions later on.

## Reusable Workflows

The reusable workflows are located in the directory `.github/workflows`. See the `*.yml` files of
the workflows for usage information and description of `inputs`, `secrets` and `outputs`.

### Hints

Most of the provided workflows checkout the project's source code. These workflows provide an input
`checkout_ref` to allow builds on another branch or ref then the one that triggered the run. It can
e.g. be used to enable scheduled (nightly) builds on maintenance branches - workflows triggered by
cron schedules normally only work on the default branch.
