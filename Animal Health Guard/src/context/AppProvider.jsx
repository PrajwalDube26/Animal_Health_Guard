import { UserProvider } from "./UserContext";
import { AdminProvider } from "./AdminContext";
import { FarmProvider } from "./FarmContext";
import { AlertProvider } from "./AlertContext";
import { RecordProvider } from "./RecordContext";
import { BioAssigProvider } from "./BioAssigContext";
import { TrainingModuleProvider } from "./TrainingModuleContext";
import { UserTrainingProvider } from "./UserTrainingContext";
import { UserAlertProvider } from "./UserAlertContext";
import { FarmAssignmentProvider } from "./FarmAssignmentContext";

export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <AdminProvider>
        <FarmProvider>
          <AlertProvider>
            <RecordProvider>
              <BioAssigProvider>
                <TrainingModuleProvider>
                  <UserTrainingProvider>
                    <UserAlertProvider>
                      <FarmAssignmentProvider>
                        {children}
                      </FarmAssignmentProvider>
                    </UserAlertProvider>
                  </UserTrainingProvider>
                </TrainingModuleProvider>
              </BioAssigProvider>
            </RecordProvider>
          </AlertProvider>
        </FarmProvider>
      </AdminProvider>
    </UserProvider>
  );
};

export default AppProvider;