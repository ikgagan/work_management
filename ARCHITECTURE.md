# BusinessFlow - Architecture Document

## Project Overview

BusinessFlow is a web application designed to visualize, create, and optimize business processes through an interactive workflow interface. This project is built to demonstrate proficiency in modern frontend technologies including React, React Flow, MobX state management, and MVVM architecture.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **State Management**: MobX + MobX Keystone
- **UI Components**: Ant Design
- **Flow Visualization**: React Flow
- **Graph Visualization**: Sigma.js (optional enhancement)
- **API**: JSON Server (mock backend)
- **Hosting**: Caddy
- **Architecture Pattern**: MVVM (Model-View-ViewModel)

## Architecture Overview

The application follows the MVVM (Model-View-ViewModel) architecture pattern:

1. **Models**: Represent the data structures and business entities
2. **ViewModels**: Contain presentation logic and state management
3. **Views**: Render the UI based on the ViewModels
4. **Services**: Handle communication with external APIs

### MVVM Implementation Details

In our implementation:

- **Models** are created using MobX Keystone's `@model` decorator, which provides built-in state management and immutability.
- **ViewModels** utilize MobX's `makeAutoObservable` to create observable state and actions.
- **Views** are implemented as React components that observe ViewModel state changes via the `observer` HOC.
- The **RootStore** provides a central access point to all ViewModels.

## Folder Structure

```
businessflow/
├── public/                 # Static assets
├── src/
│   ├── models/             # Data models
│   ├── viewmodels/         # ViewModels that contain business logic
│   ├── views/              # React components that render UI
│   ├── components/         # Reusable UI components
│   ├── services/           # API and external service integrations
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions and utilities
├── db.json                 # JSON Server database
├── Caddyfile               # Caddy server configuration
├── setup.sh                # Setup script
├── build.sh                # Build script
├── start.sh                # Start script
├── ARCHITECTURE.md         # This file
├── PROMPTS.md              # Documentation of AI-assisted development
└── README.md               # Project documentation
```

## Key Components

### Models

The core data structures for the application:

- **ProcessModel**: Represents a business process with properties for name, description, and collections of nodes and edges.
  - Provides methods for adding/removing/updating nodes and edges
  - Maintains relationships between connected elements

- **NodeModel**: Represents a step or entity in a process
  - Contains position, label, type, and custom data
  - Provides methods for updating properties

- **EdgeModel**: Represents connections between nodes
  - Stores source and target node IDs
  - Contains type and label information

- **EmployeeModel**: Represents an employee in the organization
  - Contains personal and professional information (name, position, email)
  - Tracks department assignment and join date
  - Maintains a list of skills for each employee
  - Provides methods for updating employee information

### ViewModels

The ViewModels handle state management and business logic:

- **ProcessViewModel**: Manages processes list and CRUD operations
  - Handles loading processes from API
  - Provides methods for creating, updating, and deleting processes
  - Manages process selection and current process state

- **FlowEditorViewModel**: Handles the flow editing operations
  - Manages selected nodes and edges
  - Provides methods for modifying nodes and edges
  - Coordinates user interactions with the flow editor

- **FlowRenderViewModel**: Manages the rendering state of flows
  - Handles React Flow instance
  - Manages viewport and layout
  - Coordinates rendering optimizations

- **PeopleViewModel**: Manages employee data and operations
  - Handles loading employees from API
  - Provides methods for creating, updating, and deleting employees
  - Organizes employees by department
  - Tracks notification states for user feedback
  - Maintains department lists and filtering

- **RootStore**: Central store providing access to all ViewModels
  - Instantiates all ViewModels
  - Facilitates communication between ViewModels
  - Provides a single access point for views

### Views

UI components that consume ViewModels:

- **Dashboard**: Shows all processes and high-level metrics
  - Lists all available processes
  - Provides actions for process management

- **ProcessEditor**: Interactive editor for creating/editing flows
  - Drag-and-drop interface for node management
  - Properties panel for editing selected elements
  - Toolbar for adding new nodes

- **ProcessViewer**: Visualization of processes
  - Read-only view of process flows
  - Navigation and zoom controls

- **People**: Employee management interface
  - Displays employees organized by department
  - Provides statistics on departments and employee counts
  - Offers interactive forms for adding and editing employees
  - Implements confirmation dialogs for deletion
  - Displays employee skills with tag-based visualization

### Services

- **APIService**: Handles communication with the JSON Server backend
  - Provides methods for CRUD operations
  - Handles error management and data transformation

## State Management

MobX is used for state management throughout the application. Key aspects:

