import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ChevronRight,
  Loader2,
  Play,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import synergyProjects from "@/data/synergy-2025.json";
import { Project } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { DemoVideoModal } from "@/components/DemoVideoModal";


const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoProject, setVideoProject] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Use synergy-2025 data directly
        setProjects(synergyProjects as any[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [toast]);

  // Stats calculation
  const totalProjects = projects.length;
  const totalRewards = 40; // TODO: Replace with real value or calculation
  const totalTeams = new Set(projects.map((p: any) => p.teamLead)).size;

  // Winning projects from synergy-2025 (first 6)
  const winningProjects = projects.filter((p: any) => p.winner && p.winner !== "").slice(0, 6);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">BlockSpace Stadium</h1>
      </div>
      {/* Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 text-lg font-mono">
        <span>{totalProjects} Active Projects Building 🏗️</span>
        <span className="hidden sm:inline">|</span>
        <span>${totalRewards}K in Unclaimed Rewards 💰</span>
        <span className="hidden sm:inline">|</span>
        <span>{totalTeams} Teams Shipping 🚀</span>
      </div>

      {/* Winning Projects Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-6 text-center text-muted-foreground underline">Congratulations to the winners of the Blockspace Synergy Hackathon 2025</h2>
        {winningProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No Winning Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Winning projects will be displayed here as they are selected.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winningProjects.map((project: any, index) => (
              <Card
                key={project.projectName}
                className="group hover:shadow-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30" variant="secondary">
                      🏆 {project.winner}
                    </Badge>
                  </div>
                  <CardTitle className="capitalize group-hover:text-primary transition-colors text-lg">
                    {project.projectName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {project.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-xs">
                      {project.teamLead}
                    </span>
                  </div>
                </CardContent>
                <CardContent className="pt-0 pb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.techStack && project.techStack !== "" && (
                      <Badge variant="outline" className="text-xs">
                        {project.techStack}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-muted-foreground hover:text-primary bg-gray-100/10 border-gray-300/30"
                      onClick={() => setVideoProject(project)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      <span>View Demo</span>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1 text-muted-foreground hover:text-primary bg-gray-100/10 border-gray-300/30">
                      <Link to="/project-page" className="flex items-center justify-center space-x-2">
                        <span>Project Page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* View All Projects Button */}
      <div className="flex justify-center mt-8">
        <Button asChild size="lg" className="hover:bg-accent hover:text-accent-foreground transition-colors">
          <Link to="/past-projects" className="flex items-center space-x-2">
            <span>View All Past Projects</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      {/* Video Modal */}
      <DemoVideoModal open={!!videoProject} onClose={() => setVideoProject(null)} project={videoProject} />
    </div>
  );
};

export default HomePage;
