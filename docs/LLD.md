# Low Level Design (LLD) Document
## Web Agent - AI-Powered Autonomous Browser Navigation

---

## 1. Design Patterns & Strategies

### 1.1 Strategy Pattern
**Where to Use:**
- **`src/navigation/NavigationStrategy.ts`** - Different navigation algorithms (breadth-first, depth-first, goal-oriented, random exploration)
- **`src/llm/LLMClient.ts`** - Support multiple LLM providers (OpenAI, Anthropic, Ollama) with interchangeable strategies
- **`src/browser/PageExtractor.ts`** - Different extraction strategies (DOM-based, screenshot-based, accessibility tree-based)
- **`src/agent/AgentState.ts`** - Different state persistence strategies (in-memory, file-based, database)

**Why:**
- Allows runtime selection of algorithms without changing client code
- Makes it easy to add new navigation strategies or LLM providers
- Enables A/B testing of different approaches

---

### 1.2 Factory Pattern
**Where to Use:**
- **`src/browser/BrowserController.ts`** - Factory for creating browser instances (Chromium, Firefox, WebKit)
- **`src/llm/LLMClient.ts`** - Factory for creating LLM client instances based on provider type
- **`src/navigation/RoutePlanner.ts`** - Factory for creating different route planning algorithms

**Why:**
- Encapsulates object creation logic
- Centralizes browser/LLM initialization
- Simplifies adding new browser types or LLM providers

---

### 1.3 Observer Pattern
**Where to Use:**
- **`src/agent/WebAgent.ts`** - Notify observers (loggers, event handlers) when agent state changes
- **`src/browser/BrowserController.ts`** - Notify on page navigation, errors, or browser events
- **`src/agent/AgentState.ts`** - Notify when state updates (URL visited, action taken, error occurred)

**Why:**
- Decouples event producers from consumers
- Enables logging, monitoring, and debugging without tight coupling
- Allows multiple listeners (console, file, metrics) without modifying core logic

---

### 1.4 Command Pattern
**Where to Use:**
- **`src/browser/ActionExecutor.ts`** - Encapsulate browser actions (click, type, scroll, navigate) as command objects
- **`src/agent/WebAgent.ts`** - Queue and execute commands, support undo/redo for navigation
- **`src/navigation/NavigationStrategy.ts`** - Represent navigation decisions as executable commands

**Why:**
- Enables action queuing and batching
- Supports undo/redo functionality (go back in navigation)
- Makes actions testable and loggable
- Allows action replay for debugging

---

### 1.5 State Pattern
**Where to Use:**
- **`src/agent/AgentState.ts`** - Different agent states (idle, navigating, waiting, error, completed)
- **`src/browser/BrowserController.ts`** - Browser states (initializing, ready, navigating, closed)

**Why:**
- Manages complex state transitions
- Prevents invalid operations (e.g., navigate when browser is closed)
- Makes state management explicit and testable

---

### 1.6 Template Method Pattern
**Where to Use:**
- **`src/agent/WebAgent.ts`** - Define the agent execution loop (observe → decide → act → evaluate) as a template
- **`src/navigation/NavigationStrategy.ts`** - Base navigation algorithm with customizable steps

**Why:**
- Defines the skeleton of the algorithm
- Allows subclasses to override specific steps
- Ensures consistent execution flow across different strategies

---

### 1.7 Builder Pattern
**Where to Use:**
- **`src/agent/WebAgent.ts`** - Build agent instances with complex configuration
- **`src/browser/BrowserController.ts`** - Build browser instances with various options
- **`src/llm/PromptBuilder.ts`** - Build complex prompts with different sections and contexts

**Why:**
- Simplifies construction of complex objects
- Makes configuration readable and flexible
- Supports optional parameters with sensible defaults

---

### 1.8 Adapter Pattern
**Where to Use:**
- **`src/browser/BrowserController.ts`** - Adapter to abstract Playwright/Puppeteer differences
- **`src/llm/LLMClient.ts`** - Adapter to normalize different LLM API responses to a common format
- **`src/navigation/URLResolver.ts`** - Adapter to handle different URL formats and resolve relative URLs

**Why:**
- Allows switching between Playwright and Puppeteer without changing agent code
- Normalizes different LLM provider APIs
- Makes the system more flexible and testable

---

### 1.9 Singleton Pattern (Use Sparingly)
**Where to Use:**
- **`src/utils/logger.ts`** - Single logger instance across the application
- **`src/agent/AgentConfig.ts`** - Global configuration instance (if needed)

**Why:**
- Ensures single instance for shared resources
- **Note:** Use dependency injection instead where possible for better testability

---

### 1.10 Chain of Responsibility Pattern
**Where to Use:**
- **`src/utils/errors.ts`** - Error handling chain (retry → fallback → log → fail)
- **`src/navigation/RoutePlanner.ts`** - Chain of navigation validators (URL valid → not visited → accessible)

**Why:**
- Decouples error handling logic
- Allows flexible error recovery strategies
- Makes validation logic composable

---

## 2. Architectural Strategies

