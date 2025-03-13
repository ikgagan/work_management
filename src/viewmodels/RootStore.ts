import { ProcessViewModel } from './ProcessViewModel';
import { FlowEditorViewModel } from './FlowEditorViewModel';
import { FlowRenderViewModel } from './FlowRenderViewModel';
import { PeopleViewModel } from './PeopleViewModel';
import { APIService } from '../services/APIService';

/**
 * RootStore serves as the main state container for the application.
 * It coordinates between different ViewModels and provides a centralized
 * access point for all state management.
 */
export class RootStore {
  processViewModel: ProcessViewModel;
  flowEditorViewModel: FlowEditorViewModel;
  flowRenderViewModel: FlowRenderViewModel;
  peopleViewModel: PeopleViewModel;
  
  constructor() {
    const apiService = new APIService();
    
    // Initialize ViewModels
    this.processViewModel = new ProcessViewModel(apiService);
    this.flowEditorViewModel = new FlowEditorViewModel();
    this.flowRenderViewModel = new FlowRenderViewModel();
    this.peopleViewModel = new PeopleViewModel(apiService);
    
    // Setup coordination between ViewModels
    this.setupViewModelCoordination();
  }
  
  /**
   * Sets up coordination between different ViewModels.
   * This ensures that changes in one ViewModel can affect others when needed.
   */
  private setupViewModelCoordination() {
    // When a process is selected in the process view model, update other ViewModels
    this.processViewModel.onProcessSelected = (process) => {
      if (process) {
        this.flowRenderViewModel.setProcess(process);
      }
    };
    
    // When a process is set in the editor, update the render model
    this.flowEditorViewModel.onProcessSet = (process) => {
      if (process) {
        this.flowRenderViewModel.setProcess(process);
      }
    };
  }
}

// Create a singleton instance
export const rootStore = new RootStore(); 