- Each ViewModel contains observable state
- Views observe these states and reactively update
- Actions in ViewModels modify state in a predictable manner
- MobX Keystone helps with model creation and modification

### Data Flow Example: Node Operations

When a user interacts with a node (e.g., moves, renames, or deletes it), the following data flow occurs:

1. **User Interaction**: User drags a node in the UI.
2. **React Flow Event**: The `onNodeDragStop` event fires in the ProcessEditor view.
3. **ViewModel Method Call**: The view calls `flowEditorViewModel.updateNodePosition()`.
4. **Model Update**: The ViewModel accesses the ProcessModel and updates the node's position.
5. **UI Update**: MobX reactively updates the UI to reflect the new position.

This pattern ensures:
- Clear separation of concerns
- Predictable state updates
- Reactive UI that automatically reflects state changes
- Business logic contained in ViewModels, not views

## API Design

JSON Server provides a RESTful API with the following endpoints:

- **GET /processes**: List all processes
- **GET /processes/:id**: Get a specific process
- **POST /processes**: Create a new process
- **PUT /processes/:id**: Update a process
- **DELETE /processes/:id**: Delete a process

- **GET /employees**: List all employees
- **GET /employees/:id**: Get a specific employee
- **POST /employees**: Create a new employee
- **PUT /employees/:id**: Update an employee
- **DELETE /employees/:id**: Delete an employee

## Component Interaction

The communication between components follows a unidirectional data flow:

1. **View → ViewModel**: Views call ViewModel methods in response to user actions
2. **ViewModel → Model**: ViewModels update Models
3. **Model → View**: Model changes trigger View updates via MobX observables

This pattern ensures that data flows predictably through the application and that components have clear responsibilities.

## Security Considerations

While this is a demonstration project, security best practices are followed:

- Validation of user inputs
- Protection against common web vulnerabilities
- Secure handling of data

## Performance Considerations

- Optimized renders using React.memo and useMemo where appropriate
- Virtualization for large lists or complex flows
- Efficient state management to minimize re-renders
- Proper React Flow node and edge management

## Debugging and Troubleshooting

The application implements several strategies to facilitate debugging and troubleshooting:

### Error Handling

- Runtime errors are caught and displayed to the user with appropriate context
- API request failures are properly handled with error messages and recovery options
- Form validation errors provide clear guidance to users

### Common Issues and Solutions

1. **Model Property Access vs. Method Calls**
   
   When working with MobX Keystone models, we initially implemented method calls like `node.updatePosition(position)` to modify model properties. However, this approach led to runtime errors when these methods weren't properly available on serialized/deserialized model instances.
   
   The solution was to directly update properties within model actions:
   ```typescript
   @modelAction
   updateNodePosition(nodeId: string, position: { x: number; y: number }) {
     const node = this.nodes.find(n => n.id === nodeId);
     if (node) {
       node.position = position; // Direct property update
       this.modified = new Date().toISOString();
     }
   }
   ```
   
   This approach maintains the MVVM pattern by keeping all business logic within models and ViewModels while ensuring reliable property updates.

2. **React Flow Integration**
   
   The integration between our model objects and React Flow requires careful transformation of data structures. We implemented computed properties in the FlowRenderViewModel to transform our models into the format expected by React Flow.

3. **Data Validation and Default Values**
   
   Working with complex data structures like node positions requires comprehensive validation to prevent runtime errors. We implemented multiple layers of validation:
   
   - In the FlowRenderViewModel's computed properties:
     ```typescript
     get flowNodes() {
       return this.process.nodes.map((node, index) => {
         const position = node.position || { x: 0, y: 0 };
         
         if (position.x === undefined || position.y === undefined) {
           position.x = position.x === undefined ? 250 : position.x;
           position.y = position.y === undefined ? 50 + (index * 100) : position.y;
         }
         
         return { /* node properties */ };
       });
     }
     ```
   
   - In the ProcessViewModel's data loading methods to ensure consistent data structures when loading from the API.
   
   - In the API communication layer to ensure valid data is sent to and received from the backend.
   
   This multi-layered approach to validation ensures that our application is robust against data inconsistencies and prevents common runtime errors like "Cannot read properties of undefined."

### Development Tools

During development and debugging, the application benefits from:

- MobX DevTools integration for state observation
- React Developer Tools for component inspection
- Comprehensive logging of critical operations
- TypeScript's static type checking to prevent common errors

## Future Enhancements

Potential areas for future expansion:

- Authentication and user management
- Real-time collaboration
- Advanced analytics and reporting
- Process simulation capabilities
- Integration with external systems
- SigmaJS integration for advanced graph visualization
- Advanced edge routing algorithms 