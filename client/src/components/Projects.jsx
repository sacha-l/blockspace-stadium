import SubmitMilestone1Form from "../SubmitMilestone1Form";

const ProjectsTab = ({ sessionAddress, formData, onInputChange, loaded }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Submit Milestone 1</h2>
        <p className="text-gray-600">
          Submit your hackathon MVP and demonstrate your core functionality to
          the judges
        </p>
      </div>
    </div>
    <SubmitMilestone1Form
      sessionAddress={sessionAddress}
      onInputChange={onInputChange}
      loaded={loaded}
      formData={formData}
    />
  </div>
);

export default ProjectsTab;
