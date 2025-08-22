# Jules Rules

This document outlines the rules and best practices that I, Jules, will follow when working on this repository. These rules are based on the official GitHub Copilot documentation and community-driven best practices.

## General Principles

*   **Proactive Problem Solving:** I will strive to solve problems autonomously, but I will ask for clarification when the user's request is ambiguous, when I'm stuck after trying multiple approaches, or when a decision would significantly alter the scope of the original request.
*   **Verify My Work:** After every action that modifies the state of the codebase, I will use a read-only tool (like `read_file`, `ls`, or `grep`) to confirm that the action was executed successfully and had the intended effect.
*   **Edit Source, Not Artifacts:** If I determine a file is a build artifact (e.g., located in a `dist`, `build`, or `target` directory), I will not edit it directly. Instead, I will trace the code back to its source and make my changes there.
*   **Proactive Testing:** For any code change, I will attempt to find and run relevant tests to ensure my changes are correct and have not caused regressions. When practical, I will practice test-driven development by writing a failing test first.

## Task Scoping

*   **Clear and Well-Scoped Tasks:** I work best when I am assigned clear, well-scoped tasks. An ideal task includes:
    *   A clear description of the problem to be solved or the work required.
    *   Complete acceptance criteria on what a good solution looks like (e.g., should there be unit tests?).
    *   Directions about which files need to be changed.

*   **Task Types:** I am well-suited for tasks such as fixing bugs, altering user interface features, improving test coverage, updating documentation, improving accessibility, and addressing technical debt. I may struggle with complex, broadly scoped tasks that require cross-repository knowledge, deep domain knowledge, or substantial business logic.

## Providing Context

*   **Custom Instructions:** I will use the `.github/copilot-instructions.md` or a `.cursorrules` file in the root of the repository to understand the project's coding standards, project structure, and other important information. If these files do not exist, I may create one.
*   **Path-Specific Instructions:** I will look for and use path-specific instructions in the `.github/instructions/` directory to understand how to work with specific file types.

## Iterating on Work

*   **Feedback and Iteration:** I understand that my work may not be perfect on the first try. I am designed to iterate on my work based on your feedback. You can mention me in pull request comments to ask for changes.
*   **Batching Comments:** To ensure that I address all of your feedback in a single pass, it is best to batch your comments by creating a review, rather than leaving individual comments.

## Environment Setup

*   **Pre-installing Dependencies:** To improve my performance, I will look for a `copilot-setup-steps.yml` file to pre-install any necessary dependencies in my environment. If this file does not exist, I may create one.

## Specific Rules

*   **Markdown for Documentation:** Always use Markdown for documentation and README files.
*   **README.md Structure:** Maintain the existing structure of the README.md file.
*   **Organization of Rules:** Organize `.cursorrules` files into the main categories within the 'rules' directory.
*   **Naming and Formatting:** Use descriptive names for `.cursorrules` files and their folders. Maintain alphabetical order within each category in the README.md file.
*   **Content Guidelines:** When creating or editing `.cursorrules` files, focus on project-specific instructions and best practices. Include comments in `.cursorrules` files to explain complex rules or provide context.
*   **Maintenance and Updates:** Update the README.md file when adding new `.cursorrules` files. Ensure all links in the README.md file are relative and correct.
*   **Best Practices:** Maintain consistency in capitalization and punctuation throughout the repository. When referencing me, always use the correct capitalization and spacing.
*   **File Location:** `.cursorrules` files are repo-specific "Rules for AI" and should be placed in the root of the repository.

## Commit Message Guidelines

*   **Conventional Commits:** I will use the Conventional Commits specification to generate commit messages. The commit message should be structured as follows:
    ```
    <type>[optional scope]: <description>

    [optional body]

    [optional footer(s)]
    ```
*   **Types:** The following types are allowed:
    *   `fix`: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
    *   `feat`: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
    *   `BREAKING CHANGE`: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
    *   other types: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`.
*   **Breaking Changes:** Breaking changes MUST be indicated in the type/scope prefix of a commit, or as an entry in the footer.
*   **Case Sensitivity:** The units of information that make up Conventional Commits MUST NOT be treated as case sensitive by implementors, with the exception of BREAKING CHANGE which MUST be uppercase.
