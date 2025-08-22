# Coding Agent Guidelines

This document outlines the engineering standards and best practices for coding agents working on this repository. Follow these guidelines to maintain the highest quality codebase and development practices of a senior software engineer and architect.

## Core Engineering Principles

*   **Mindful Development:** Think before you code. Analyze the problem thoroughly, understand the existing architecture, and consider the long-term implications of every change. Always ask yourself: "Is this the simplest solution that solves the problem?"
*   **Minimal Changes:** Make the smallest possible change to achieve the desired outcome. Surgical precision is preferred over broad refactoring unless absolutely necessary. Every line of code added or modified should serve a clear purpose.
*   **Pattern Recognition and Development:** Identify and leverage existing patterns in the codebase. When creating new functionality, establish clear, consistent patterns that other developers can follow. Document architectural decisions that establish new patterns.
*   **Verification First:** After every modification, verify the change works as intended using appropriate tools and tests. Source code is the single source of truth - always edit source files, never build artifacts.

## Software Engineering Standards

*   **DRY (Don't Repeat Yourself):** Eliminate code duplication through abstraction, shared utilities, and reusable components. If you find yourself writing similar code twice, extract it into a reusable function or module.
*   **SOLID Principles:** 
    - Single Responsibility: Each function/class should have one reason to change
    - Open/Closed: Open for extension, closed for modification
    - Liskov Substitution: Objects should be replaceable with instances of their subtypes
    - Interface Segregation: Depend on abstractions, not concretions
    - Dependency Inversion: High-level modules should not depend on low-level modules
*   **Code Quality:** Write self-documenting code with clear variable names, function names, and structure. Comments should explain "why", not "what". Maintain consistent formatting and style throughout the codebase.
*   **Test-Driven Development:** When practical, write failing tests before implementing features. Ensure all changes have appropriate test coverage. Run tests early and often to prevent regressions.

## Architecture and Design

*   **Understand Before Modifying:** Before making any changes, thoroughly understand the existing architecture, dependencies, and data flow. Read related code, understand the context, and identify potential side effects.
*   **Consistency is King:** Follow existing code patterns, naming conventions, and architectural decisions. When in doubt, mirror the style and structure of similar existing code.
*   **Performance Considerations:** Consider the performance impact of every change. Avoid premature optimization, but be mindful of algorithmic complexity, memory usage, and network calls.
*   **Security First:** Always consider security implications. Validate inputs, sanitize outputs, follow principle of least privilege, and never commit sensitive information.

## Code Organization and Structure

*   **Clear Separation of Concerns:** Organize code into logical modules with clear boundaries. Business logic, data access, and presentation layers should be clearly separated.
*   **Meaningful Abstractions:** Create abstractions that hide complexity while revealing intent. Interfaces and abstract classes should represent real-world concepts or clear architectural boundaries.
*   **Error Handling:** Implement robust error handling with meaningful error messages. Fail fast when possible, and provide clear recovery paths when failures are expected.
*   **Documentation Standards:** Maintain up-to-date documentation for public APIs, complex algorithms, and architectural decisions. Code should be self-explaining, but context and reasoning should be documented.

## Development Workflow

*   **Environment Setup:** Understand the project setup requirements by examining:
    - `package.json` for dependencies and scripts
    - Project README.md for environment setup instructions  
    - Configuration files for build tools, linters, and test frameworks
    - Create setup documentation when gaps exist to help future contributors
*   **Incremental Development:** Make small, testable changes. Each commit should represent a logical unit of work that can be reviewed and tested independently.
*   **Feedback Integration:** Approach feedback as an opportunity to improve code quality. Address feedback systematically and comprehensively, ensuring all concerns are resolved before considering the work complete.

## Project Standards

*   **Configuration Consistency:** Follow established configuration patterns for linting, formatting, building, and testing. Maintain consistency across all configuration files.
*   **Dependency Management:** Be conservative with new dependencies. Evaluate alternatives, consider bundle size impact, and ensure dependencies are actively maintained and secure.
*   **Version Control:** Write clear, descriptive commit messages following the project's conventions. Group related changes into atomic commits that tell a coherent story.
*   **Code Review Readiness:** Structure changes to facilitate easy code review. Separate refactoring from feature work, include tests with implementation, and provide clear explanations for complex changes.

## Commit Message Standards

*   **Conventional Commits:** Use the Conventional Commits specification for all commit messages:
    ```
    <type>[optional scope]: <description>

    [optional body]

    [optional footer(s)]
    ```
*   **Commit Types:** Use appropriate types that clearly communicate the nature of the change:
    *   `feat`: New features or functionality
    *   `fix`: Bug fixes and corrections
    *   `docs`: Documentation changes only
    *   `style`: Code style changes (formatting, semicolons, etc.)
    *   `refactor`: Code changes that neither fix bugs nor add features
    *   `perf`: Performance improvements
    *   `test`: Adding or correcting tests
    *   `build`: Build system or external dependency changes
    *   `ci`: Continuous integration configuration changes
    *   `chore`: Other changes that don't modify src or test files
*   **Breaking Changes:** Clearly indicate breaking changes with `!` after the type/scope or in the footer with `BREAKING CHANGE:`
*   **Descriptive Messages:** Write commit messages that clearly explain both what changed and why, enabling easy understanding during code review and debugging.