### 2.1 Layered Architecture
**Layers:**
1. **Presentation/Entry Layer** (`src/index.ts`, `src/examples/`)
2. **Agent/Orchestration Layer** (`src/agent/`)
3. **Service Layer** (`src/browser/`, `src/llm/`, `src/navigation/`)
4. **Utility/Infrastructure Layer** (`src/utils/`, `src/types/`)

**Why:**
- Clear separation of concerns
- Easy to test each layer independently
- Allows swapping implementations (e.g., different LLM providers)

---

### 2.2 Dependency Injection
**Where to Use:**
- **All service classes** - Inject dependencies through constructors
- **`src/agent/WebAgent.ts`** - Inject BrowserController, LLMClient, NavigationStrategy
- **`src/browser/BrowserController.ts`** - Inject configuration, logger

**Why:**
- Improves testability (can inject mocks)
- Reduces coupling between components
- Makes dependencies explicit

---

### 2.3 Repository Pattern
**Where to Use:**
- **`src/agent/AgentState.ts`** - Abstract state persistence (in-memory, file, database)
- **`src/navigation/URLResolver.ts`** - Abstract URL resolution logic

**Why:**
- Separates data access from business logic
- Makes it easy to switch storage backends
- Simplifies testing with in-memory implementations

---

### 2.4 Event-Driven Architecture
**Where to Use:**
- **`src/agent/WebAgent.ts`** - Emit events for state changes, actions taken, errors
- **`src/browser/BrowserController.ts`** - Emit events for page loads, navigation, errors
- **Event bus** - Central event system for cross-component communication

**Why:**
- Loose coupling between components
- Enables real-time monitoring and logging
- Supports future features (webhooks, metrics collection)

---

## 3. Component Design Strategies

### 3.1 Single Responsibility Principle
**Apply to:**
- **`BrowserController`** - Only manages browser lifecycle, not navigation logic
- **`PageExtractor`** - Only extracts page data, doesn't make decisions
- **`ActionExecutor`** - Only executes actions, doesn't decide what to do
- **`LLMClient`** - Only handles LLM communication, doesn't parse responses
- **`DecisionParser`** - Only parses LLM responses, doesn't communicate with LLM

**Why:**
- Each class has one reason to change
- Easier to test and maintain
- Clear boundaries between components

---

### 3.2 Interface Segregation
**Where to Use:**
- **`src/types/Browser.ts`** - Separate interfaces for browser operations (IBrowserController, IPageExtractor, IActionExecutor)
- **`src/types/LLM.ts`** - Separate interfaces for LLM operations (ILLMClient, IPromptBuilder)
- **`src/types/Agent.ts`** - Separate interfaces for agent operations (IAgent, IAgentState)

**Why:**
- Clients only depend on interfaces they use
- Prevents fat interfaces
- Makes mocking easier

---

### 3.3 Open/Closed Principle
**Where to Use:**
- **Navigation strategies** - Open for extension (new strategies), closed for modification
- **LLM providers** - Add new providers without changing existing code
- **Extraction methods** - Add new extraction methods without modifying existing ones

**Why:**
- System is extensible without breaking existing functionality
- Reduces risk of introducing bugs

---

## 4. Data Flow Strategy

### 4.1 Unidirectional Data Flow
**Flow:**
```
User Input → WebAgent → NavigationStrategy → LLMClient → DecisionParser
                                                              ↓
BrowserController ← ActionExecutor ← DecisionParser ← LLMClient
     ↓
PageExtractor → AgentState → WebAgent (loop)
```

**Why:**
- Predictable data flow
- Easier to debug
- Clear ownership of data

---

### 4.2 Immutable State Updates
**Where to Use:**
- **`src/agent/AgentState.ts`** - Return new state objects instead of mutating existing ones
- **Navigation history** - Append-only history, never modify past entries

**Why:**
- Prevents accidental state corruption
- Enables time-travel debugging
- Makes state changes traceable

---

## 5. Error Handling Strategy

### 5.1 Result/Either Pattern
**Where to Use:**
- **All async operations** - Return `Result<T, Error>` instead of throwing
- **`src/browser/BrowserController.ts`** - Navigation returns Result<Page, NavigationError>
- **`src/llm/LLMClient.ts`** - API calls return Result<Response, LLMError>

**Why:**
- Makes errors explicit in type system
- Forces error handling at call sites
- Prevents unhandled exceptions

---

### 5.2 Retry Strategy Pattern
**Where to Use:**
- **`src/utils/errors.ts`** - Retry logic for transient failures (network errors, timeouts)
- **LLM API calls** - Retry with exponential backoff
- **Browser actions** - Retry failed clicks/navigation

**Why:**
- Handles transient failures gracefully
- Improves reliability
- Configurable retry policies

---

### 5.3 Circuit Breaker Pattern
**Where to Use:**
- **`src/llm/LLMClient.ts`** - Circuit breaker for LLM API calls
- **`src/browser/BrowserController.ts`** - Circuit breaker for browser operations

**Why:**
- Prevents cascading failures
- Fails fast when service is down
- Allows recovery when service comes back

---

## 6. Concurrency Strategy

