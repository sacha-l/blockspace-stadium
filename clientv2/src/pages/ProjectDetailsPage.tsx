import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Trophy,
  Loader2,
  Clipboard,
  CheckCircle,
  FileText,
  Circle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectApi } from "@/lib/mockApi";
import { useToast } from "@/hooks/use-toast";
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';
import { SiwsMessage } from '@talismn/siws';
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<false | 'updateAddress' | 'edit'>(false);
  const [editFields, setEditFields] = useState<any>({});
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerSig, setRegisterSig] = useState('');
  // Add state for modal and form fields
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Talisman Connect
  // const { selectedAccount, connect, disconnect, accounts } = useWallets(); // Removed

  // useEffect(() => {
  //   if (selectedAccount) {
  //     setConnectedAddress(selectedAccount.address);
  //   } else {
  //     setConnectedAddress(null);
  //   }
  // }, [selectedAccount]); // Removed

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const projectData = await projectApi.getProject(id);
        if (projectData) {
          setProject(projectData);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id, toast]);

  // Start editing
  const startEdit = () => {
    setEditFields({
      projectName: project.projectName,
      description: project.description,
      teamLead: project.teamLead,
      githubRepo: project.githubRepo,
      demoUrl: project.demoUrl,
      slidesUrl: project.slidesUrl,
      techStack: project.techStack,
      milestones: project.milestones ? [...project.milestones] : [],
    });
    setEditMode('edit');
  };

  // Save edits (mock)
  const saveEdit = () => {
    setProject((prev: any) => ({ ...prev, ...editFields }));
    setEditMode(false);
    toast({ title: 'Project updated (mock)', description: 'Your changes have been saved locally.' });
  };

  // Wallet connect logic
  const connectWallet = async () => {
    await web3Enable('Hackathonia');
    const accounts = await web3Accounts();
    if (accounts.length > 0) {
      setConnectedAddress(accounts[0].address);
    } else {
      toast({ title: 'No wallet found', description: 'Please install Polkadot{.js} extension or Talisman.' });
    }
  };

  const handleRegisterTeamAddress = async () => {
    if (!registerAddress) {
      toast({ title: 'Enter an address to register.' });
      return;
    }
    try {
      const siws = new SiwsMessage({
        domain: window.location.hostname,
        uri: window.location.origin,
        address: registerAddress,
        nonce: Math.random().toString(36).slice(2),
        statement: "Registering team address for Hackathonia"
      });
      const accounts = await web3Accounts();
      const account = accounts.find(a => a.address === registerAddress);
      if (!account) {
        toast({ title: 'Address not found in wallet.' });
        return;
      }
      const injector = await web3FromSource(account.meta.source);
      const signed = await siws.sign(injector);
      setRegisterSig(signed.signature);
      toast({ title: 'Address registered (mock)', description: `Signature: ${signed.signature.slice(0, 16)}...` });
    } catch (err: any) {
      toast({ title: 'Signature failed', description: err.message || String(err) });
    }
  };

  // Demo status booleans (replace with real logic as needed)
  const eventStarted = true;
  const bountyPaid = false;
  const milestoneDelivered = false;

  // Add handler for adding/removing deliverables
  const addDeliverable = () => setDeliverables([...deliverables, ""]);
  const removeDeliverable = (idx: number) => setDeliverables(deliverables.filter((_, i) => i !== idx));
  const updateDeliverable = (idx: number, value: string) => setDeliverables(deliverables.map((d, i) => i === idx ? value : d));

  // Handler for form submit
  const handleDeliverableSubmit = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      // Connect wallet and sign with SIWS
      await web3Enable('Hackathonia');
      const accounts = await web3Accounts();
      const account = accounts[0];
      if (!account) throw new Error("No wallet found");
      if (project.donationAddress && account.address !== project.donationAddress) {
        setFormError("You must sign in with the project team address to submit deliverables.");
        setFormLoading(false);
        return;
      }
      const siws = new SiwsMessage({
        domain: window.location.hostname,
        uri: window.location.origin,
        address: account.address,
        nonce: Math.random().toString(36).slice(2),
        statement: "Submit milestone deliverables for Hackathonia"
      });
      const injector = await web3FromSource(account.meta.source);
      await siws.sign(injector);
      // Mock API call to save milestone
      const newMilestone = `${milestoneName}: ${milestoneDesc}\n${deliverables.map((d, i) => `- ${d}`).join("\n")}`;
      setProject((prev: any) => ({ ...prev, milestones: [...(prev.milestones || []), newMilestone] }));
      setDeliverableModalOpen(false);
      setMilestoneName("");
      setMilestoneDesc("");
      setDeliverables([""]);
    } catch (err: any) {
      setFormError(err.message || String(err));
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading project details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>All Active Projects</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 1. Remove Clipboard button (copy address)
  // 2. Move 'Team Name(s)' to a new line after description
  // 3. Remove 'Verify Team Address (SIWS)' section from the top card
  // 4. Remove timeline graphic from outside the cards
  // 5. Remove Connect Wallet and Claim Payout buttons
  // 6. In the lower card, right below the timeline, render the donationAddress and a small 'Update Team Address' button

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <Header />
      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8 px-2 sm:px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>All Active Projects</span>
              </Link>
            </Button>
          </div>
          {/* Wallet connection and address */}
          <div className="flex items-center gap-4 mb-4">
            {connectedAddress ? (
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">Welcome {connectedAddress}, stay ontop of milestone reviews and payouts for your team.</span>
            ) : (
              <Button size="sm" onClick={connectWallet}>Connect Wallet</Button>
            )}
            {connectedAddress && connectedAddress === project.donationAddress && !editMode && (
              <Button size="sm" variant="outline" onClick={startEdit}>Edit</Button>
            )}
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Top Project Card (wider) */}
            <Card className="w-full max-w-full sm:max-w-4xl p-2 sm:p-4">
              <CardHeader className="pb-2 relative">
                {/* Badge in top right */}
                {project.winner && (
                  <div className="absolute right-4 top-4 mt-0 sm:mt-4">
                    <Badge
                      className={
                        project.winner.toLowerCase().includes("kusama")
                          ? "bg-purple-600/20 text-purple-300 border-purple-600/30"
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }
                      variant="secondary"
                    >
                      🏆 {project.winner
                        .split(" ")
                        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(" ")}
                    </Badge>
                  </div>
                )}
                {/* Add vertical space below the label and before the heading */}
                {project.winner && <div className="h-8 sm:h-10" />}
                {/* Project Title */}
                <CardTitle className="text-xl sm:text-2xl mb-2">{project.projectName}</CardTitle>
                {/* Team Name(s) below title */}
                {project.teamLead && (
                  <span className="block text-sm text-white mb-2">Team Name: {project.teamLead}</span>
                )}
                <p className="text-sm sm:text-base text-muted-foreground mb-2">{project.description}</p>
                {/* Tech stack badges with improved spacing */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {project.techStack}
                    </Badge>
                  </div>
                )}
                <div className="flex gap-3 mt-4 flex-wrap">
                  {project.githubRepo && (
                    <Button variant="outline" asChild>
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <span>Source Code</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button variant="outline" asChild>
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Live Demo</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  )}
                  {project.slidesUrl && (
                    <Button variant="outline" asChild>
                      <a href={project.slidesUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Slides</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Timeline and Milestone Card (normal width, below) */}
            <Card className="w-full max-w-full sm:max-w-4xl p-2 sm:p-4 relative">
              {/* Timeline graphic at the top */}
              <div className="flex items-center justify-center gap-8 mb-6 mt-2 px-4">
                {/* Event Start */}
                <div className="flex flex-col items-center">
                  <button className={`rounded-full p-2 ${eventStarted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}> <CheckCircle className="h-6 w-6" /> </button>
                  <span className="text-xs mt-2">{project.eventStartedAt || 'Event Start'}</span>
                </div>
                <div className="h-1 w-12 bg-muted rounded" />
                {/* Bounty Payout */}
                <div className="flex flex-col items-center">
                  <button className="rounded-full p-2 bg-yellow-400 text-black border-2 border-yellow-500 shadow"> <CheckCircle className="h-6 w-6" /> </button>
                  <span className="text-xs mt-2 text-yellow-600 font-semibold">Bounty Payout</span>
                </div>
                <div className="h-1 w-12 bg-muted rounded" />
                {/* Milestone Delivered */}
                <div className="flex flex-col items-center">
                  <button className={`rounded-full p-2 ${milestoneDelivered ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}> <CheckCircle className="h-6 w-6" /> </button>
                  <span className="text-xs mt-2">Milestone Delivered</span>
                </div>
              </div>
              {/* Team Address section */}
              <div className="mb-6">
                <h4 className="font-semibold text-base mb-2 text-green-400">Team Address</h4>
                {project.donationAddress && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-white">Current registered address: {project.donationAddress.slice(0, 6)}...{project.donationAddress.slice(-4)}</span>
                    {editMode === 'updateAddress' && (
                      <div className="flex gap-2 mt-1">
                        <input
                          className="flex-1 border rounded px-2 py-1 text-xs"
                          value={registerAddress}
                          onChange={e => setRegisterAddress(e.target.value)}
                          placeholder="New Polkadot address"
                          style={{ minWidth: 0 }}
                        />
                        <Button size="sm" className="text-xs px-2 py-1" onClick={handleRegisterTeamAddress}>Sign & Update</Button>
                      </div>
                    )}
                    {registerSig && editMode === 'updateAddress' && (
                      <div className="text-xs text-muted-foreground break-all">Signature: {registerSig}</div>
                    )}
                    <Button size="sm" variant="default" className="text-xs px-3 py-1 mt-1" onClick={() => setEditMode(editMode === 'updateAddress' ? false : 'updateAddress')}>Update Team Address</Button>
                  </div>
                )}
              </div>
              {/* Create Team Multisig section */}
              <div className="mb-6">
                <h4 className="font-semibold text-base mb-2 text-green-400">Create Team Multisig</h4>
                <span className="text-gray-400 text-sm">Coming soon</span>
              </div>
              {/* Milestone work in progress section */}
              <h3 className="font-semibold mb-2 text-base text-green-400">Milestone work in progress</h3>
              {project.milestones && project.milestones.length > 0 ? (
                <div className="mb-4">
                  <ul className="list-disc pl-6 space-y-1">
                    {project.milestones.map((m: string, i: number) => (
                      <li key={i} className="text-white text-xs sm:text-sm">{m}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mb-4 text-white text-xs sm:text-sm">No milestones confirmed.</div>
              )}
              <div className="flex justify-center mt-4">
                <Button size="sm" variant="outline" className="bg-yellow-200/80 text-yellow-900 font-semibold px-6 py-2 rounded shadow hover:bg-yellow-300 transition-colors" onClick={() => setDeliverableModalOpen(true)}>
                  Upload or update deliverables
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Built with ❤️ by WebZero.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/JoinWebZero/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://x.com/JoinWebZero"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Modal for deliverable upload */}
      <Dialog open={deliverableModalOpen} onOpenChange={setDeliverableModalOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload or Update Deliverables</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Milestone Name</label>
              <input className="w-full border rounded px-2 py-1" value={milestoneName} onChange={e => setMilestoneName(e.target.value)} placeholder="Enter milestone name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Milestone Description</label>
              <textarea className="w-full border rounded px-2 py-1" value={milestoneDesc} onChange={e => setMilestoneDesc(e.target.value)} placeholder="Describe the milestone" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">List of Deliverables</label>
              <div className="space-y-2">
                {deliverables.map((d, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input className="flex-1 border rounded px-2 py-1" value={d} onChange={e => updateDeliverable(i, e.target.value)} placeholder={`Deliverable ${i + 1}`} />
                    {deliverables.length > 1 && (
                      <Button size="icon" variant="ghost" onClick={() => removeDeliverable(i)}><span className="text-lg">&times;</span></Button>
                    )}
                  </div>
                ))}
                <Button size="sm" variant="outline" className="mt-1" onClick={addDeliverable}>Add Deliverable</Button>
              </div>
            </div>
            {formError && <div className="text-red-500 text-sm mt-2">{formError}</div>}
          </div>
          <DialogFooter>
            <Button onClick={handleDeliverableSubmit} disabled={formLoading} className="bg-green-500 text-white hover:bg-green-600 px-6 py-2 rounded">
              {formLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailsPage;
