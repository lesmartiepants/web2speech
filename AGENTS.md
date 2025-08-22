# Coding Agent Guidelines

This document outlines the rules and best practices for AI coding agents working on this repository. These guidelines are based on GitHub Copilot documentation and community-driven best practices, designed to work with any coding assistant including Jules, GitHub Copilot, and other AI development tools.

## General Principles

*   **Proactive Problem Solving:** AI agents should strive to solve problems autonomously, but should ask for clarification when the user's request is ambiguous, when stuck after trying multiple approaches, or when a decision would significantly alter the scope of the original request.
*   **Verify Work:** After every action that modifies the state of the codebase, agents should use read-only tools (like `read_file`, `ls`, or `grep`) to confirm that the action was executed successfully and had the intended effect.
*   **Edit Source, Not Artifacts:** If an agent determines a file is a build artifact (e.g., located in a `dist`, `build`, or `target` directory), it should not edit it directly. Instead, trace the code back to its source and make changes there.
*   **Proactive Testing:** For any code change, agents should attempt to find and run relevant tests to ensure changes are correct and have not caused regressions. When practical, practice test-driven development by writing a failing test first.

## Task Scoping

*   **Clear and Well-Scoped Tasks:** AI agents work best when assigned clear, well-scoped tasks. An ideal task includes:
    *   A clear description of the problem to be solved or the work required.
    *   Complete acceptance criteria on what a good solution looks like (e.g., should there be unit tests?).
    *   Directions about which files need to be changed.

*   **Task Types:** AI agents are well-suited for tasks such as fixing bugs, altering user interface features, improving test coverage, updating documentation, improving accessibility, and addressing technical debt. They may struggle with complex, broadly scoped tasks that require cross-repository knowledge, deep domain knowledge, or substantial business logic.

## Providing Context

*   **Custom Instructions:** AI agents should look for project-specific instructions in common locations such as:
    - `.github/copilot-instructions.md` for GitHub Copilot specific instructions
    - `AGENTS.md` (this file) for general agent guidelines  
    - Project README.md for overall project context and setup instructions
    - If agent-specific instruction files don't exist, agents may create them when beneficial for the project.
*   **Path-Specific Instructions:** Look for and use path-specific instructions in the `.github/instructions/` directory to understand how to work with specific file types.

## Iterating on Work

*   **Feedback and Iteration:** AI agents should understand that work may not be perfect on the first try. They are designed to iterate on work based on user feedback. Users can mention agents in pull request comments to request changes.
*   **Batching Comments:** To ensure that agents address all feedback in a single pass, it is best for users to batch comments by creating a review, rather than leaving individual comments.

## Environment Setup

*   **Pre-installing Dependencies:** To improve performance, agents should look for setup files such as:
    - `copilot-setup-steps.yml` for GitHub Copilot environment preparation
    - `package.json` scripts for project-specific setup commands
    - Project README.md for environment setup instructions
    - If setup files don't exist, agents may create them when beneficial for the project workflow.

## Specific Rules

*   **Markdown for Documentation:** Always use Markdown for documentation and README files.
*   **README.md Structure:** Maintain the existing structure of the README.md file.
*   **Agent Instructions:** Keep agent-specific instructions organized and well-documented. Update relevant documentation when adding new guidelines.
*   **Best Practices:** Maintain consistency in capitalization and punctuation throughout the repository. When creating documentation, use clear and descriptive language.
*   **File Organization:** Follow the existing project structure and maintain consistency with established patterns.

## Commit Message Guidelines

*   **Conventional Commits:** AI agents should use the Conventional Commits specification to generate commit messages. The commit message should be structured as follows:
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