### 6.1 Async/Await Pattern
**Where to Use:**
- **All I/O operations** - Browser operations, LLM API calls, file operations
- **Agent execution loop** - Sequential async operations with proper error handling

**Why:**
- Clean, readable async code
- Better error handling than callbacks
- Native TypeScript support

---

### 6.2 Queue Pattern
**Where to Use:**
- **`src/browser/ActionExecutor.ts`** - Queue browser actions to prevent race conditions
- **`src/agent/WebAgent.ts`** - Queue navigation decisions

**Why:**
- Prevents concurrent browser actions
- Ensures actions execute in order
- Simplifies debugging

---

## 7. Configuration Strategy

### 7.1 Configuration Object Pattern
**Where to Use:**
- **`src/agent/AgentConfig.ts`** - Centralized configuration with defaults
- **`src/browser/BrowserController.ts`** - Browser configuration object
- **`src/llm/LLMClient.ts`** - LLM configuration object

**Why:**
- Single source of truth for configuration
- Type-safe configuration
- Easy to validate and document

---

### 7.2 Environment-Based Configuration
**Where to Use:**
- **`.env` files** - API keys, URLs, feature flags
- **`config/` directory** - Environment-specific configs (dev, prod, test)

**Why:**
- Separates configuration from code
- Easy to switch between environments
- Keeps secrets out of code

---

## 8. Testing Strategy

### 8.1 Dependency Injection for Testing
**Where to Use:**
- **All service classes** - Inject test doubles (mocks, stubs, fakes)
- **`src/browser/BrowserController.ts`** - Mock Playwright for unit tests
- **`src/llm/LLMClient.ts`** - Mock LLM API responses

**Why:**
- Isolated unit tests
- Fast test execution
- No external dependencies in tests

---

### 8.2 Test Doubles Strategy
**Where to Use:**
- **Mocks** - Verify interactions (e.g., verify LLM was called with correct prompt)
- **Stubs** - Return predefined responses (e.g., stub LLM response)
- **Fakes** - Lightweight implementations (e.g., in-memory state storage)

**Why:**
- Different test doubles for different purposes
- Balance between test speed and realism

---

## 9. Logging & Observability Strategy

### 9.1 Structured Logging
**Where to Use:**
- **`src/utils/logger.ts`** - Structured logs with levels (debug, info, warn, error)
- **All components** - Log important events with context

**Why:**
- Easy to parse and analyze logs
- Better debugging experience
- Enables log aggregation tools

---

### 9.2 Context Propagation
**Where to Use:**
- **Request/Agent ID** - Track all logs for a single agent run
- **Correlation IDs** - Link related events across components

**Why:**
- Trace agent execution end-to-end
- Debug complex flows
- Monitor performance

---

## 10. Performance Strategy

### 10.1 Lazy Loading
**Where to Use:**
- **Browser initialization** - Only launch browser when needed
- **LLM client** - Only initialize when first request is made
- **Page extraction** - Only extract data when needed

**Why:**
- Faster startup time
- Lower memory usage
- Better resource management

---

### 10.2 Caching Strategy
**Where to Use:**
- **LLM responses** - Cache similar prompts/responses
- **Page data** - Cache extracted page data for visited URLs
- **Navigation decisions** - Cache decision results for similar contexts

**Why:**
- Reduces API calls
- Faster execution
- Lower costs

---

## 11. Security Strategy

### 11.1 Input Validation
**Where to Use:**
- **`src/utils/validators.ts`** - Validate URLs, configuration, user inputs
- **URL resolution** - Sanitize and validate URLs before navigation
- **LLM prompts** - Validate prompt content to prevent injection

**Why:**
- Prevents security vulnerabilities
- Prevents invalid operations
- Better error messages

---

### 11.2 Secret Management
**Where to Use:**
- **Environment variables** - Store API keys, credentials
- **Never commit secrets** - Use `.env.example` for documentation

**Why:**
- Prevents credential leaks
- Follows security best practices

---

## 12. Extension Points

### 12.1 Plugin Architecture (Future)
**Where to Use:**
- **Custom navigation strategies** - Allow users to add custom strategies
- **Custom extractors** - Allow custom page extraction methods
- **Custom actions** - Allow custom browser actions

**Why:**
- Extensibility without modifying core code
- Community contributions
- Flexible system

---

## Summary

**Key Design Principles:**
1. **Separation of Concerns** - Each component has a single, well-defined responsibility
2. **Dependency Injection** - All dependencies injected, not created internally
3. **Interface-Based Design** - Depend on interfaces, not implementations
4. **Error Handling** - Explicit error handling with Result types
5. **Testability** - All components easily testable with mocks
6. **Extensibility** - Easy to add new strategies, providers, or features
7. **Configuration** - Centralized, type-safe configuration
8. **Observability** - Comprehensive logging and event emission

**Pattern Priority:**
1. **High Priority:** Strategy, Factory, Dependency Injection, Result Pattern
2. **Medium Priority:** Observer, Command, Builder, Adapter
3. **Low Priority:** Singleton, Chain of Responsibility (use sparingly)

---

*This LLD document should guide implementation decisions. Update as the system evolves.*
