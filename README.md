# BusinessFlow

An interactive business process visualization and optimization tool built with React, React Flow, and MobX state management, following MVVM architecture.

## Project Overview

BusinessFlow enables users to create, visualize, and optimize business process workflows through an intuitive drag-and-drop interface. The application demonstrates implementation of modern front-end technologies and architectural patterns.

![BusinessFlow Screenshot](public/screenshot.png)

## Features

- Create and edit business process workflows
- Visualize workflows with React Flow
- Interactive node editing: rename, move, and delete nodes
- Connect nodes with customizable edges
- Store and manage workflow data via JSON Server API
- Proper state management with MobX and MobX Keystone
- Clean separation of concerns with MVVM architecture
- Complete employee management with department organization
- CRUD operations for employees with interactive forms

## Technology Stack

- **Frontend**: React with TypeScript
- **State Management**: MobX + MobX Keystone
- **Visualization**: React Flow
- **UI Components**: Ant Design
- **Mock API**: JSON Server
- **Hosting**: Caddy

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the JSON Server (in a separate terminal):
   ```
   npm run start:server
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Alternatively, run both with a single command:
   ```
   npm run dev
   ```

## Deployment

To deploy the application using Caddy:

1. Build the application:
   ```
   ./build.sh
   ```
2. Start the Caddy server:
   ```
   ./start.sh
   ```
3. The application will be available at the configured domain (businessflow.ikgagan.com)

## TypeScript Configuration

If you encounter TypeScript errors, see [TYPESCRIPT_SETUP.md](TYPESCRIPT_SETUP.md) for detailed instructions on how to resolve them. The project includes:

- Custom type definitions for external libraries like ReactFlow and MobX Keystone
- Declaration merging for models to ensure proper type checking
- Configuration for path aliases and type roots

## MVVM Architecture

This project follows the Model-View-ViewModel (MVVM) architecture:

- **Models** (`src/models/`): Core data entities like Process, Node, and Edge
- **ViewModels** (`src/viewmodels/`): Business logic and state management with MobX
- **Views** (`src/views/` and `src/components/`): React components for the UI
- **Services** (`src/services/`): Handles communication with the API

## Key Components

### Models
- **ProcessModel**: Represents a business process with nodes and edges
- **NodeModel**: Represents different steps in a business process
- **EdgeModel**: Represents connections between nodes
- **EmployeeModel**: Represents company employees with skills and department information

### ViewModels
- **ProcessViewModel**: Manages the list of processes and their CRUD operations
- **FlowEditorViewModel**: Handles editing operations for process flows
- **FlowRenderViewModel**: Manages the visualization of flows
- **PeopleViewModel**: Manages employee data and CRUD operations
- **RootStore**: Central store providing access to all ViewModels

### Views
- **Dashboard**: Shows all processes with actions
- **ProcessViewer**: Displays a read-only view of a process
- **ProcessEditor**: Allows creating and editing processes
- **People**: Manages employee data organized by department

## Working with the Application

1. The Dashboard shows all available processes
2. Click "Create New Process" to create a new workflow
3. In the Process Editor:
   - Add nodes using the toolbar
   - Connect nodes by dragging from one node's handle to another
   - Edit node properties by selecting a node and modifying its details in the properties panel
   - Move nodes by dragging them in the editor
   - Edit process details using the form at the top
   - Click "Save" to save your changes
4. Use the View mode to see a read-only representation of your process
5. Navigate to the People page to manage employees:
   - View employees organized by department
   - Add new employees with detailed information and skills
   - Edit existing employee data
   - Delete employees with confirmation

## Troubleshooting

### Common Issues

1. **Unable to Move Nodes**: If you encounter issues with node movement, ensure that your browser console doesn't show any errors. If you see an error related to `updatePosition`, check that your model implementation correctly handles direct property updates.

2. **Connection Issues**: When connecting nodes, ensure you're dragging from a source handle to a target handle. Not all node types support connections in all directions (e.g., Start nodes don't have input connections).

3. **API Connection Errors**: If you see API errors, verify that your JSON Server is running correctly with `npm run start:server`. Check that the server is accessible at the expected URL.

4. **Type Errors**: If you encounter TypeScript errors, refer to the [TYPESCRIPT_SETUP.md](TYPESCRIPT_SETUP.md) document for guidance on resolving them.

5. **Data Structure Errors**: If you see errors about "Cannot read properties of undefined", it might be related to missing position data for nodes. The application has multiple layers of validation to prevent this, but if you're extending the code, ensure all nodes have valid position objects with x and y coordinates.

### Debugging

The application includes several features to help with debugging:

- Check the browser console for detailed error messages
- Most error states are displayed in the UI with helpful messages
- The application state can be inspected using MobX DevTools (if installed)
- Data validation is implemented across multiple layers (ViewModel, API service, React Flow components)

## Project Structure

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
└── README.md               # This file
```

## Development Process

This project was developed using AI-assisted development techniques with the Cursor IDE. The development process is documented in:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed architecture documentation
- [PROMPTS.md](PROMPTS.md) - Documentation of AI-assisted development

## License

MIT 