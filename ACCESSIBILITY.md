# Accessibility

ZikoJS aims to make it possible to build web interfaces that are usable
by as many people as possible, including people who use keyboards,
screen readers, alternative input methods, or other assistive
technologies.

Accessibility is considered both in the development of ZikoJS itself
and in the components and applications built with it. This document
describes our accessibility priorities, contributor expectations, known
limitations, and how to report accessibility barriers.

## Priorities

ZikoJS prioritizes:

* Semantic HTML and native browser accessibility features.
* Keyboard-accessible interactions.
* Logical focus behavior and visible focus indicators.
* Meaningful accessible names, labels, and descriptions.
* Compatibility with screen readers and assistive technologies.
* Appropriate use of ARIA when native HTML semantics are insufficient.
* Accessible handling of interactive states such as disabled, loading,
  expanded, selected, and invalid states.
* Clear and understandable documentation.
* Accessibility considerations for components and APIs that generate or
  manipulate DOM content.

ZikoJS aims to follow established web accessibility practices and the
principles described by WCAG.

These are project goals and do not constitute a claim that ZikoJS or
applications built with it conform to a particular WCAG level.

Accessibility can also depend on how an application uses ZikoJS, its
content, styling, components, and third-party dependencies.

## Contributor expectations

Contributors should consider accessibility when adding or modifying
user-facing functionality.

Where relevant, contributions should:

* Prefer native HTML elements and semantics.
* Ensure interactive functionality can be operated using a keyboard.
* Preserve meaningful focus behavior.
* Provide appropriate accessible names and descriptions.
* Use ARIA only when necessary and use it according to its intended
  semantics.
* Avoid removing or overriding native browser accessibility behavior
  without a clear reason.
* Consider screen-reader behavior for interactive components.
* Include accessibility-related tests when practical.
* Document accessibility considerations for new components or APIs.

For user-facing changes, contributors should provide enough information
in the pull request to explain how accessibility was considered.

If a change affects interaction, focus, keyboard behavior, semantics, or
screen-reader output, contributors are encouraged to describe how the
change was tested.

## Reporting accessibility issues

Accessibility barriers can be reported through the ZikoJS GitHub issue
tracker.

When reporting an accessibility issue, please provide as much of the
following information as is practical:

* The affected package, component, or feature.
* The task you were trying to complete.
* The observed behavior.
* The expected behavior.
* A minimal reproduction when possible.
* The browser and version.
* The operating system.
* The assistive technology or input method involved, when relevant.
* A URL or example demonstrating the issue, when applicable.

Screenshots, recordings, and other attachments are optional.

You do not need to disclose a disability or provide personal
information to report an accessibility issue.

### Severity

Maintainers may assign severity during triage based on how strongly a
barrier affects a user's ability to use the affected functionality.

As a general guideline:

* **Critical** — The affected functionality is effectively unusable
  for some users and there is no reasonable alternative.
* **High** — A significant barrier prevents or substantially interferes
  with completing an important task.
* **Medium** — The functionality remains usable, but a significant
  accessibility barrier makes the experience substantially harder.
* **Low** — The issue causes inconvenience or reduced usability without
  preventing the task from being completed.

Reporters do not need to determine or assign severity.

### How we respond

Maintainers will review accessibility reports as part of the normal
issue-triage process and will determine the appropriate priority.

When possible, maintainers will:

* Acknowledge accessibility reports.
* Clarify the affected behavior when necessary.
* Investigate the issue and its scope.
* Consider available workarounds.
* Track the issue until an appropriate resolution is available.
* Invite reporters to verify fixes when practical.

Response and resolution times may vary depending on the complexity and
scope of the issue.

## Ownership and maintenance

Accessibility is a shared responsibility among ZikoJS maintainers and
contributors.

The project maintainers are responsible for:

* Reviewing accessibility-related issues and pull requests.
* Maintaining this document.
* Tracking known accessibility limitations.
* Encouraging accessible implementation practices.
* Updating project guidance as
